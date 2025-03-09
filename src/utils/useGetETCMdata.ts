export interface ETCMData {
  药材名: "";
  药材拉丁名: "";
  药材英文名: "";
  科: "";
  产地: "";
  采集时间: "";
  药用部位: "";
  "中药材类别(按功效划分)": "";
  性: "";
  味: "";
  归经: "";
  功效: "";
  性状: "";
  规格: "";
  数据库交叉检索: "";
  成分: "";
  上限: "";
  下限: "";
  单位: "";
  相似中药材名: "";
  相似中药材值: "";
  相似基因名: "";
  相似基因值: "";
}

export async function useGetETCMData(name: string) {
  const items = ref({
    药材名: "",
    药材拉丁名: "",
    药材英文名: "",
    科: "",
    产地: "",
    采集时间: "",
    药用部位: "",
    "中药材类别(按功效划分)": "",
    性: "",
    味: "",
    归经: "",
    功效: "",
    性状: "",
    规格: "",
    数据库交叉检索: "",
    成分: "",
    上限: "",
    下限: "",
    单位: "",
    相似中药材名: "",
    相似中药材值: "",
    相似基因名: "",
    相似基因值: "",
  });

  const chineseToEnglishMap = new Map([
    ["药材名", "herbName"],
    ["药材拉丁名", "latinName"],
    ["药材英文名", "englishName"],
    ["科", "family"],
    ["产地", "origin"],
    ["采集时间", "collectionTime"],
    ["药用部位", "usedPart"],
    ["中药材类别(按功效划分)", "category"],
    ["性", "nature"],
    ["味", "taste"],
    ["归经", "meridian"],
    ["功效", "efficacy"],
    ["性状", "appearance"],
    ["规格", "specification"],
    ["数据库交叉检索", "dbCrossRef"],
    ["成分", "component"],
    ["上限", "upperLimit"],
    ["下限", "lowerLimit"],
    ["单位", "unit"],
    ["相似中药材名", "similarHerb"],
    ["相似中药材值", "similarHerbNumber"],
    ["相似基因名", "similarGene"],
    ["相似基因值", "similarGeneNumber"],
  ]);

  let res = await fetch(
    `${import.meta.env.VITE_IP}:${
      import.meta.env.VITE_BACKEND_PORT
    }/api/v1/etcm/${name}`
  ).then((res) => res.json());

  let etcmDataArray = Object.values(res);
  etcmDataArray.shift();
  let i = 0;
  for (const key of chineseToEnglishMap.keys()) {
    items.value[key as keyof typeof items.value] = etcmDataArray[i++] as any;
  }

  return items.value as ETCMData;
}
