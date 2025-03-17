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
  }>(),
  {
    item: () => [], // 默认值是一个空数组
    title: "默认标题", // 默认值是一个字符串
  }
);

const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 动态生成饼图数据
const pieData = computed(() => {
  // 按 count 降序排序
  const sortedItems = [...props.item].sort((a, b) => b.count - a.count);

  // 取前五项
  const topFive = sortedItems.slice(0, 10);

  // 计算剩余项的总和
  const otherCount = sortedItems
    .slice(20)
    .reduce((sum, item) => sum + item.count, 0);

  // 构造饼图数据
  const data = topFive.map((item) => ({
    value: item.count,
    name: item.name,
  }));

  // 如果有剩余项，则添加“其他”
  if (otherCount > 0) {
    data.push({
      value: otherCount,
      name: "其他",
    });
  }

  return data;
});

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
  () => [props.item, props.title],
  () => {
    updateChart();
  },
  { deep: true }
);
</script>

<style scoped></style>