import { defineComponent, computed, ref, watch, type VNode } from "vue";
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  type BubbleListProps,
  Conversations,
  type ConversationsProps,
  Prompts,
  type PromptsProps,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from "ant-design-x-vue";
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
} from "@ant-design/icons-vue";
import { Badge, Button, Space, theme } from "ant-design-vue";

const HelloWorld = defineComponent({
  setup() {
    const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

    const renderTitle = (icon: VNode, title: string) => (
      <Space align="start">
        {icon}
        <span>{title}</span>
      </Space>
    );
    interface ConversationItems {
      key: string;
      label: string;
    }

    const defaultConversationsItems: ConversationItems[] = [
      {
        key: "0",
        label: "新对话",
      },
    ];

    const placeholderPromptsItems: PromptsProps["items"] = [
      {
        key: "1",
        label: renderTitle(
          <FireOutlined style={{ color: "#FF4D4F" }} />,
          "Hot Topics"
        ),
        description: "What are you interested in?",
        children: [
          {
            key: "1-1",
            description: `What's new in X?`,
          },
          {
            key: "1-2",
            description: `What's AGI?`,
          },
          {
            key: "1-3",
            description: `Where is the doc?`,
          },
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
          {
            key: "2-1",
            icon: <HeartOutlined />,
            description: `Know the well`,
          },
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

    const roles: BubbleListProps["roles"] = {
      ai: {
        placement: "start",
        typing: { step: 5, interval: 20 },
        styles: {
          content: {
            borderRadius: "16px",
          },
        },
      },
      local: {
        placement: "end",
        variant: "shadow",
      },
    };

    const { token } = theme.useToken();
    const styles = computed(() => {
      return {
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
          "max-width": "700px",
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
      } as const;
    });

    const headerOpen = ref(false);
    const content = ref(""); // 输入框内容
    const conversationsItems = ref(defaultConversationsItems); // 左侧对话列表
    const activeKey = ref(defaultConversationsItems[0].key);
    const attachedFiles = ref<AttachmentsProps["items"]>([]);
    const agentRequestLoading = ref(false);

    const [agent] = useXAgent({
      request: async ({ message }, { onSuccess }) => {
        agentRequestLoading.value = true;
        // await sleep();
        interface createRes {
          request_id: string;
          conversation_id: string;
        }
        let conversationInfo: createRes = await fetch(
          `${import.meta.env.VITE_IP}:${
            import.meta.env.VITE_BACKEND_PORT
          }/api/v1/aimessage/create`,
          {
            method: "POST",
          }
        )
          .then((res) => res.json())
          .then((res) => {
            return res;
          });
        console.log(conversationInfo);

        interface aiResInfo {
          zhengxing: string;
          tedian: string;
          zhiliaofangfa: string;
          jibing: string;
        }
        let res = await fetch(
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
            }),
          }
        )
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            return res;
          });
        console.log(res);
        const { zhengxing, tedian, zhiliaofangfa, jibing } = res as aiResInfo;
        const res_str = `【证型】：${zhengxing}\n【特点】：${tedian}\n【治疗方式】：${zhiliaofangfa}\n【疾病】：${jibing}`;
        onSuccess(res_str);
        agentRequestLoading.value = false;
      },
    });

    const { onRequest, messages, setMessages } = useXChat({
      agent: agent.value,
    });

    watch(
      activeKey,
      () => {
        if (activeKey.value !== undefined) {
          setMessages([]);
        }
      },
      { immediate: true }
    );

    const onSubmit = async (nextContent: string) => {
      if (!nextContent) return;
      agentRequestLoading.value = true;
      onRequest(nextContent); //他这个库自己的，先调后端接口应付一下，后续流式输出再考虑websocket对接

      content.value = "";
    };

    const onPromptsItemClick: PromptsProps["onItemClick"] = (info) => {
      onRequest(info.data.description as string);
    };

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
        {/*  <Prompts
          title="Do you want?"
          items={placeholderPromptsItems}
          styles={{
            list: {
              width: '100%',
            },
            item: {
              flex: 1,
            },
          }}
          onItemClick={onPromptsItemClick}
        /> */}
      </Space>
    ));

    const items = computed<BubbleListProps["items"]>(() =>
      messages.value.map(({ id, message, status }) => ({
        key: id,
        loading: status === "loading",
        role: status === "local" ? "local" : "ai",
        content: message,
      }))
    );

    const attachmentsNode = computed(() => (
      <Badge dot={attachedFiles.value.length > 0 && !headerOpen.value}>
        <Button
          type="text"
          icon={<PaperClipOutlined />}
          onClick={() => (headerOpen.value = !headerOpen.value)}
        />
      </Badge>
    ));

    const senderHeader = computed(() => (
      <Sender.Header
        title="Attachments"
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
                  title: "Upload files",
                  description: "Click or drag files to this area to upload",
                }
          }
        />
      </Sender.Header>
    ));

    /* const logoNode = computed(() => (
      <div style={styles.value.logo}>
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable={false}
          alt="logo"
          style={styles.value['logo-img']}
        />
        <span style={styles.value['logo-span']}>Ant Design X Vue</span>
      </div>
    )); */

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
          />
          {/* <Prompts style={{ color: token.value.colorText }} items={senderPromptsItems} onItemClick={onPromptsItemClick} /> */}
          <Sender
            value={content.value}
            header={senderHeader.value}
            onSubmit={onSubmit}
            onChange={(value) => (content.value = value)}
            prefix={attachmentsNode.value}
            loading={agentRequestLoading.value}
            style={styles.value.sender}
          />
        </div>
      </div>
    );
  },
});

export default HelloWorld;
