import { defineComponent, computed, ref, watch, type VNode } from "vue";
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  type BubbleListProps,
  BubbleProps,
  Conversations,
  type ConversationsProps,
  Prompts,
  type PromptsProps,
  Sender,
  Suggestion,
  SuggestionProps,
  Welcome,
  useXAgent,
  useXChat,
} from "ant-design-x-vue";
import {
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DislikeOutlined,
  EllipsisOutlined,
  FireOutlined,
  FontSizeOutlined,
  HeartOutlined,
  LikeOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { Badge, Button, Space, Tag, theme, Typography } from "ant-design-vue";
import { eventBus } from "@/utils/eventBus";
import Thought from "./thought.vue";
import markdownit from "markdown-it";

interface Outputs {
  references: any[];
}
interface Content {
  result_type: string;
  event_code: number;
  event_message: string;
  event_type: string;
  event_id: string;
  event_status: string;
  content_type: string;
  visible_scope: string;
  outputs: Outputs;
}
interface ResponseData {
  request_id: string;
  date: string;
  answer: string;
  conversation_id: string;
  message_id: string;
  is_completion: boolean;
  content: Content[];
}

export interface tool_tag {
  tool_name: string;
  tool_id: number;
}

const Chat = defineComponent({
  setup() {
    // 状态管理
    const agentRequestLoading = ref(false);
    const isCompletion = ref(true);
    const headerOpen = ref(false);
    const content = ref(""); // 输入框内容
    const conversationsItems = ref([{ key: "0", label: "新对话" }]); // 左侧对话列表
    const activeKey = ref("0");
    const attachedFiles = ref<AttachmentsProps["items"]>([]);
    const RAGdoc = ref<string[]>([]);
    let usingTools = ref<tool_tag[]>([]);

    // 样式管理
    const { token } = theme.useToken();
    const styles = computed(() => ({
      layout: {
        width: "100%",
        "min-width": "1000px",
        height: "100%",
        "border-radius": `${token.value.borderRadius}px`,
        display: "flex",
        background: `${token.value.colorBgContainer}`,
        "font-family": `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
      },
      menu: {
        background: `${token.value.colorBgLayout}80`,
        width: "280px",
        height: "100%",
        display: "flex",
        "flex-direction": "column",
      },
      conversations: {
        padding: "0 12px",
        flex: 1,
        "overflow-y": "auto",
      },
      chat: {
        height: "100%",
        width: "100%",
        "max-width": "900px",
        margin: "0 auto",
        "box-sizing": "border-box",
        display: "flex",
        "flex-direction": "column",
        padding: `${token.value.paddingLG}px`,
        gap: "16px",
      },
      messages: {
        flex: 1,
      },
      placeholder: {
        "padding-top": "32px",
      },
      sender: {
        "box-shadow": token.value.boxShadow,
      },
      logo: {
        display: "flex",
        height: "72px",
        "align-items": "center",
        "justify-content": "start",
        padding: "0 24px",
        "box-sizing": "border-box",
      },
      "logo-img": {
        width: "24px",
        height: "24px",
        display: "inline-block",
      },
      "logo-span": {
        display: "inline-block",
        margin: "0 8px",
        "font-weight": "bold",
        color: token.value.colorText,
        "font-size": "16px",
      },
      addBtn: {
        background: "#1677ff0f",
        border: "1px solid #1677ff34",
        width: "calc(100% - 24px)",
        margin: "24px 12px 24px 12px",
      },
    }));

    // 节点渲染
    const renderTitle = (icon: VNode, title: string) => (
      <Space align="start">
        {icon}
        <span>{title}</span>
      </Space>
    );
    const placeholderPromptsItems: PromptsProps["items"] = [
      {
        key: "1",
        label: renderTitle(
          <FireOutlined style={{ color: "#FF4D4F" }} />,
          "Hot Topics"
        ),
        description: "What are you interested in?",
        children: [
          { key: "1-1", description: `What's new in X?` },
          { key: "1-2", description: `What's AGI?` },
          { key: "1-3", description: `Where is the doc?` },
        ],
      },
      {
        key: "2",
        label: renderTitle(
          <ReadOutlined style={{ color: "#1890FF" }} />,
          "Design Guide"
        ),
        description: "How to design a good product?",
        children: [
          { key: "2-1", icon: <HeartOutlined />, description: `Know the well` },
          {
            key: "2-2",
            icon: <SmileOutlined />,
            description: `Set the AI role`,
          },
          {
            key: "2-3",
            icon: <CommentOutlined />,
            description: `Express the feeling`,
          },
        ],
      },
    ];
    const senderPromptsItems: PromptsProps["items"] = [
      {
        key: "1",
        description: "Hot Topics",
        icon: <FireOutlined style={{ color: "#FF4D4F" }} />,
      },
      {
        key: "2",
        description: "Design Guide",
        icon: <ReadOutlined style={{ color: "#1890FF" }} />,
      },
    ];

    const roles = computed<BubbleListProps["roles"]>(() => ({
      ai: {
        placement: "start",
        typing: { step: 5, interval: 20 },
        avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
        header: (
          <Thought
            isComplete={!agentRequestLoading.value}
            ragList={RAGdoc.value}
            usingTools={usingTools.value}
          />
        ),
        shape: "corner",
        footer: (
          <Space size="small">
            <Button type="text" size="small" icon={<SyncOutlined />} />
            <Button type="text" size="small" icon={<CopyOutlined />} />
            <Button type="text" size="small" icon={<LikeOutlined />} />
            <Button type="text" size="small" icon={<DislikeOutlined />} />
          </Space>
        ),
      },
      local: {
        placement: "end",
        variant: "shadow",
        avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
        shape: "corner",
      },
      suggestion: {
        placement: "start",
        avatar: { icon: <UserOutlined />, style: { visibility: "hidden" } },
        variant: "borderless",
        messageRender: (items) => <Prompts vertical items={items as any} />,
      },
    }));

    const placeholderNode = computed(() => (
      <Space direction="vertical" size={16} style={styles.value.placeholder}>
        <Welcome
          variant="borderless"
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="你好，我是中医证型判断助手"
          description="通过基于SD-TCM数据集建立的知识库，我能给出证型判断与分析。请告诉我你的具体症状，我会为你提供专业的解答，症状描述越详细，证型分类越准。"
          extra={
            <Space>
              <Button icon={<ShareAltOutlined />} />
              <Button icon={<EllipsisOutlined />} />
            </Space>
          }
        />
      </Space>
    ));

    const attachmentsNode = computed(() => (
      <Badge dot={attachedFiles.value.length > 0 && !headerOpen.value}>
        <Button
          type="text"
          icon={<PaperClipOutlined />}
          onClick={() => (headerOpen.value = !headerOpen.value)}
        />
        {usingTools.value.map((tool: tool_tag) => {
          return (
            <Tag
              key={tool.tool_id}
              style={{
                background: "#f5f7ff",
                color: "#3a5cff",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "16px",
                padding: "6px 12px",
              }}
            >
              @{tool.tool_name}
            </Tag>
          );
        })}
      </Badge>
    ));

    const senderHeader = computed(() => (
      <Sender.Header
        title="文件"
        open={headerOpen.value}
        onOpenChange={(open) => (headerOpen.value = open)}
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        <Attachments
          beforeUpload={() => false}
          items={attachedFiles.value}
          onChange={handleFileChange}
          placeholder={(type) =>
            type === "drop"
              ? { title: "Drop file here" }
              : {
                  icon: <CloudUploadOutlined />,
                  title: "上传文件",
                  description: "点击或拖拽文件到此处上传",
                }
          }
        />
      </Sender.Header>
    ));

    // 消息markdown渲染逻辑
    const md = markdownit({ html: true, breaks: true });
    const renderMarkdown: BubbleProps["messageRender"] = (content) => (
      <Typography>
        <div v-html={md.render(content)} />
      </Typography>
    );

    // Suggestion 相关逻辑
    type SuggestionItems = Exclude<SuggestionProps["items"], () => void>;
    const suggestions: SuggestionItems = [
      { label: "证型判断", value: "证型判断" },
      { label: "组方库", value: "组方库" },
      { label: "药材库", value: "药材库" },
    ];

    // 事件处理
    const onAddConversation = () => {
      conversationsItems.value = [
        ...conversationsItems.value,
        {
          key: `${conversationsItems.value.length}`,
          label: `New Conversation ${conversationsItems.value.length}`,
        },
      ];
      activeKey.value = `${conversationsItems.value.length}`;
    };

    const onConversationClick: ConversationsProps["onActiveChange"] = (key) => {
      activeKey.value = key;
    };

    const handleFileChange: AttachmentsProps["onChange"] = (info) =>
      (attachedFiles.value = info.fileList);

    const onSubmit = async (nextContent: string) => {
      if (!nextContent) return;
      isCompletion.value = false;
      eventBus.emit("updateRAGCard", false);
      agentRequestLoading.value = true;
      onRequest(nextContent);
      content.value = "";
    };

    const onPromptsItemClick: PromptsProps["onItemClick"] = (info) => {
      onRequest(info.data.description as string);
    };

    const [agent] = useXAgent({
      request: async ({ message }, { onSuccess }) => {
        messages.value.push({
          id: `msg_loading_${messages.value.length}`,
          message: "",
          status: "loading",
        });
        agentRequestLoading.value = true;

        // 第一个 fetch 请求：创建对话
        let conversationInfo = await fetch(
          `${import.meta.env.VITE_IP}:${
            import.meta.env.VITE_BACKEND_PORT
          }/api/v1/aimessage/create`,
          { method: "POST" }
        ).then((res) => res.json());

        // 第二个 fetch 请求：获取聊天内容
        /*  let res = await fetch(
          `${import.meta.env.VITE_IP}:${
            import.meta.env.VITE_BACKEND_PORT
          }/api/v1/aimessage/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: message,
              conversation_id: conversationInfo.conversation_id,
              stream: true,
            }),
          }
        ); */
        console.log(
          `/api/v1/aimessage/stream?message=${message}&conversation_id=${conversationInfo.conversation_id}`
        );
        const eventSource = new EventSource(
          `/api/v1/chat/stream?message=${message}&conversation_id=${conversationInfo.conversation_id}`
        );

        eventSource.onmessage = (event) => {
          try {
            let SSEchunk:
              | { message: string }
              | { is_complete: boolean; answer: string } = JSON.parse(
              event.data
            );
            console.log(SSEchunk);
            if ("message" in SSEchunk) {
              let res: ResponseData = JSON.parse(SSEchunk.message);
              messages.value[messages.value.length - 1].message += res.answer;

              if (
                "message_type" in res.content[0].outputs &&
                res.content[0].outputs.message_type === "json"
              ) {
                const RAGdata = JSON.parse(res.content[0].outputs.message);
                (RAGdata.RAGreference as any[]).forEach((item) => {
                  RAGdoc.value.push(item.content as string);
                });
              }

              messages.value[messages.value.length - 1].status = "success";
            } else if ("is_complete" in SSEchunk && SSEchunk.is_complete) {
              console.log("SSE断开连接");
              eventBus.emit("updateRAGCard", true);

              agentRequestLoading.value = false;

              eventSource.close();
            }
          } catch (error) {
            console.error("SSE message parsing error:", error, "event:", event);
          }
        };

        eventSource.onerror = (error) => {
          console.error("SSE 错误:", error);
          eventSource.close();
        };
      },
    });

    const { onRequest, messages, setMessages } = useXChat({
      agent: agent.value,
    });

    watch(activeKey, () => {
      if (activeKey.value !== undefined) {
        setMessages([]);
      }
    });

    const items = computed<BubbleListProps["items"]>(() =>
      messages.value.map(({ id, message, status }) => ({
        key: id,
        loading: status === "loading",
        role: status === "local" ? "local" : "ai",
        messageRender: renderMarkdown,
        content: message,
      }))
    );

    return () => (
      <div style={styles.value.layout}>
        <div style={styles.value.menu}>
          <Button
            onClick={onAddConversation}
            type="link"
            style={styles.value.addBtn}
            icon={<PlusOutlined />}
          >
            新建对话
          </Button>
          <Conversations
            items={conversationsItems.value}
            style={styles.value.conversations}
            activeKey={activeKey.value}
            onActiveChange={onConversationClick}
          />
        </div>
        <div style={styles.value.chat}>
          <Bubble.List
            items={
              items.value.length > 0
                ? items.value
                : [{ content: placeholderNode.value, variant: "borderless" }]
            }
            roles={roles}
            style={styles.value.messages}
          ></Bubble.List>
          <Suggestion
            items={suggestions}
            onSelect={(itemVal) => {
              usingTools.value.push({
                tool_name: itemVal,
                tool_id: usingTools.value.length + 1,
              });
              content.value = content.value.slice(0, content.value.length - 1);
            }}
            block
            children={({ onTrigger, onKeyDown }) => {
              return (
                <Sender
                  value={content.value}
                  onChange={(nextVal) => {
                    if (nextVal.at(-1) === "@") {
                      onTrigger();
                    } else if (!nextVal) {
                      onTrigger(false);
                    }
                    content.value = nextVal;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace") {
                      if (content.value.length === 0) {
                        if (usingTools.value.length > 0) {
                          usingTools.value.pop();
                        }
                      }
                      // 自定义逻辑：例如按下 Backspace 键时打印日志

                      // 调用父级的 onKeyDown
                      onKeyDown;
                    }
                  }}
                  placeholder="输入 @ 调用工具"
                  onSubmit={onSubmit}
                  prefix={attachmentsNode.value}
                  loading={agentRequestLoading.value}
                  style={styles.value.sender}
                  header={senderHeader.value}
                />
              );
            }}
          />
        </div>
      </div>
    );
  },
});

export default Chat;
