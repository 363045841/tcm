<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import * as echarts from "echarts";

interface Item {
  name: string;
  count: number;
}

const props = defineProps({
  item: Array<Item>,
  title: String,
});

const chart = ref<HTMLElement | null>(null);

const dataOptions = computed(() => {
  return props.item ? props.item.map((item) => item.count) : [];
});

const indicatorOptions = computed(() => {
  const maxData = Math.max(...dataOptions.value);
  return props.item
    ? props.item.map((item) => ({
        name: item.name,
        max: maxData,
      }))
    : [];
});

onMounted(() => {
  if (chart.value) {
    const myChart = echarts.init(chart.value, null, {
      renderer: 'svg', // 使用 SVG 渲染模式
    });
    updateChart(myChart);
  }
});

function updateChart(myChart: echarts.ECharts) {
  const option = {
    title: {
      text: props.title,
      left: "left",
      textStyle: {
        fontSize: 15,
      },
    },
    tooltip: {},
    radar: {
      indicator: indicatorOptions.value,
      shape: "circle",
      splitNumber: indicatorOptions.value.length,
      axisName: {
        color: "#333",
      },
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: dataOptions.value,
            name: props.title,
          },
        ],
        areaStyle: {
          opacity: 0.3,
        },
      },
    ],
  };

  myChart.setOption(option);
}

watch(
  () => props.item,
  (newItem) => {
    if (chart.value && newItem) {
      const myChart = echarts.getInstanceByDom(chart.value);
      if (myChart) {
        updateChart(myChart);
      }
    }
  },
  { deep: false }
);
</script>

<style scoped></style>