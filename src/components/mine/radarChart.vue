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

let dataOptions = props.item ? props.item.map((item) => item.count) : [];
/* if(dataOptions.length > 0){
  const lastThree = dataOptions.splice(-3);
  const middleIndex = Math.floor(dataOptions.length / 2);
  dataOptions.splice(middleIndex, 0, ...lastThree);
} */
let maxData = Math.max(...dataOptions);

let indicatorOptions = props.item
  ? props.item.map((item) => {
      return {
        name: item.name,
        max: maxData,
      };
    })
  : [];

const chart = ref<HTMLElement | null>(null);

onMounted(() => {
  console.log(dataOptions);
  if (chart.value) {
    const myChart = echarts.init(chart.value);

    // 配置项
    const option = {
      title: {
        text: props.title,
        left: "left",
        textStyle: {
          fontSize: 15
        },
      },
      tooltip: {},
      radar: {
        // 定义雷达图的指示器（维度）
        indicator: indicatorOptions, // 使用传入的指示器配置
        shape: "circle", // 雷达图形状：'polygon' 或 'circle'
        splitNumber: indicatorOptions.length, // 分割段数
        axisName: {
          color: "#333", // 轴名称的颜色
        },
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: dataOptions,
              name: props.title,

            },
          ],
          areaStyle: {
            opacity: 0.3, // 填充区域的透明度
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
