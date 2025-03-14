<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import * as echarts from "echarts";

interface Item {
  name: string;
  count: number;
}

let props = withDefaults(
  defineProps<{
    item: Array<Item>;
    title: string;
    limit: number;
  }>(),
  {
    item: () => [],
    title: "",
    limit: 15,
  }
);

const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 计算实际限制的数量
const realLimit = computed(() => {
  return props.item.length > props.limit ? props.limit : props.item.length;
});

// 提取数据和名称
const dataOptions = computed(() =>
  props.item.map((item) => item.count).slice(0, realLimit.value)
);
const nameOptions = computed(() =>
  props.item.map((item) => item.name).slice(0, realLimit.value)
);

// 初始化图表
onMounted(() => {
  if (chart.value) {
    myChart = echarts.init(chart.value, null, { renderer: "svg" });
    updateChart();
  }
});

// 更新图表的函数
function updateChart() {
  if (myChart) {
    const option = {
      title: {
        text: props.title,
        left: "left",
        textStyle: {
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: nameOptions.value,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: dataOptions.value,
          type: "bar",
          barWidth: "50%",
        },
      ],
    };
    myChart.setOption(option);
  }
}

// 监听 props 的变化并更新图表
watch(
  () => [props.item, props.title, props.limit],
  () => {
    updateChart();
  },
  { deep: true }
);
</script>

<style scoped></style>