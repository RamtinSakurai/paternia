import type { Axis } from "./questions";

export interface TypeExamples {
  /** 歴史上の人物（没後100年以上推奨、法的リスク回避） */
  historical: string[];
  /** アーキタイプ記述（「〇〇タイプ」） */
  archetype: string;
  /** ライフスタイル特徴（好きそうなもの） */
  lifestyle: string;
}

export interface TypeProfile {
  /** 2文字コード: primary + secondary */
  code: string;
  primaryAxis: Axis;
  secondaryAxis: Axis;
  /** 日本語名（3-6文字） */
  name: string;
  /** 一行キャッチコピー（シェア用） */
  catchCopy: string;
  /** 性格概要（2-3文） */
  summary: string;
  examples: TypeExamples;
  /** note有料記事のURL（未公開時は undefined） */
  noteUrl?: string;
  /** note記事の価格（円） */
  notePrice?: number;
  /** note記事のタイトル */
  noteTitle?: string;
}

/**
 * 20種のタイププロファイル。キーは "primary+secondary" の2文字コード。
 * 例: "OC" = O(開放性)が支配的、C(誠実性)が副軸
 */
export const TYPE_PROFILES: Record<string, TypeProfile> = {
  // ============ O (開放性) 支配 ============
  OC: {
    code: "OC",
    primaryAxis: "O",
    secondaryAxis: "C",
    name: "星の設計者",
    catchCopy: "混沌の中に秩序を見つける、宇宙を設計する知性",
    summary:
      "好奇心と規律を両立させる稀なタイプ。複雑なシステムを整え、見えない法則を見抜くのが得意。頭の中には常に建築設計図のような知の構造がある。",
    examples: {
      historical: ["レオナルド・ダ・ヴィンチ", "アイザック・ニュートン"],
      archetype: "建築家・数学者タイプ",
      lifestyle: "好きそうなもの: 緻密なパズル、古典音楽、夜の星空観察",
    },
    noteUrl: "https://note.com/paternia/n/n7ec1e1408b96",
    notePrice: 300,
    noteTitle: "「星の設計者」のための、アイデアを形にする戦略",
  },
  OE: {
    code: "OE",
    primaryAxis: "O",
    secondaryAxis: "E",
    name: "虹色の旅人",
    catchCopy: "世界に色を足す、尽きないアイデアの源泉",
    summary:
      "刺激と新奇を求める好奇心の塊。色彩、音、体験に貪欲で、アイデアが止まらない。人々を驚きと発見に連れていく生きた万華鏡のような存在。",
    examples: {
      historical: ["パブロ・ピカソ", "フリーダ・カーロ"],
      archetype: "アーティスト・発明家タイプ",
      lifestyle: "好きそうなもの: 新しい音楽ジャンル、旅行、アートフェスティバル",
    },
    noteUrl: "https://note.com/paternia/n/n6f998848db1c",
    notePrice: 300,
    noteTitle: "「虹色の旅人」のための、100の興味を武器にする生き方",
  },
  OA: {
    code: "OA",
    primaryAxis: "O",
    secondaryAxis: "A",
    name: "墨の語り部",
    catchCopy: "余白を愛する、静かな美意識の持ち主",
    summary:
      "感性と調和を両立する穏やかな芸術家気質。深い思索を静謐な表現に昇華させる。世界の美しさを、声高にではなく繊細に語る人。",
    examples: {
      historical: ["松尾芭蕉", "クロード・モネ"],
      archetype: "詩人・画家タイプ",
      lifestyle: "好きそうなもの: 水墨画、自然散策、短歌・俳句",
    },
    noteUrl: "https://note.com/paternia/n/nda12eb567c5f",
    notePrice: 300,
    noteTitle: "「墨の語り部」のための、センスを貴重資源として使う生き方",
  },
  ON: {
    code: "ON",
    primaryAxis: "O",
    secondaryAxis: "N",
    name: "夢の建築家",
    catchCopy: "現実の裏側を見る、鋭い想像力",
    summary:
      "鮮やかな心象風景と鋭敏な感性の持ち主。夢と不安の境界を自由に行き来し、現実にはない秩序を構築する。暗さと創造性が共存するタイプ。",
    examples: {
      historical: ["M.C.エッシャー", "フランツ・カフカ"],
      archetype: "シュルレアリスト・幻想作家タイプ",
      lifestyle: "好きそうなもの: シュルレアリスム絵画、不条理文学、迷宮的なゲーム",
    },
    noteUrl: "https://note.com/paternia/n/nad568ddd6c46",
    notePrice: 300,
    noteTitle: "「夢の建築家」のための、闇を作品に変える設計図",
  },

  // ============ C (誠実性) 支配 ============
  CO: {
    code: "CO",
    primaryAxis: "C",
    secondaryAxis: "O",
    name: "氷の観測者",
    catchCopy: "真理を追う、透徹した知性",
    summary:
      "精密な観察力と深い好奇心を持つ探究者。論理の結晶のように澄んだ思考で物事の本質を見抜く。科学的創造性の持ち主。",
    examples: {
      historical: ["マリー・キュリー", "チャールズ・ダーウィン"],
      archetype: "科学者・研究者タイプ",
      lifestyle: "好きそうなもの: 顕微鏡、ドキュメンタリー、博物館巡り",
    },
    noteUrl: "https://note.com/paternia/n/n3e9079bac640",
    notePrice: 300,
    noteTitle: "「氷の観測者」のための、論理と感情を翻訳する技術書",
  },
  CE: {
    code: "CE",
    primaryAxis: "C",
    secondaryAxis: "E",
    name: "道筋の司令",
    catchCopy: "複雑な流れを整える、組織化の匠",
    summary:
      "系統立った思考と実行力を持つ組織者。複雑な情報やタスクを整理し、最適な道筋を描くのが得意。集団を円滑に動かす司令塔タイプ。",
    examples: {
      historical: ["徳川家康", "フローレンス・ナイチンゲール"],
      archetype: "プロジェクトマネージャー・戦略家タイプ",
      lifestyle: "好きそうなもの: 戦略ゲーム、時間管理術、効率化ハック",
    },
    noteUrl: "https://note.com/paternia/n/nf22d31a35d73",
    notePrice: 300,
    noteTitle: "「道筋の司令」のための、任せる技術を作る設計図",
  },
  CA: {
    code: "CA",
    primaryAxis: "C",
    secondaryAxis: "A",
    name: "藍色の守り手",
    catchCopy: "伝統の中に美を見出す、調和の職人",
    summary:
      "秩序と思いやりを兼ね備えた保守的美意識の持ち主。文化や伝統を大切にし、人の輪を丁寧に守る。安定した調和を作り出すタイプ。",
    examples: {
      historical: ["千利休", "宮沢賢治"],
      archetype: "和の職人・文化継承者タイプ",
      lifestyle: "好きそうなもの: 和菓子、茶道、伝統工芸、時代小説",
    },
    noteUrl: "https://note.com/paternia/n/n46106a2644cf",
    notePrice: 300,
    noteTitle: "「藍色の守り手」のための、続ける力を武器に変える方法",
  },
  CN: {
    code: "CN",
    primaryAxis: "C",
    secondaryAxis: "N",
    name: "震えの書記",
    catchCopy: "細部を見逃さない、静かな完璧主義",
    summary:
      "繊細な観察力と不安に裏打ちされた精度の持ち主。物事の微細な変化を記録し、人の気づかないリスクを察知する。慎重で誠実な記録者。",
    examples: {
      historical: ["ジェーン・オースティン", "二宮尊徳"],
      archetype: "編集者・アーキビストタイプ",
      lifestyle: "好きそうなもの: 手帳、整理術、クラシック音楽、静かなカフェ",
    },
    noteUrl: "https://note.com/paternia/n/n44d4c760c703",
    notePrice: 300,
    noteTitle: "「震えの書記」のための、心配性を武器に変える不安の再評価帳",
  },

  // ============ E (外向性) 支配 ============
  EO: {
    code: "EO",
    primaryAxis: "E",
    secondaryAxis: "O",
    name: "夜空の革命児",
    catchCopy: "全方位に光を撒く、舞台の発明家",
    summary:
      "刺激と新奇を同時に求めるエネルギッシュな革新者。人を驚かせ、楽しませる花火のような存在。注目を集めながら常識を壊していくタイプ。",
    examples: {
      historical: ["ウォルフガング・アマデウス・モーツァルト", "オスカー・ワイルド"],
      archetype: "エンターテイナー・起業家タイプ",
      lifestyle: "好きそうなもの: ライブ、フェス、パーティー、斬新なファッション",
    },
    noteUrl: "https://note.com/paternia/n/n8279db7be6a4",
    notePrice: 300,
    noteTitle: "「夜空の革命児」のための、燃え尽きない革新者設計",
  },
  EC: {
    code: "EC",
    primaryAxis: "E",
    secondaryAxis: "C",
    name: "黄金の王",
    catchCopy: "輝きと規律を両立、王道のリーダー",
    summary:
      "外向的エネルギーと系統的な思考を併せ持つ統率者。カリスマと規律で集団を導く。伝統的なリーダーシップで頂点に立つタイプ。",
    examples: {
      historical: ["ナポレオン・ボナパルト", "エリザベス1世"],
      archetype: "CEO・指揮官タイプ",
      lifestyle: "好きそうなもの: 格式ある場、歴史書、クラシックなスーツ",
    },
    noteUrl: "https://note.com/paternia/n/n1c48c79e318d",
    notePrice: 300,
    noteTitle: "「黄金の王」のための、弱さを戦略的に見せる技術",
  },
  EA: {
    code: "EA",
    primaryAxis: "E",
    secondaryAxis: "A",
    name: "祭りの先導者",
    catchCopy: "人を繋ぐ、暖かいムードメーカー",
    summary:
      "社交的で思いやりのある人気者。人を集め、笑顔にするのが得意で、場の温度を上げる天才。みんなの居場所を作るタイプ。",
    examples: {
      historical: ["福沢諭吉", "ダイアナ妃"],
      archetype: "コミュニティリーダー・祝祭者タイプ",
      lifestyle: "好きそうなもの: ホームパーティー、お祭り、カフェ巡り、SNS",
    },
    noteUrl: "https://note.com/paternia/n/n4dd04ebb130d",
    notePrice: 300,
    noteTitle: "「祭りの先導者」のための、みんなの太陽から降りる方法",
  },
  EN: {
    code: "EN",
    primaryAxis: "E",
    secondaryAxis: "N",
    name: "赤色の咆哮",
    catchCopy: "感情をそのまま投げる、情熱的な魂",
    summary:
      "強烈な感情と外向的なエネルギーを持つドラマチックな表現者。内なる衝動を隠さず、世界に向けて感情を放出する。劇的な生き方を選ぶタイプ。",
    examples: {
      historical: ["エドヴァルド・ムンク", "フィンセント・ファン・ゴッホ"],
      archetype: "表現主義アーティスト・激情家タイプ",
      lifestyle: "好きそうなもの: ロック、インスタレーションアート、激しい映画",
    },
    noteUrl: "https://note.com/paternia/n/n0d9b73218f7a",
    notePrice: 300,
    noteTitle: "「赤色の咆哮」のための、感情の洪水を創造に変える技術",
  },

  // ============ A (協調性) 支配 ============
  AO: {
    code: "AO",
    primaryAxis: "A",
    secondaryAxis: "O",
    name: "森を紡ぐ者",
    catchCopy: "見えないつながりを育む、知恵の支え手",
    summary:
      "他者への共感力と深い好奇心を兼ね備えた繋ぎ手。目立たないところで人と人、知と知を結びつけている。静かな知恵の媒介者タイプ。",
    examples: {
      historical: ["アルベルト・シュヴァイツァー", "マザー・テレサ"],
      archetype: "カウンセラー・博物学者タイプ",
      lifestyle: "好きそうなもの: 森林浴、ガーデニング、人生相談、エコな暮らし",
    },
    noteUrl: "https://note.com/paternia/n/n51c6d7d16a62",
    notePrice: 300,
    noteTitle: "「森を紡ぐ者」のための、与えすぎないギバー再設計の書",
  },
  AC: {
    code: "AC",
    primaryAxis: "A",
    secondaryAxis: "C",
    name: "毛糸の匠",
    catchCopy: "丁寧に結ぶ、慈しみの手仕事",
    summary:
      "思いやりと誠実さを持つケアの職人。細やかな気配りと継続的な努力で、周囲を支える。工芸的な手仕事で愛情を形にするタイプ。",
    examples: {
      historical: ["ベアトリクス・ポター", "与謝野晶子"],
      archetype: "職人・教師タイプ",
      lifestyle: "好きそうなもの: 手芸、お菓子作り、読書、動物と暮らす",
    },
    noteUrl: "https://note.com/paternia/n/n92d982f202ba",
    notePrice: 300,
    noteTitle: "「毛糸の匠」のための、見えない努力を愛に変える方法",
  },
  AE: {
    code: "AE",
    primaryAxis: "A",
    secondaryAxis: "E",
    name: "陽だまりの主",
    catchCopy: "暖かい一体感を生む、癒しの中心",
    summary:
      "社交的で思いやり深く、場を和ませる天性の癒し系。人の感情に敏感で、空気を柔らかく変える力を持つ。自然と人が集まるタイプ。",
    examples: {
      historical: ["オードリー・ヘプバーン", "マハトマ・ガンジー"],
      archetype: "ホスト・セラピストタイプ",
      lifestyle: "好きそうなもの: お茶、カフェ、ゆっくりした映画、犬との散歩",
    },
    noteUrl: "https://note.com/paternia/n/n784129cd1d88",
    notePrice: 300,
    noteTitle: "「陽だまりの主」のための、共感を枯らさない境界線の引き方",
  },
  AN: {
    code: "AN",
    primaryAxis: "A",
    secondaryAxis: "N",
    name: "花びらの詩",
    catchCopy: "繊細な感情を抱える、共感の天才",
    summary:
      "深い共感力と繊細な感受性を持つHSP的なタイプ。人の気持ちに敏感すぎるほど敏感で、その優しさで人を救う。美しく壊れやすい花びらのような存在。",
    examples: {
      historical: ["アンネ・フランク", "樋口一葉"],
      archetype: "HSP・文学少女タイプ",
      lifestyle: "好きそうなもの: 詩集、ピアノ曲、日記、静かな雨の日",
    },
    noteUrl: "https://note.com/paternia/n/n54da2b7a0225",
    notePrice: 300,
    noteTitle: "「花びらの詩」のためのHSP完全生存戦略",
  },

  // ============ N (神経症傾向) 支配 ============
  NO: {
    code: "NO",
    primaryAxis: "N",
    secondaryAxis: "O",
    name: "時を溶かす者",
    catchCopy: "不安から芸術を生む、暗い創造者",
    summary:
      "不安と想像力を持つダーク・クリエイター。現実の矛盾や不条理から逃げず、それを作品や思想に変える。内省的な創造性のタイプ。",
    examples: {
      historical: ["サルバドール・ダリ", "エドガー・アラン・ポー"],
      archetype: "シュルレアリスト・哲学者タイプ",
      lifestyle: "好きそうなもの: 夜の散歩、ホラー映画、哲学書、長時間の思考",
    },
    noteUrl: "https://note.com/paternia/n/n5274433002ea",
    notePrice: 300,
    noteTitle: "「時を溶かす者」のための、欠点を作品に変える生存戦略",
  },
  NC: {
    code: "NC",
    primaryAxis: "N",
    secondaryAxis: "C",
    name: "点描の巡礼",
    catchCopy: "繰り返しに完璧を求める、強迫の職人",
    summary:
      "不安が精度に向かうタイプ。細部を何度も確認せずにいられず、その執着が驚異的な完成度を生む。自分に厳しく、完璧を追う求道者。",
    examples: {
      historical: ["グレン・グールド", "伊能忠敬"],
      archetype: "完璧主義者・求道者タイプ",
      lifestyle: "好きそうなもの: 万年筆、タイムログ、ルーティン、クラシック音楽",
    },
    noteUrl: "https://note.com/paternia/n/n8b2a4f47ebc9",
    notePrice: 300,
    noteTitle: "「点描の巡礼」のための、完璧主義を手放ための練習帳",
  },
  NE: {
    code: "NE",
    primaryAxis: "N",
    secondaryAxis: "E",
    name: "警鐘を鳴らす者",
    catchCopy: "危機を感じ取る、鋭い直感の持ち主",
    summary:
      "不安と外向性が組み合わさった警戒型。問題を早く察知し、声に出して警鐘を鳴らす。感情の爆発力と外に出す勇気が同居するタイプ。",
    examples: {
      historical: ["レイチェル・カーソン", "吉田松陰"],
      archetype: "活動家・ジャーナリストタイプ",
      lifestyle: "好きそうなもの: ニュース、社会派ドキュメンタリー、討論番組",
    },
    noteUrl: "https://note.com/paternia/n/nc0a2dd0f4818",
    notePrice: 300,
    noteTitle: "「警鐘を鳴らす者」のための、不安を使命に変える設計図",
  },
  NA: {
    code: "NA",
    primaryAxis: "N",
    secondaryAxis: "A",
    name: "雨音の詩人",
    catchCopy: "悲しみにも寄り添う、柔らかい感受性",
    summary:
      "感受性の強さと他者への思いやりが組み合わさった憂愁の詩人タイプ。悲しみや切なさに深く共鳴し、それを慰めに変える。雨の日を愛する人。",
    examples: {
      historical: ["夏目漱石", "ヴァージニア・ウルフ"],
      archetype: "憂愁派作家・メンタリストタイプ",
      lifestyle: "好きそうなもの: 雨の日のカフェ、エッセイ、ジャズ、静かな友情",
    },
    noteUrl: "https://note.com/paternia/n/n2c93ef153753",
    notePrice: 300,
    noteTitle: "「雨音の詩人」のための、憂いを美しさに変える生き方",
  },
};

