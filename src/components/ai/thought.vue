<script setup lang="tsx">
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, ThoughtChainItem, type ThoughtChainProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXThoughtChainBasic' });

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

const items: ThoughtChainProps['items'] = [
  {
    title: '检索知识库',
    status: 'success',
    description: '找到10个相关文档',
    icon: getStatusIcon('success'),
    content: <p>这就是脑残病，听bvvd说</p>
    // extra: <Button type="text" icon={<MoreOutlined />} />, // 直接传 JSX，不用函数
  },
  {
    title: '模型总结中',
    status: 'pending',
    description: '正在生成摘要...',
    content: '你得了脑残病，快去治疗吧',
    icon: getStatusIcon('pending'),
    
  },
];

</script>

<template>
  <Card style="width: 500px">
    <ThoughtChain :items="items" collapsible/>
  </Card>
</template>
