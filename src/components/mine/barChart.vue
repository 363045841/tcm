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
  
  let props = defineProps({
    item: Array<Item>,
    title: String,
  });
  
  // 提取数据和名称
  let dataOptions = props.item ? props.item.map((item) => item.count) : [];
  let nameOptions = props.item ? props.item.map((item) => item.name) : [];
  
  const chart = ref<HTMLElement | null>(null);
  
  onMounted(() => {
    if (chart.value) {
      const myChart = echarts.init(chart.value);
  
      // 配置项
      const option = {
        title: {
          text: props.title, // 图表标题
          left: "left", // 标题居中
          textStyle: {
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "axis", // 提示框触发方式：'axis' 表示坐标轴触发
        },
        xAxis: {
          type: "category", // 类目轴
          data: nameOptions, // X 轴显示的类别名称
          axisLabel: {
            rotate: 45, // 如果名称过长，可以旋转标签
          },
        },
        yAxis: {
          type: "value", // 数值轴
        },
        series: [
          {
            data: dataOptions, // 数据值
            type: "bar", // 条形图类型
            barWidth: "50%", // 设置柱子宽度
            itemStyle: {
              color: "#4CAF50", // 柱子颜色
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