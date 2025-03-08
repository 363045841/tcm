<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

interface Item {
  name: string;
  count: number;
}

// 定义 props
let props = defineProps({
  item: Array<Item>, // 数据项
  title: String, // 图表标题
  limit: Number,
});

// 动态生成饼图数据
let pieData = props.item
  ? props.item.map((item) => {
      if (item.count > (props.limit ?? 3)) {
        return { value: item.count, name: item.name };
      }
    })
  : [];

const chart = ref<HTMLElement | null>(null);

onMounted(() => {
  if (chart.value) {
    const myChart = echarts.init(chart.value);

    // 配置项
    const option = {
      title: {
        text: props.title || "饼图示例", // 图表标题
        left: "left", // 标题居中
        textStyle: {
          fontSize: 15, // 标题字体大小
        },
      },
      tooltip: {
        trigger: "item", // 提示框触发方式
        formatter: "{a} <br/>{b}: {c} ({d}%)", // 提示框内容格式
      },
      legend: {
        orient: "vertical", // 图例垂直排列
        left: "right", // 图例位置
      },
      series: [
        {
          name: props.title || "数据分布", // 系列名称
          type: "pie", // 图表类型为饼图
          radius: "50%", // 饼图半径
          data: pieData, // 动态生成的数据
          emphasis: {
            itemStyle: {
              shadowBlur: 10, // 高亮时的阴影效果
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    // 设置配置项并渲染图表
    myChart.setOption(option);
  }
});
</script>

<style scoped></style>
