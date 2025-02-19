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

echarts.use([GraphChart, TooltipComponent, CanvasRenderer]);

const chartRef = ref(null);
let chartInstance: echarts.ECharts | null = null;
let data: RelatedInfoFinalRes[] = {} as RelatedInfoFinalRes[];
let tcmName: string = "";
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
    eventBus.on("sendMedName", (res) => {
      tcmName = res as string;
      console.log("接收到药材名称：", tcmName);
      for (let item of data) {
        dataOptionArray.push({ name: item.tcmName, value: 10 });
        linksOptionArray.push({ source: tcmName, target: item.tcmName });
      }
      dataOptionArray.push({ name: tcmName, value: 40 });

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
                edgeLength: 200,
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
      }
    });
  });
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
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
