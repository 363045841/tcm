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

// 定义 props
const props = withDefaults(
  defineProps<{
    item: Array<Item>; // 数据项
    title: string; // 图表标题
    limit: number;
  }>(),
  {
    item: () => [], // 默认值是一个空数组
    title: "默认标题", // 默认值是一个字符串
    limit: 3, // 默认值是一个数字
  }
);

const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 动态计算最大值和限制值
const maxCount = computed(() => Math.max(...props.item.map((i) => i.count)));
const realLimit = computed(() =>
  maxCount.value <= 10 ? 0 : props.limit
);

// 动态生成饼图数据
const pieData = computed(() =>
  props.item
    .filter((item) => item.count > realLimit.value)
    .map((item) => ({
      value: item.count,
      name: item.name,
    }))
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
        text: props.title || "饼图示例",
        left: "left",
        textStyle: {
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        bottom: "0",
      },
      series: [
        {
          name: props.title || "数据分布",
          type: "pie",
          radius: "50%",
          data: pieData.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
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