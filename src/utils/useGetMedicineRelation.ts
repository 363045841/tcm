import { RelatedInfoFinalRes } from "@/pages/item/[id].vue";

export async function getMedicineRelation(id: number): Promise<RelatedInfoFinalRes[]> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_IP}:${
        import.meta.env.VITE_BACKEND_PORT
      }/api/v1/item-page/relation?id=${id}`
    );
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("获取相关药材信息失败:", error);
    return [];
  }
}
