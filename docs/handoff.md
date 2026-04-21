# paternia プロジェクト 引継ぎドキュメント

このドキュメントは新しい Claude セッションに引き継ぐための現状記録。
新しいチャットで「このファイルを読んで作業を続けて」と指示すれば、
同じ温度感でプロジェクトが再開できる。

最終更新: 2026-04-20（**/quick 10問モード追加、GA4離脱計測拡張、Netlify→Vercel移行完了**）

---

## 🎯 プロジェクト概要

**paternia（パターニア）**: Big5 性格診断ウェブアプリ
- URL: https://paternia.vercel.app
- TikTok で若年層に豆知識を発信 → サイトで診断 → 有料note でマネタイズ、の3段構成
- 最終目標: 月5-30万円の副業収益

### ブランド
- ロゴ: `paternia`（小文字、Fredokaフォント、紫アクセント）
- タグライン: 「あなたの性格が模様になる」
- 色: ダーク (#0a0a1a) + 紫アクセント (#9d8fff)

---

## 📁 ファイル構成

### プロジェクトルート: `G:\projects\art\moyou-v2\`

**主要ファイル**:
- `src/app/page.tsx` - トップページ (paternia ブランド、模様プレビュー自動切替、Primary CTA=/quick)
- `src/app/quick/page.tsx` - **10問クイック診断** (約1分、各軸2問ずつ / reverse1問、sessionStorage保存)
- `src/app/quiz/page.tsx` - 45問じっくり診断 (sessionStorageで進捗保存、軸マイルストーン)
- `src/app/result/page.tsx` - 結果画面 (Big5スコア+豆知識+相性 + シェア3種類 + mode=quick バッジ)
- `src/app/gallery/page.tsx` - 20タイプ一覧
- `src/app/gallery/[code]/page.tsx` + `ClientView.tsx` - 個別タイプ (Server+Client分割、generateStaticParams)
- `src/components/PatternCanvas.tsx` - 20種の独立した描画アルゴリズム
- `src/components/MiniPatternCanvas.tsx` - ミニ表示版
- `src/components/Big5Summary.tsx` - 5軸を一目で見れるサマリー
- `src/components/ScoreBar.tsx` - スコアバー+豆知識カード
- `src/components/GoogleAnalytics.tsx` - GA4 統合
- `src/data/type-profiles.ts` - 20タイプの手作り名前・キャッチコピー・代表例
- `src/data/questions.ts` - 45問 (`QUESTIONS`) + 10問 (`QUICK_QUESTIONS`, 各軸2問/reverse1問)
- `src/data/research-facts.ts` - Big5 研究知見（中学生でもわかる言葉）
- `src/lib/diagnosis.ts` - スコア計算、タイプ判定 (全中立時は±0.02の決定論的ノイズ適用)
- `src/lib/compatibility.ts` - 相性スコアリング (N増幅ペナルティ等)
- `src/lib/analytics.ts` - GA4 カスタムイベントヘルパー (quick/full両モード追跡、question_answered離脱計測)
- `src/app/sitemap.ts`, `robots.ts` - SEO基盤
- `next.config.ts` - `output: "export"` 静的エクスポート設定
- `netlify.toml` - Netlify デプロイ設定（※現行デプロイは Vercel）

**関連ツール**:
- `tiktok-slides/index.html` - TikTok投稿用PNG画像一括生成ツール
- `tiktok-slides/logo.html` - paterniaロゴ・ヘッダー画像生成ツール

**ドキュメント**:
- `docs/note-strategy.txt` - note マネタイズ戦略 (20タイプ記事ラインナップ、ローンチ順序、売上シミュレーション)
- `docs/handoff.md` - このファイル

### プロジェクトルート: `G:\projects\art\`
- `CLAUDE.md` - プロジェクト定義
- `design.md` - デザイン方針
- `index_22.html` - v1 (単一HTMLファイル版、参考用)

---

## ✅ 完了した実装

### サイト機能
- [x] トップページ（模様プレビュー自動切替、Primary=/quick / Secondary=/quiz の2段CTA）
- [x] **10問クイック診断（/quick、約1分、各軸2問+reverse1問、Primary CTA）** ← 2026-04-20
- [x] 45問じっくり診断 (sessionStorageで進捗保存、軸マイルストーン)
- [x] 結果画面 (模様アート + Big5サマリー + 豆知識 + タイプ別プロフィール + 歴史上の人物 + シェア3種、mode=quick時はバッジ表示)
- [x] 20タイプの独立した描画アルゴリズム（ネビュラ、歯車、フラクタル等）
- [x] ギャラリー一覧 + 個別ページ
- [x] 相性機能（good 3 / bad 3）
- [x] ナビゲーション統一（paternia ブランド、戻るSVG）
- [x] モバイルファースト（9:16縦長）
- [x] Reduced motion 対応
- [x] focus-visible スタイル
- [x] 404 ページ
- [x] Suspense + ページビュー tracking

### インフラ
- [x] Next.js 16 App Router + TypeScript + Tailwind CSS
- [x] **Vercel デプロイ（https://paternia.vercel.app）** ← Netlify から移行済み（2026-04-19）
- [x] Google Analytics 4 統合（NEXT_PUBLIC_GA_ID=G-YZTC6F541R）
- [x] Google Search Console 所有権確認済み（google-site-verification: gMw7tNXWLPn3BrDJ4hIm8qUzM-zMiu60nrfdcTD-sr4）
- [x] sitemap.xml + robots.txt 自動生成
- [x] 静的エクスポート（全ページ事前生成、/quick 追加で28ページ）
- [x] カスタムイベントtracking (quiz_start, quiz_complete, share_click, gallery_type_view, result_view, note_click)
- [x] **診断モード別計測 (diagnosis_started/completed, question_answered)** ← quick/full 両モードの離脱ポイント分析が可能
- [x] **全中立回答バグ修正**（±0.02の決定論的ノイズで常にOCが返る問題を解決）
- [x] **Big5診断 45問化**（各軸9問+リバース、信頼性α向上）
- [x] **note有料記事21本公開**（20タイプ+U1相性、note.com/paternia）
- [x] **note誘導CTA完全実装**（result/gallery両方、MORE ABOUT YOU訴求、GA4計測）
- [x] **20タイプ独立SEO**（gallery/[code] 個別metadata、title/description/OGP/keywords）
- [x] **JSON-LD構造化データ**（WebSite、Organization、Article schema）
- [x] **Bing Webmaster Tools 登録**（URL Submission + sitemap予定）
- [x] **U1 相性マトリクス完全版** 公開（¥1,480、[naf0879b276dd](https://note.com/paternia/n/naf0879b276dd)）
- [x] **U2 恋愛完全ガイド** 公開（¥980、[n96b52e529b80](https://note.com/paternia/n/n96b52e529b80)）
- [x] **00-intro プロフィール固定記事** 公開（無料、[n324dd7c74730](https://note.com/paternia/n/n324dd7c74730)）
- [x] **U1/U2 横断CTA** 全20タイプページ + 結果画面に実装（金色=U1、ローズ系=U2）
- [x] **noteサムネイル一括生成ツール**（tiktok-slides/thumbnails.html、23枚、1280×670）

### TikTok用ツール
- [x] 画像スライド一括生成ツール（10投稿 × 8枚 = 80枚PNGをZIPでダウンロード）
- [x] 1枚目をパンチライン先出しに書き換え（3秒離脱対策）
- [x] 「BIG 5 研究に基づく」バッジ
- [x] **全 tiktok-slides HTML ツール内の旧 netlify URL → `paternia.vercel.app` 置換完了**（6ファイル48箇所、2026-04-20）
- [x] キャプションを「要約 + 500人フォロワーCTA」に
- [x] ロゴ・ヘッダー画像生成ツール（白+紫グロー、text-shadowベースで html2canvas 対応）

---

## 🔄 現在進行中のタスク

**GA4 設定更新（Vercel 移行の事後対応）**:
- [ ] GA4 Data Stream の URL を `https://patern-ia.netlify.app` → `https://paternia.vercel.app` に更新
  - Admin → Property → Data Streams → 該当ウェブストリームをクリック → 「ウェブストリームの詳細」の URL を編集
- [ ] Data Filters に旧ホスト名ベースのフィルタがあれば削除（Admin → Data Filters）
- [ ] Vercel ダッシュボード → Settings → Environment Variables で `NEXT_PUBLIC_GA_ID=G-YZTC6F541R` が Production に設定されているか確認（現行 build には埋め込み済み）
- [ ] 広告ブロッカー無しのシークレットウィンドウで `paternia.vercel.app` を訪問 → GA4 リアルタイムビューに出るか確認

**TikTok 運用フェーズ**:
- [ ] 画像スライド10本のうち、第1投稿（MBTI vs Big5）からアップロード
- [ ] 週3-5本のペースで投稿継続
- [ ] GA4 で `diagnosis_started` / `question_answered` を見て離脱点を把握
- [ ] 500人到達したら bio に URL 掲出 + AdSense 申請準備

---

## 🚀 次の優先タスク（優先順位順）

**開発側はほぼ完了。以後はマーケ（TikTok）運用とデータ観察が中心。**

### 1. TikTok投稿開始（最優先・ユーザー作業）

- 画像スライド10本のうち、第1投稿（MBTI vs Big5）からアップロード
- 投稿時間: 平日20-22時 / 土日11-13時
- 週3-5本を目標
- GA4 の `diagnosis_started` / `question_answered` / `result_view` / `note_click` で反応検証
- 離脱点が特定できたら /quick の該当質問を調整

### 2. 500人フォロワー達成後

- TikTok bio に URL 掲出（https://paternia.vercel.app）
- Google AdSense 申請（/quick による回遊率改善後が理想）
- OGP動的画像生成（2-3タイプのシェア時に模様アート表示）

### 3. 小粒な改善候補（手が空いたとき）

- [ ] `hero_pattern_change` GA4 イベント実装（トップのサンプル模様切替ロギング）
- [ ] /quick 完走後に「じっくり45問版もやってみる？」サジェスト（深度ユーザー回収）
- [ ] mode=quick 結果画面のシェア文面差別化（「1分でこの模様」訴求）
- [ ] TikTok用スライドの第2弾以降（反応見て追加コンテンツ）
- [ ] 共有カードの自動OGP（Vercel Edge で動的生成）

### 既存資産サマリー

- **note記事**: 20タイプ全+U1(¥1,480)+U2(¥980)+00-intro(無料) = 23本公開済
- **ビジネス予想**: `docs/business-forecast.md` に3シナリオ売上予測・12ヶ月マイルストーン
- **新テンプレ（2026-04-18 策定）**: 冒頭フック200字 → 第1章科学（論文2-3本） → 第2章4大悩み → 【有料境界+意外性ピーク】 → 第3章実践7テク → 第4章恋愛4技術 → 第5章職業 → 第6章30日ワーク → おわりに → 参考文献 → 5パスセルフレビュー記録

---

## 💰 note マネタイズ戦略（要約）

- 20タイプ × 特化記事（500〜780円）+ ユニバーサル3本（980〜1,480円）+ マガジン（2,980円）
- フェーズ1最優先: AN花びらの詩、NC点描の巡礼、NA雨音の詩人、EA祭りの先導者、U1相性マトリクス完全版
- 想定売上: 3,000人フォロワー時点で月3,000-5,000円、10,000人時点で月1万円、30,000人+SEOで月4万円

詳細は `docs/note-strategy.txt` 参照。

---

## 🔧 開発コマンド

```powershell
cd G:\projects\art\moyou-v2

# 開発サーバー
npm run dev

# 本番ビルド
npm run build

# Vercel デプロイ（既にリンク済み、git push で自動デプロイも可）
npx vercel --prod
```

---

## 📝 重要な判断・決定事項

1. **Netflix不採用、Netlify採用**: 既にv1がNetlifyだった継続性
2. **静的エクスポート選択**: output: "export" で全ページ事前生成
3. **2文字コード（OC等）採用**: 5文字（OcEan）より覚えやすい、マーケに◎
4. **20タイプ（5×4）採用**: 32通りの「全組み合わせ」でなく、支配軸×副軸の20
5. **相性アルゴリズムのN増幅ペナルティ**: Malouffメタ分析ベース
6. **価格帯 500円 / 780円 / 980円 / 1,480円 / 2,980円**: 市場調査の実勢ベース
7. **1,480円は避けて 1,980円に**: 市場データで中途半端だと売れない
8. **絵文字少なめ**: AI臭を避け、上品さを演出（🔮などブランド要素は可）
9. **HSP/完璧主義/憂鬱系の単価高め**: 悩み深度が深いと高値でも売れる

---

## 🎨 デザインルール

- ダークテーマ固定（ライトモードなし）
- 紫アクセント (#9d8fff) をブランドカラーとして統一
- フォント: Kiwi Maru（日本語見出し）、Zen Kaku Gothic（日本語本文）、Fredoka（英字）
- 日本語は柔らかめ、英語は大文字トラッキング広め
- モバイル幅 430px max-width
- スマホ横幅85%以上のテキスト使用禁止（ドットより大きい字は1画面14文字以内）

---

## 🚫 避けるべきこと

- 絵文字の乱用（特に結果画面・商品UI）
- ユーザー不在の断定表現（「あなたは〇〇です」→「〇〇の傾向があります」）
- MBTI を否定しすぎる（MBTIユーザーもターゲットなので丁寧に扱う）
- 価格 300円以下 / 1,480円ちょうど
- note記事を無料部分で「満足」させる
- タイプ名に「岩盤」「自由」などランダム組み合わせで不自然な日本語
- patern-ia.netlify.app の旧URL混入（正: paternia.vercel.app）

---

## 📊 現状のGA4計測イベント

計測済み:
- `page_view` (自動)
- `quiz_start` / `quiz_complete`（後方互換、45問版のみ）
- `diagnosis_started` / `diagnosis_completed` (mode: quick/full, result_type)
- `question_answered` (mode, question_number, question_total) — 離脱ポイント特定用
- `result_view` (type_code付き)
- `share_click` (platform: x/line/copy + type_code)
- `gallery_type_view` (type_code + is_own)
- `note_click` (type_code + source: result/gallery/gallery_own)

未計測（実装候補）:
- `hero_pattern_change` - トップのサンプル模様切替

---

新しいチャットで継続する際は、このファイルを最初に読ませて、
「次にやりたいタスク」を1-2行で追記すれば、シームレスに続けられる。