/**
 * ユニバーサル(横断)記事の定義。
 * 全20タイプ共通で、相性や恋愛などのテーマ別深掘りガイド。
 */
export interface UniversalArticle {
  code: string;
  noteUrl?: string;
  notePrice: number;
  noteTitle: string;
  tagline: string;
  description: string;
}

export const UNIVERSAL_ARTICLES: Record<string, UniversalArticle> = {
  compatibility: {
    code: "U1",
    noteUrl: "https://note.com/paternia/n/naf0879b276dd",
    notePrice: 300,
    noteTitle: "Big5 × 20タイプ 相性マトリクス完全版 — 190ペアの全地図",
    tagline: "あの人と、なぜ疲れるのか。なぜ続くのか。",
    description:
      "20タイプ × 20タイプ、190ペア全部の相性を、恋愛・職場・友情の3視点で解剖。自分と関わる全19タイプとの相性が、一気に分かる最上位ガイド。",
  },
  love: {
    code: "U2",
    noteUrl: "https://note.com/paternia/n/n96b52e529b80",
    notePrice: 300,
    noteTitle: "【Big5で解く】恋愛完全ガイド — 愛し方・別れのパターン・恋愛不安の処方箋",
    tagline: "なぜいつも同じパターンで、恋は終わるのか。",
    description:
      "Big5 の5軸で恋愛を解剖。愛し方・愛され方のプロファイル、長続きする条件、別れの科学、恋愛不安の処方箋を約9,200字で。",
  },
  intro: {
    code: "00",
    noteUrl: "https://note.com/paternia/n/n324dd7c74730",
    notePrice: 300,
    noteTitle: "paternia(パターニア)について — あなたの性格が模様になる、Big5診断と20タイプ別の生存戦略",
    tagline: "paternia について、はじめに。",
    description:
      "paternia のコンセプト、Big5 と MBTI の違い、20タイプ一覧、記事の選び方を無料で。初めての方はここから。",
  },
};

/**
 * 全タイププロファイルを配列で取得（ギャラリー用）
 */
export function getAllProfiles(): TypeProfile[] {
  return Object.values(TYPE_PROFILES);
}

/**
 * 軸組み合わせでプロファイルを取得
 */
export function getProfileByAxes(primary: Axis, secondary: Axis): TypeProfile | null {
  const key = `${primary}${secondary}`;
  return TYPE_PROFILES[key] || null;
}
