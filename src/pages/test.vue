<template>
  <div>
    <h1>SSE 流式响应</h1>
    <div id="response-container">
      <p v-for="(chunk, index) in chunks" :key="index">{{ chunk }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ChatStream',
  setup() {
    // 用于存储接收到的每个数据块
    const chunks = ref<string[]>([]);

    // 启动 SSE 流
    const startStream = () => {
      const url = '/api/v1/chat/stream?message=我头痛脑胀&conversation_id=cf9c7310-9096-4e40-b932-b1ca75b324ad';

      // 启动 EventSource 连接
      const eventSource = new EventSource(url);

      // 监听数据流
      eventSource.onmessage = (event) => {
        console.log('Received chunk:', event.data);
        chunks.value.push(event.data); // 将数据块添加到 chunks 数组
      };

      // 监听连接关闭
      eventSource.close = () => {
        console.log('Connection closed');
      };

      // 错误处理
      eventSource.onerror = (error) => {
        console.error('Error occurred:', error);
        eventSource.close();
      };
    };

    // 启动流
    startStream();

    return { chunks };
  },
});
</script>

<style scoped>
/* 样式可根据需要调整 */
#response-container {
  max-height: 400px;
  overflow-y: auto;
}
</style>