import { ref } from 'vue';

export interface GujifangjiData {
    编号: number,
    名称: string,
    剂型: string,
    主治: string,
    来源: string,
    组成原文: string,
    功效: string,
    组方: string,
    相似古籍方剂: string,
    古籍方剂相似度: number,
    相似组方化学成分谱的中医古籍方剂列表: string,
    相似组分相似度: number,
}

export async function useGetETCMGujifangjiData(name: string) {
  // 初始化响应式对象
  const items = ref({
    编号: "",
    名称: "",
    剂型: "",
    主治: "",
    来源: "",
    组成原文: "",
    功效: "",
    组方: "",
    相似古籍方剂: "",
    古籍方剂相似度: "",
    相似组方化学成分谱的中医古籍方剂列表: "",
    相似组分相似度: "",
  });

  // 中英文字段映射表（如果需要）
  const chineseToEnglishMap = new Map([
    ["id", "编号"],
    ["name", "名称"],
    ["dosageForm", "剂型"],
    ["symptoms", "主治"],
    ["source", "来源"],
    ["composition", "组成原文"],
    ["functions", "功效"],
    ["functionsNotes", "组方"],
    ["herbs", "相似古籍方剂"],
    ["herbalMedicines", "古籍方剂相似度"],
    ["chemicalProfiles", "相似组方化学成分谱的中医古籍方剂列表"],
    ["targetProfiles", "相似组分相似度"],
  ]);

  try {
    // 打印请求 URL（调试用）
    console.log(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/etcm/med/guji/${name}`
    );

    // 发起请求并解析响应
    let res: GujifangjiData = await fetch(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/etcm/med/guji/${name}`
    ).then((res) => res.json());
    console.log(res);
    // 检查响应是否有效
    if (!res || typeof res !== 'object') {
      console.error('Invalid response from API:', res);
      return null;
    }

    let i: number = 0;
    for(const key of Object.keys(res)){
        items.value[chineseToEnglishMap.get(key) as keyof GujifangjiData] = Object.values(res)[i];
        i++;
    }
    console.log(items.value);

    return items.value;
  } catch (error) {

    console.error('Error in useGetETCMGujifangjiData:', error);
    throw error; // 可以根据需求决定是否重新抛出错误
  } finally {
    return items.value;
  }
}