<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { eventBus } from "@/utils/eventBus";
import { type RelatedInfoFinalRes } from "@/pages/item/[id].vue";
import { getMedicineRelation } from "@/utils/useGetMedicineRelation";
import { TitleComponent } from "echarts/components";

echarts.use([GraphChart, TooltipComponent, CanvasRenderer]);

const chartRef = ref(null);
let chartInstance: echarts.ECharts | null = null;
let data: RelatedInfoFinalRes[] = {} as RelatedInfoFinalRes[];
let tcmName: string = "";
let router = useRouter();

interface dataOption {
  name: string;
  value: number;
  category: number;
}
interface linksOption {
  source: string;
  target: string;
}
let dataOptionArray: dataOption[] = [];
let linksOptionArray: linksOption[] = [];
onMounted(() => {
  eventBus.on("sendRelation", (res) => {
    console.log("接收到数据：", res);
    data = res as RelatedInfoFinalRes[];
    eventBus.on("sendMedName", async (res) => {
      tcmName = res as string;
      console.log("接收到药材名称：", tcmName);
      dataOptionArray.length = 0;
      linksOptionArray.length = 0;0
      // 构造echarts中心
      let categoryMap = new Map<string, number>();
      categoryMap.set(tcmName, 0);
      for (let item of data) {
        dataOptionArray.push({ name: item.tcmName, value: 10, category: 1 });
        categoryMap.set(item.tcmName, 1);
        linksOptionArray.push({ source: tcmName, target: item.tcmName });
      }
      // 扩展边缘节点
      // 并发请求药材关系数据

      try {
        let response = await Promise.all(
          data.map((item) => getMedicineRelation(item.related_tcm_id))
        );
        let index = 0;
        let category = 2;
        for (let item of response) {
          for (let res of item) {
            dataOptionArray.push({
              name: res.tcmName,
              value: 10,
              category: category,
            });
            if (!categoryMap.has(res.tcmName)) {
              categoryMap.set(res.tcmName, category);
            }
            linksOptionArray.push({
              source: data[index].tcmName,
              target: res.tcmName,
            });
          }
          index++;
          // category++;
        }
      } catch (error) {
        console.error(error);
      }

      let dataOptionSet = new Set(dataOptionArray.map((item) => item.name));

      dataOptionArray = Array.from(dataOptionSet).map((name) => ({
        name,
        value: 10,
        category: (dataOptionSet.has(tcmName) ? categoryMap.get(name) : 0) || 0,
      }));

      if (chartRef.value) {
        echarts.use([TitleComponent]);
        chartInstance = echarts.init(chartRef.value);

        chartInstance.setOption({
          tooltip: {},
          title: {
            text: "词条关联", // 设置主标题文本
            // subtext: "副标题", // 设置副标题文本
            left: "center", // 设置主标题的水平位置：'left', 'center', 'right'
            top: "0", // 设置主标题的垂直位置：可以是像素值（'20'），也可以是百分比（'10%'）
            textStyle: {
              fontSize: 20, // 主标题的字体大小
              fontWeight: "bold", // 主标题字体的粗细
              // color: "#333", // 主标题的颜色
            },
            subtextStyle: {
              fontSize: 14, // 副标题的字体大小
              // color: "#aaa", // 副标题的颜色
            },
          },
          series: [
            {
              type: "graph",
              animation: false,
              layout: "force",
              roam: true,
              draggable: true,
              data: dataOptionArray,
              links: linksOptionArray,
              label: {
                show: true,
                color: "#000000",
                fontSize: 12,
                position: "right",
                offset: [10, 0],
              },
              force: {
                repulsion: 500,
                edgeLength: 20,
                gravity: 0.4,
                friction: 0.6,
              },
              edgeSymbol: ["none", "arrow"],
              edgeLabel: {
                show: false,
                formatter: "{c}",
                color: "#333",
                fontSize: 10,
              },
              lineStyle: {
                width: 2,
                color: "#999",
                curveness: 0.1,
              },
              categories: [
                { name: "0", itemStyle: { color: "#CA462F" }, symbolSize: 16 }, // 红色
                { name: "1", itemStyle: { color: "#253D24" }, symbolSize: 15 }, // 绿色
                { name: "2", itemStyle: { color: "#9BB496" }, symbolSize: 10 }, // 蓝色
              ],
            },
          ],
        });
        chartInstance.on("click", (params) => {
          handleClick(params);
        });
        interface IDresponse {
          id: number;
        }

        async function handleClick(params: echarts.ECElementEvent) {
          if (params.dataType === "node") {
            console.log("点击了节点：", params.data);

            try {
              const response = await fetch(
                `http://${import.meta.env.VITE_IP}:${
                  import.meta.env.VITE_BACKEND_PORT
                }/api/v1/medinfo/page/name/${(params.data as dataOption).name}`
              );

              if (!response.ok) {
                throw new Error(`HTTP 错误！状态码: ${response.status}`);
              }

              const data: IDresponse = await response.json();
              console.log("药材ID.json", data.id);
              eventBus.emit("clickMedNameGraph", data.id);
              /* router.push({ path: `/item/${data.id}` });
              eventBus.emit("updateRouterViewKey") */
            } catch (error) {
              console.error("获取数据失败：", error);
            }
          } else if (params.dataType === "edge") {
            console.log("点击了边：", params.data);
          }
        }
      }
    });
  });
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
  chartInstance?.dispose();
  chartInstance = null;
  eventBus.off("sendRelation");
  eventBus.off("sendMedName");
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
