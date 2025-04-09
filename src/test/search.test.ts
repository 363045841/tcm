import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMedicineRelation } from "@/utils/useGetMedicineRelation";
import type { RelatedInfoFinalRes } from "@/pages/item/[id].vue";

describe("getMedicineRelation 获取相关药材信息", () => {
  const mockData: RelatedInfoFinalRes[] = [
    {
      related_tcm_id: 101,
      tcmName: "人参"
    },
    {
      related_tcm_id: 102,
      tcmName: "黄芪"
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("当 fetch 请求成功时，应该返回相关药材信息数组", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData)
    } as any);

    const result = await getMedicineRelation(123);
    expect(fetch).toHaveBeenCalledOnce();
    expect(result).toEqual(mockData);
  });

  it("当返回结果不是数组时，应该返回空数组", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ message: "not array" })
    } as any);

    const result = await getMedicineRelation(456);
    expect(result).toEqual([]);
  });

  it("当 fetch 请求抛出异常时，应该返回空数组", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    const result = await getMedicineRelation(789);
    expect(result).toEqual([]);
  });
});
