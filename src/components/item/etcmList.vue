<template>
  <v-table style="width: 70%; margin: auto; margin-bottom: 40px">
    <thead>
      <tr>
        <th class="text-left" style="width: 30%"><b>项目</b></th>
        <th class="text-left"><b>数据来自&nbsp;ETCM2.0</b></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="([key, value], rowIndex) in Object.entries(items)"
        :key="rowIndex"
      >
        <td>{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";

const props = withDefaults(defineProps<{ items?: Record<string, any> }>(), {
  items: () => ({}), // 默认值为空对象，确保 Object.entries 不报错
});

console.log(props.items);
</script>

<style scoped></style>
