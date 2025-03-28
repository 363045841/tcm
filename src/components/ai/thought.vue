<script setup lang="tsx">
import { eventBus } from '@/utils/eventBus';
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { Card } from 'ant-design-vue';
import { ThoughtChain, ThoughtChainItem, type ThoughtChainProps } from 'ant-design-x-vue';
import { defineProps, ref, watchEffect } from 'vue';

// 直接声明 ragList 为 Ref 类型
let props = defineProps<{
  ragList: string[];  // ragList 直接作为一个数组类型传入
  isComplete : boolean;
}>();


// 定义一个 key 来强制刷新组件
const componentKey = ref(0);
// let isComplete = ref(false);
// 打印 ragList 的内容
/* watchEffect(() => {
  console.log('raglist..', isComplete); // 直接访问
}); */

function getStatusIcon(status: ThoughtChainItem['status']) {
  switch (status) {
    case 'success':
      return <CheckCircleOutlined />;
    case 'error':
      return <InfoCircleOutlined />;
    case 'pending':
      return <LoadingOutlined />;
    default:
      return undefined;
  }
}

// 更新 items 以包含 ragList
const items = computed<ThoughtChainProps['items']>(() => [
  {
    title: '检索知识库',
    status: 'success',
    description: `召回了 ${props.ragList.length} 条相关切片`,
    icon: getStatusIcon('success'),
    content: (
      <div style={{ height: '40vh', maxHeight: '40vh', overflowY: 'auto' }}>
        {props.ragList.map((item, index) => (
          <div key={index}>
            <span style={{ fontWeight: 'bold' }}>{index + 1}. </span>
            <p style={{ display: 'inline' }}>{item}</p>
            <br />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: props.isComplete ? '总结完毕' : '模型总结中',
    status: props.isComplete ? 'success' : 'pending',
    description: props.isComplete ? ' ' : '正在生成摘要...',
    icon: props.isComplete ? getStatusIcon('success') : getStatusIcon('pending'),
  },
]);

/* console.log('com',isComplete)

// 监听更新 RAGList 事件
eventBus.on('updateRAGCard', (data: boolean) => {
  // 当接收到更新时，修改 key 值来强制刷新组件
  componentKey.value += 1; // 更新 key，强制刷新
  isComplete.value = data;
  console.log('raglist update', isComplete.value);
}); */
</script>

<template>
  <!-- 使用动态 key 传递给 ThoughtChain 组件，强制组件重新渲染 -->
  <Card style="width: 500px">
    <ThoughtChain :key="componentKey" :items="items" collapsible />
  </Card>
</template>
