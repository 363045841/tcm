import { App, message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { onBeforeUnmount, ref, watch, defineComponent } from 'vue';

const value = ref('Hello? this is X!');
const loading = ref<boolean>(false);

const Demo = defineComponent({
  name: 'AXSenderBasic',
  setup() {
    // Mock send message
    watch(loading, () => {
      if (loading.value) {
        const timer = setTimeout(() => {
          loading.value = false;
          message.success('Send message successfully!');
        }, 3000);
        onBeforeUnmount(() => {
          clearTimeout(timer);
        });
      }
    });

    return () => (
        <Flex 
        vertical 
        gap="middle"
      >
        <Sender
          loading={loading.value}
          value={value.value}
          onChange={(v) => {
            value.value = v;
          }}
          onSubmit={() => {
            value.value = '';
            loading.value = true;
            message.info('Send message!');
          }}
          onCancel={() => {
            loading.value = false;
            message.error('Cancel sending!');
          }}
          style={{ marginBottom: '10px', width: '80vh', margin: 'auto' }} // 设置 Sender 组件的内联样式
        />
      </Flex>
    );
  },
});

export default Demo;
