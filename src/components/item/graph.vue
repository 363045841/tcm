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

echarts.use([GraphChart, TooltipComponent, CanvasRenderer]);

const chartRef = ref(null);
let chartInstance: echarts.ECharts | null = null;
let data: RelatedInfoFinalRes[] = {} as RelatedInfoFinalRes[];
let tcmName: string = "";
let router = useRouter();

interface dataOption {
  name: string;
  value: number;
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
      linksOptionArray.length = 0;
      // 构造echarts中心
      for (let item of data) {
        dataOptionArray.push({ name: item.tcmName, value: 10 });
        linksOptionArray.push({ source: tcmName, target: item.tcmName });
      }
      // 扩展边缘节点
      // 并发请求药材关系数据
      try {
        let response = await Promise.all(
          data.map((item) => getMedicineRelation(item.related_tcm_id))
        );
        let index = 0;
        for (let item of response) {
          for (let res of item) {
            dataOptionArray.push({ name: res.tcmName, value: 10 });
            linksOptionArray.push({
              source: data[index].tcmName,
              target: res.tcmName,
            });
          }
          index++;
        }
      } catch (error) {
        console.error(error);
      }

      let dataOptionSet = new Set(dataOptionArray.map((item) => item.name));
      dataOptionArray.push({ name: tcmName, value: 40 });
      dataOptionArray = Array.from(dataOptionSet).map((name) => ({
        name,
        value: 10,
      }));

      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        chartInstance.setOption({
          tooltip: {},
          series: [
            {
              type: "graph",
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
                edgeLength: 50,
                gravity: 0.1,
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
