<template>
  <div style="width: 100vh; height: 100vh" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { type ruleRes } from "@/pages/datamine.vue";

echarts.use([GraphChart, TooltipComponent, CanvasRenderer]);

let props = withDefaults(defineProps<{ item: ruleRes[]; limit: number }>(), {
  item: () => ({} as ruleRes[]), // {} 作为默认值
  limit: 100,
});

const chartRef = ref(null);
let chartInstance: echarts.ECharts | null = null;

interface dataOption {
  name: string;
  value: number;
}

interface linksOption {
  source: string;
  target: string;
  value: number; // 添加 value 属性
}

// 数据存储
let dataOptionArray: dataOption[] = [];
let linksOptionArray: linksOption[] = [];

// 初始化图表
function initChart() {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    updateChart();
  }
}

// 更新图表数据
function updateChart() {
  if (!chartInstance) return;

  // 清空旧数据
  dataOptionArray = [];
  linksOptionArray = [];

  // 生成新数据
  let dataOptionMap = new Map<string, dataOption>();
  let linksOptionMap = new Map<string, linksOption>();

  const len = props.item.length;

  for (let i = 0; i < len; i++) {
    let splitBefore = props.item[i].ruleBefore.split("、");
    let splitAfter = props.item[i].ruleAfter.split("、");

    // 生成数据点
    for (const item of splitBefore) {
      if (!dataOptionMap.has(item)) {
        dataOptionMap.set(item, { name: item, value: 1 });
      } else {
        dataOptionMap.get(item)!.value += 1;
      }
    }
    for (const item of splitAfter) {
      if (!dataOptionMap.has(item)) {
        dataOptionMap.set(item, { name: item, value: 1 });
      } else {
        dataOptionMap.get(item)!.value += 1;
      }
    }

    // 生成规则连线
    for (let j = 0; j < splitBefore.length; j++) {
      for (let k = 0; k < splitAfter.length; k++) {
        const source = splitBefore[j];
        const target = splitAfter[k];
        const key = [source, target].sort().join("-"); // 确保顺序一致

        if (!linksOptionMap.has(key)) {
          linksOptionMap.set(key, { source, target, value: 1 }); // 初始化 value 为 1
        } else {
          linksOptionMap.get(key)!.value += 1; // 累加 value
        }
      }
    }
  }

  dataOptionArray = Array.from(dataOptionMap.values());
  linksOptionArray = Array.from(linksOptionMap.values());

  console.log("配置", dataOptionArray, linksOptionArray);

  // 根据 value 计算边的宽度
  const maxLineWidth = 10; // 最大线宽
  const minLineWidth = 1; // 最小线宽
  const maxValue = Math.max(...linksOptionArray.map(link => link.value)); // 获取最大 value

  const seriesData = [
    {
      type: "graph",
      layout: "circular", // 使用 circular 布局
      symbolSize: 20, // 节点大小
      animation: false,
      roam: true,
      draggable: true,
      data: dataOptionArray,
      links: linksOptionArray.map(link => ({
        ...link,
        lineStyle: {
          width: ((link.value / maxValue) * (maxLineWidth - minLineWidth) + minLineWidth),
          color: "#999",
          curveness: 0,
        },
      })),
      title: {
        text: '关联规则可视化', // 动态主标题
        left: "center",
        top: "top",
        textStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#333",
        },
        subtextStyle: {
          fontSize: 14,
          color: "#aaa",
        },
      },
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
      categories: [
        { name: "0", itemStyle: { color: "#CA462F" }, symbolSize: 16 }, // 红色
        { name: "1", itemStyle: { color: "#253D24" }, symbolSize: 15 }, // 绿色
        { name: "2", itemStyle: { color: "#9BB496" }, symbolSize: 10 }, // 蓝色
      ],
    },
  ];

  // 更新图表配置
  chartInstance.setOption({
    series: seriesData,
  });
}

// 在组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 在 props 更新时更新图表
watch(
  () => props.item, // 监听 props.item 的变化
  () => {
    updateChart();
  },
  { deep: true } // 深度监听，确保数组内容变化也能触发
);

// 在组件卸载时销毁图表
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>