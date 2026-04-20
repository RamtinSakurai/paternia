import type { Axis } from "./questions";

export interface ResearchFact {
  axis: Axis;
  level: "high" | "low";
  text: string;
  source: string;
}

export const RESEARCH_FACTS: ResearchFact[] = [
  // O - 開放性
  { axis: "O", level: "high", text: "不思議なアートや変わった作品が好きになりやすい", source: "9万人以上の調査" },
  { axis: "O", level: "high", text: "好奇心が強い人は、深く考えるクセがつくと成績も上がりやすい", source: "Komarraju et al., 2011" },
  { axis: "O", level: "high", text: "ケンカになっても話し合いで解決しようとするタイプが多い", source: "Bono et al., 2019" },
  { axis: "O", level: "low", text: "写真みたいなリアルな絵や、わかりやすいアートが好きになりやすい", source: "9万人以上の調査" },
  // C - 誠実性
  { axis: "C", level: "high", text: "一生で稼ぐお金が平均より約17%多いというデータがある", source: "ミシガン大学の研究" },
  { axis: "C", level: "high", text: "同じ恋人と18年以上続く確率がかなり高い", source: "長期追跡調査" },
  { axis: "C", level: "high", text: "SNSに依存しにくく、自分でコントロールできるタイプ", source: "2024年の大規模調査" },
  { axis: "C", level: "high", text: "よく眠れる人が多い。生活リズムを整えるのが上手", source: "3万人以上の調査" },
  { axis: "C", level: "low", text: "恋愛で浮気しやすいという研究結果がある", source: "世界10地域の調査" },
  // E - 外向性
  { axis: "E", level: "high", text: "赤やオレンジなど、あたたかい色が好きになりやすい", source: "Palmer & Schloss" },
  { axis: "E", level: "high", text: "お金を稼ぐのは得意だけど、貯金が苦手な傾向がある", source: "ハーバード大学の研究" },
  { axis: "E", level: "high", text: "リーダーとして周りを引っ張る力が強い", source: "Judge & Bono, 2000" },
  { axis: "E", level: "low", text: "一人の時間で元気を回復するタイプ", source: "Big5の基礎研究" },
  // A - 協調性
  { axis: "A", level: "high", text: "まるい形やなめらかなデザインを好む傾向がある", source: "心理学研究" },
  { axis: "A", level: "high", text: "人とぶつかりにくく、揉めごとが少ない", source: "対人関係の研究" },
  { axis: "A", level: "high", text: "優しすぎると年収が下がるという「いい人ペナルティ」がある", source: "組織心理学の研究" },
  { axis: "A", level: "low", text: "自分の意見をはっきり言えるぶん、ぶつかることも多い", source: "世界10地域の調査" },
  // N - 神経症傾向
  { axis: "N", level: "high", text: "考えすぎるクセが、実はクリエイティブな発想につながる", source: "Perkins et al., 2015" },
  { axis: "N", level: "high", text: "恋愛で不安になりやすい。「嫌われたかも」と感じやすい", source: "Noftle & Shaver, 2006" },
  { axis: "N", level: "high", text: "SNSを見すぎてしまう傾向がある", source: "2024年の大規模調査" },
  { axis: "N", level: "low", text: "恋愛がうまくいきやすい。穏やかな関係を築ける", source: "複数の研究のまとめ" },
  { axis: "N", level: "low", text: "ストレスを感じても、冷静に対処できるタイプ", source: "Luo & Han, 2022" },
];

export function getFactsForScore(axis: Axis, score: number): ResearchFact[] {
  const level = score >= 0.5 ? "high" : "low";
  return RESEARCH_FACTS.filter((f) => f.axis === axis && f.level === level);
}
