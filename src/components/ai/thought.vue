<script setup lang="tsx">
import { CheckCircleOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { Card, Tag } from 'ant-design-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { tool_tag } from './chat';


type ThinkItemType = 'thought' | 'tool_call';

export interface ThinkItem {
  type: ThinkItemType;
  content: string;
}

// 直接声明 ragList 为 Ref 类型
let props = defineProps<{
  ThinkList: string[];  // ragList 直接作为一个数组类型传入
  isComplete: boolean;
  usingTools: tool_tag[];
}>();


// 定义一个 key 来强制刷新组件
const componentKey = ref(0);
// let isComplete = ref(false);
// 打印 ragList 的内容
/* watchEffect(() => {
  console.log('raglist..', isComplete); // 直接访问
}); */

function getStatusIcon(type: 'thought' | 'tool_call' | 'success' | 'pending' | 'processing') {
  switch (type) {
    case 'thought':
      return <CheckCircleOutlined />;
    case 'tool_call':
      return <SettingOutlined />; // 工具调用专用图标
    case 'success':
      return <CheckCircleOutlined />;
    case 'pending':
      return <LoadingOutlined />;
    case 'processing':
      return <SettingOutlined />;
    default:
      return undefined;
  }
}

// 监视 thinkList 的变化
watch(() => props.ThinkList, (val) => {
  console.log('thinkList updated', val);
}, { deep: true });

// 更新 items 以包含 ragList
const items = computed(() => {
  const toolItems = props.usingTools.length > 0
    ? [
      {
        title: '使用工具',
        status: 'success' as const,
        description: (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {props.usingTools.map((tool: tool_tag) => (
              <Tag
                key={tool.tool_id}
                style={{
                  background: '#f5f7ff',
                  color: '#3a5cff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  margin: '10px 0 0 0',
                }}
              >
                @{tool.tool_name}
              </Tag>
            ))}
          </div>
        ),
        icon: getStatusIcon('success'),
      },
    ]
    : [];

  const thinkItems = props.ThinkList.map(item => ({
    title: item.type === 'thought' ? '思考过程' : 'MCP 工具调用',
    status: item.type === 'thought' ? ('success' as const) : ('processing' as const),
    description: (
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {item.content}
      </div>
    ),
    icon: getStatusIcon(item.type), // 使用 type 来决定图标
    style:
      item.type === 'tool_call'
        ? { backgroundColor: '#f5f7ff', borderLeft: '4px solid #3a5cff' }
        : {},
  }));

  const summaryItem = {
    title: props.isComplete ? '总结完毕' : '模型总结中',
    status: props.isComplete ? 'success' : 'pending',
    description: props.isComplete ? '' : '正在生成摘要...',
    icon: getStatusIcon(props.isComplete ? 'success' : 'pending'),
  };

  return [...toolItems, ...thinkItems, summaryItem];
});


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
