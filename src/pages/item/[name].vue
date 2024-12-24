<template>
  <div style="margin-left: 45vh; margin-right: 45vh">
    <img :src="'http://www.zhongyoo.com' + chineseMedicineData.pic" alt="" />
    <div
      v-for="([key, value], seqIndex) in Object.entries(chineseMedicineData)"
      :key="key"
    >
      <h2 v-if="seqIndex >= 1" style="line-height: 2">
        {{ (propertyMap as any)[key] }}
      </h2>
      <p v-if="seqIndex >= 1" style="line-height: 2">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";
import { computed, ref } from "vue";

// 定义一个响应式变量存储 Markdown 文本
const markdown = ref<string>("# Hello Markdown\nThis is **markdown** content.");

// 使用 computed 处理 Markdown 转换为 HTML
const compiledMarkdown = computed(() => {
  const md = new MarkdownIt();
  return md.render(markdown.value);
});

const propertyMap = {
  pic: "图片",
  chinese_medicine_name: "中药名",
  alias: "别名",
  english_name: "英文名",
  source: "来源",
  form: "形态",
  distribution: "分布区域",
  processing: "炮制方法",
  properties: "性味",
  efficacy_and_function: "功效与作用",
  properties_and_meridian_tropism: "性味归经",
  clinical_application: "临床应用",
  chemical_composition: "化学成分",
  pharmacological_study: "药理研究",
  usage_precautions: "使用注意",
  compatibility_and_prescription: "配伍与方剂",
};

// 使用示例
console.log(propertyMap.chinese_medicine_name); // 输出: 中药名
console.log(propertyMap.compatibility_and_prescription); // 输出: 配伍与方剂

const chineseMedicineData: {
  pic: string;
  chinese_medicine_name: string;
  alias: string;
  english_name: string;
  source: string;
  form: string;
  distribution: string;
  processing: string;
  properties: string;
  efficacy_and_function: string;
  properties_and_meridian_tropism: string;
  clinical_application: string;
  chemical_composition: string;
  pharmacological_study: string;
  usage_precautions: string;
  compatibility_and_prescription: string[];
} = {
  pic: "/uploads/allimg/131207/1-13120F9504V92.jpg",
  chinese_medicine_name: "半夏banxia",
  alias: "三叶半夏、三步跳、麻芋子、水芋、地巴豆。",
  english_name: "Pinelliae Rhizoma。",
  source: "天南星科植物半夏Pinellia ternata (Thunb.) Breit.的块茎。",
  form: "多年生草本。块茎近球形。叶出自块茎顶端，在叶柄下部内侧生一白色珠芽；一年生的叶为单叶，卵状心形；2～3年后，叶为3小叶的复叶，小叶椭圆形至披针形，中间小叶较大，两侧的较小，先端锐尖，基部楔形，全缘，两面光滑无毛。肉穗花序顶生，花序梗常较叶柄长；佛焰苞绿色；花单性，无花被，雌雄同株；雄花着生在花序上部，白色，雄蕊密集成圆筒形，雌花着生于雄花的下部，绿色；花序中轴先端附属物延伸呈鼠尾状，直立伸出在佛焰苞外。浆果卵状椭圆形，绿色。花期5～7月，果期8～9月。",
  distribution:
    "生于山坡草地、荒地、包谷地、田边、河边及疏林下。除内蒙古、新疆、西藏外，全国各地均有分布。",
  processing:
    "夏、秋季均可采挖，洗净泥土，除去外皮和须根，晒干或烘干。本品生用有毒，用前须炮制。炮制品有：生半夏、清半夏、姜半夏、法半夏等。",
  properties:
    "类球形，有的稍偏斜，直径0.8～1.5厘米。表面白色或浅黄色，顶端中心有凹陷的茎痕，周围密布棕色凹点状的根痕；下端钝圆，较光滑。质坚实，断面白色，富粉性。气微，味辛辣、麻舌而刺喉。",
  efficacy_and_function:
    "燥湿化痰、降逆止呕、消痞散结。属化痰止咳平喘药下属分类的温化寒痰药。",
  properties_and_meridian_tropism: "性温，味辛，有毒。归脾经、胃经、肺经。",
  clinical_application:
    "内服用量3～9克；或入丸、散；外用研末调敷。用治湿痰冷饮、呕吐、反胃、咳喘痰多、胸膈胀满、痰厥头痛、头晕不眠等。",
  chemical_composition:
    "含挥发油，内含3-乙酰氨基-5-甲基异唑等60多种成分及16种氨基酸和多种无机元素。其中，所含的草酸钙针晶为半夏的刺激性成分之一，经炮制后，晶形发生变化，含量急剧下降，刺激性明显减弱。另含琥珀酸、丁基乙烯基醚、苯甲醛、半夏蛋白、姜辣醇、胰蛋白酶抑制剂等。",
  pharmacological_study:
    "具有镇吐、催吐、镇咳、祛痰、抗癌、抗生育、抗早孕、抗心律失常、抗实验性溃疡、抗矽肺、促使外周淋巴细胞分裂等作用。",
  usage_precautions:
    "阴虚燥咳、津伤口渴、血证及燥痰者禁服，孕妇慎服。不宜与川乌、制川乌、草乌、制草乌、附子同用，生品内服宜慎。",
  compatibility_and_prescription: [
    "①治湿痰喘急，止心痛：半夏不拘多少，香油炒，为末，粥丸梧桐子大。每服三五十丸，姜汤下。(《丹溪心法》)",
    "②治诸呕吐，谷不得下者：半夏一升，生姜240克。上二味，以水七升，煮取一升半，分温再服。(《金匮要略》小半夏汤)",
    "③治头痛：半夏(汤洗七遍)、白僵蚕各15克，全蝎一个。上同为细末，以绿豆粉调贴于太阳穴上，干即易之。(《叶氏录验方》抽风膏)",
    "④下乳方：半夏(炮)三粒。为末，酒调服，即有乳。(《鲁府禁方》)",
    "⑤治蝎螫毒：用半夏、白矾等分为末，以醋和，敷伤处。(《景岳全书》)",
  ],
};
</script>
