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

let props = withDefaults(defineProps<{ item: ruleRes[]; limit: number; name: string }>(), {
  item: () => ({} as ruleRes[]), // {} 作为默认值
  limit: 100,
  name: "",
});

const chartRef = ref(null);
let chartInstance: echarts.ECharts | null = null;

interface dataOption {
  name: string;
  value: number;
  category: number;
}

interface linksOption {
  source: string;
  target: string;
  value: number; // 综合指标值
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
  let dataOptionSet = new Set<string>();
  let linksOptionMap = new Map<string, { source: string; target: string; confidence: number; lift: number }>();

  const len = props.item.length;

  for (let i = 0; i < len; i++) {
    let splitBefore = props.item[i].ruleBefore.split("、");
    let splitAfter = props.item[i].ruleAfter.split("、");

    // 生成数据点
    for (const item of splitBefore) {
      dataOptionSet.add(item);
    }
    for (const item of splitAfter) {
      dataOptionSet.add(item);
    }

    // 生成规则连线
    for (let j = 0; j < splitBefore.length; j++) {
      for (let k = 0; k < splitAfter.length; k++) {
        const source = splitBefore[j];
        const target = splitAfter[k];
        const key = [source, target].sort().join("-"); // 确保顺序一致

        if (!linksOptionMap.has(key)) {
          linksOptionMap.set(key, { source, target, confidence: Number(props.item[i].confidence), lift: Number(props.item[i].lift) });
        } else {
          // 如果已经存在，可以选择累加 confidence 和 lift（或根据需求调整逻辑）
          const existing = linksOptionMap.get(key)!;
          existing.confidence += Number(props.item[i].confidence); // 示例：累加 confidence
          existing.lift += Number(props.item[i].lift); // 示例：累加 lift
        }
      }
    }
  }

  // 转换数据为节点和连线
  dataOptionArray = Array.from(dataOptionSet).map((item) => ({
    name: item,
    value: 1,
    category: item === props.name ? 0 : 2,
  }));

  // 计算综合指标并生成连线数据
  linksOptionArray = Array.from(linksOptionMap.values()).map((link) => {
    // 综合指标计算（可以根据需求调整公式）
    const combinedMetric = link.confidence * link.lift; // 示例公式
    return { source: link.source, target: link.target, value: combinedMetric };
  });

  // 根据 value 计算边的宽度和样式
  const maxLineWidth = 10; // 最大线宽
  const minLineWidth = 1; // 最小线宽
  const maxValue = Math.max(...linksOptionArray.map((link) => link.value)); // 获取最大 value

  const seriesData = [
    {
      type: "graph",
      layout: "circular", // 使用 circular 布局
      symbolSize: 20, // 节点大小
      animation: false,
      roam: true,
      draggable: true,
      data: dataOptionArray,
      links: linksOptionArray.map((link) => ({
        ...link,
        lineStyle: {
          width: ((link.value / maxValue) * (maxLineWidth - minLineWidth) + minLineWidth),
          color: "#999",
          curveness: 0,
          type: link.value <= 10 ? "dashed" : "solid", // 如果权重为1，设置为虚线
        },
      })),
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
      edgeSymbol: ["none", "none"],
      tooltip: {},
      categories: [
        { name: "0", itemStyle: { color: "#CA462F" }, symbolSize: 16 }, // 红色
        { name: "1", itemStyle: { color: "#253D24" }, symbolSize: 15 }, // 绿色
        { name: "2", itemStyle: { color: "#9BB496" }, symbolSize: 16 }, // 蓝色
      ],
    },
  ];

  // 更新图表配置
  chartInstance.setOption({
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        if (params.dataType === "edge") {
          const edge = params.data;
          return `连线: ${edge.source} → ${edge.target}<br>权重: ${edge.value.toFixed(2)}`;
        } else if (params.dataType === "node") {
          const node = params.data;
          return `节点: ${node.name}`;
        }
        return "";
      },
    },
    series: seriesData,
  });
}

// 在组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 在 props 更新时更新图表
watch(
  () => props.item,
  () => {
    updateChart();
  },
  { deep: true }
);

// 在组件卸载时销毁图表
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>