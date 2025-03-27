<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from 'ant-design-x-vue';
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import { Badge, Button, Space, theme } from 'ant-design-vue';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));
const { token } = theme.useToken();

const headerOpen = ref(false);
const content = ref('');
const conversationsItems = ref([{ key: '0', label: 'What is Ant Design X?' }]);
const activeKey = ref('0');
const attachedFiles = ref([]);
const agentRequestLoading = ref(false);

const roles = {
  ai: { placement: 'start', typing: { step: 5, interval: 20 }, styles: { content: { borderRadius: '16px' } } },
  local: { placement: 'end', variant: 'shadow' },
};

const styles = computed(() => ({
  layout: {
    width: '100%',
    height: '722px',
    display: 'flex',
    background: token.value.colorBgContainer,
  },
  menu: { width: '280px', height: '100%', display: 'flex', flexDirection: 'column' },
  chat: { height: '100%', width: '100%', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  sender: { boxShadow: token.value.boxShadow },
}));

const [agent] = useXAgent({
  request: async ({ message }, { onSuccess }) => {
    agentRequestLoading.value = true;
    await sleep();
    agentRequestLoading.value = false;
    onSuccess(`Mock success return. You said: ${message}`);
  },
});

const { onRequest, messages, setMessages } = useXChat({ agent: agent.value });

watch(activeKey, () => setMessages([]), { immediate: true });

const onSubmit = (nextContent: string) => {
  if (!nextContent) return;
  onRequest(nextContent);
  content.value = '';
};

const onAddConversation = () => {
  const newKey = `${conversationsItems.value.length}`;
  conversationsItems.value.push({ key: newKey, label: `New Conversation ${newKey}` });
  activeKey.value = newKey;
};
</script>

<template>
  <div :style="styles.layout">
    <div :style="styles.menu">
      <Button @click="onAddConversation" type="link" icon="PlusOutlined">New Conversation</Button>
      <Conversations :items="conversationsItems" v-model:activeKey="activeKey" />
    </div>
    <div :style="styles.chat">
      <Bubble.List :items="messages" :roles="roles" />
      <Sender v-model="content" :loading="agentRequestLoading" :style="styles.sender" @submit="onSubmit">
        <template #prefix>
          <Badge :dot="attachedFiles.length > 0 && !headerOpen">
            <Button type="text" icon="PaperClipOutlined" @click="headerOpen = !headerOpen" />
          </Badge>
        </template>
      </Sender>
    </div>
  </div>
</template>
