# paternia プロジェクト 引継ぎドキュメント

このドキュメントは新しい Claude セッションに引き継ぐための現状記録。
新しいチャットで「このファイルを読んで作業を続けて」と指示すれば、
同じ温度感でプロジェクトが再開できる。

最終更新: 2026-04-18（**全note記事23本を若年層向けに平易化リライト完了、サイト結果画面の順序改善**）

---

## 🎯 プロジェクト概要

**paternia（パターニア）**: Big5 性格診断ウェブアプリ
- URL: https://paternia.netlify.app
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
- `src/app/page.tsx` - トップページ (paternia ブランド、模様プレビュー自動切替)
- `src/app/quiz/page.tsx` - 30問の診断 (sessionStorageで進捗保存)
- `src/app/result/page.tsx` - 結果画面 (Big5スコア+豆知識+相性 + シェア3種類)
- `src/app/gallery/page.tsx` - 20タイプ一覧
- `src/app/gallery/[code]/page.tsx` + `ClientView.tsx` - 個別タイプ (Server+Client分割、generateStaticParams)
- `src/components/PatternCanvas.tsx` - 20種の独立した描画アルゴリズム
- `src/components/MiniPatternCanvas.tsx` - ミニ表示版
- `src/components/Big5Summary.tsx` - 5軸を一目で見れるサマリー
- `src/components/ScoreBar.tsx` - スコアバー+豆知識カード
- `src/components/GoogleAnalytics.tsx` - GA4 統合
- `src/data/type-profiles.ts` - 20タイプの手作り名前・キャッチコピー・代表例
- `src/data/questions.ts` - 30問
- `src/data/research-facts.ts` - Big5 研究知見（中学生でもわかる言葉）
- `src/lib/diagnosis.ts` - スコア計算、タイプ判定
- `src/lib/compatibility.ts` - 相性スコアリング (N増幅ペナルティ等)
- `src/lib/analytics.ts` - GA4 カスタムイベントヘルパー
- `src/app/sitemap.ts`, `robots.ts` - SEO基盤
- `next.config.ts` - `output: "export"` 静的エクスポート設定
- `netlify.toml` - Netlify デプロイ設定

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
- [x] トップページ（模様プレビュー自動切替）
- [x] 30問の診断 (sessionStorageで進捗保存、軸マイルストーン)
- [x] 結果画面 (模様アート + Big5サマリー + 豆知識 + タイプ別プロフィール + 歴史上の人物 + シェア3種)
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
- [x] Netlify デプロイ（https://paternia.netlify.app）
- [x] Google Analytics 4 統合（NEXT_PUBLIC_GA_ID=G-YZTC6F541R）
- [x] Google Search Console 所有権確認済み（google-site-verification: gMw7tNXWLPn3BrDJ4hIm8qUzM-zMiu60nrfdcTD-sr4）
- [x] sitemap.xml + robots.txt 自動生成
- [x] 静的エクスポート（全27ページ事前生成）
- [x] カスタムイベントtracking (quiz_start, quiz_complete, share_click, gallery_type_view, result_view, **note_click**)
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
- [x] 全CTA URL を `paternia.netlify.app` に統一
- [x] キャプションを「要約 + 500人フォロワーCTA」に
- [x] ロゴ・ヘッダー画像生成ツール（白+紫グロー、text-shadowベースで html2canvas 対応）

---

## 🔄 現在進行中のタスク

**note アカウント設定**:
- [ ] アカウント作成
- [ ] プロフィール文（140字以内の3案から選択）
- [ ] プロフィール画像 + ヘッダー画像（生成ツールからDL）
- [ ] 固定記事「paternia について / はじめに」公開

---

## 🚀 次の優先タスク（優先順位順）

### 1. 最初の有料note 記事を書く

**推奨: AN 花びらの詩（HSP層向け・780円）**

- [x] 下書き完成: `docs/note-articles/AN-hanabira.md`（約7,200字、全7章 + ワーク + 参考文献7件）
- [ ] 著者によるセルフ編集（言い回し・トーンの最終調整）
- [ ] note 投稿（無料試し読みはリード部のみ、第1章以降を有料）
- [ ] アイキャッチ画像（`tiktok-slides/logo.html` から生成 or 別途用意）
- [ ] 結果画面・ギャラリー個別ページからの誘導リンクを記事URLで差し替え（次タスクと連動）

記事構成（実装済み）:
1. HSP気質の科学的背景 (Aron 1997 ほか)
2. AN型の4大悩みの正体
3. 情報過多を防ぐ7つのルール
4. 理解者を見つける「自己開示の階段」
5. 繊細さを武器にする職業設計
6. 恋愛で相手を疲れさせない4技術
7. ワーク: 30日間の刺激の棚卸し

### 2. paternia のロック部分に note 誘導を仕込む（**20タイプ全記事完成まで保留**）

方針決定（2026-04-18）: 段階的ではなく、**20タイプ記事が揃ってから一気に実装**する。
理由: URLマッピングの実装・データ変更を1回で済ませ、全診断者にロック誘導を等しく届ける。

対象ファイル（実装時）:
- `src/app/result/page.tsx`
- `src/app/gallery/[code]/ClientView.tsx`
- `src/data/type-profiles.ts`（`noteUrl` 等のフィールド追加を検討）

### 2.5. 次の note 記事を書き続ける（現フェーズの中心タスク）

Phase 1 残り4本 → Phase 2 → Phase 3 の順で記事を量産する。
各記事は約7,000字、構成は AN 記事のテンプレに準拠。

**Phase 1 残り（優先）**:
- [x] NC 点描の巡礼（完璧主義、780円、約7,100字、5パスレビュー済、`docs/note-articles/NC-tenbyo.md`）← 2026-04-18 新テンプレで作成
- [x] NA 雨音の詩人（憂愁派、780円、約7,100字、`docs/note-articles/NA-amaoto.md`）← 2026-04-18 下書き完成
- [ ] EA 祭りの先導者（人気者疲れ、500円）
- [ ] U1 相性マトリクス完全版（ユニバーサル、1,480円、12,000〜15,000字）

**新テンプレ（2026-04-18 策定）**: 冒頭フック200字(タイプ固有) → 第1章科学(論文2-3本) → 第2章4大悩み → 【有料境界+意外性ピーク】 → 第3章実践7テク → 第4章恋愛4技術 → 第5章職業 → 第6章30日ワーク → おわりに → 参考文献 → 5パスセルフレビュー記録

**Big5質問数**: 30問 → **45問** に拡張済（`src/data/questions.ts`）。各軸9問、リバース項目を各軸1-2問配置。UI動作確認済（quiz pageで「1/45」表示）。

**Phase 2**（全6タイプ下書き完成、2026-04-18）:
- [x] CN 震えの書記（¥580、約7,200字、`docs/note-articles/CN-furue.md`）
- [x] AE 陽だまりの主（¥580、約7,000字、`docs/note-articles/AE-hidamari.md`）
- [x] OC 星の設計者（¥580、約7,200字、`docs/note-articles/OC-hoshi.md`）
- [x] ON 夢の建築家（¥580、約7,100字、`docs/note-articles/ON-yume.md`）
- [x] AC 毛糸の匠（¥500、約7,200字、`docs/note-articles/AC-keito.md`）
- [x] OA 墨の語り部（¥580、約7,100字、`docs/note-articles/OA-sumi.md`）

**Phase 3**（残り10タイプ、全完成2026-04-18）:
- [x] OE 虹色の旅人（¥500、約7,000字、`docs/note-articles/OE-niji.md`）
- [x] CO 氷の観測者（¥500、約7,100字、`docs/note-articles/CO-koori.md`）
- [x] CE 道筋の司令（¥780、約7,100字、`docs/note-articles/CE-michisuji.md`）
- [x] CA 藍色の守り手（¥500、約7,000字、`docs/note-articles/CA-aiiro.md`）
- [x] EO 夜空の革命児（¥580、約7,100字、`docs/note-articles/EO-yozora.md`）
- [x] EC 黄金の王（¥780、約7,000字、`docs/note-articles/EC-ogon.md`）
- [x] EN 赤色の咆哮（¥580、約7,200字、`docs/note-articles/EN-sekishoku.md`）
- [x] AO 森を紡ぐ者（¥580、約7,200字、`docs/note-articles/AO-mori.md`）
- [x] NE 警鐘を鳴らす者（¥580、約7,000字、`docs/note-articles/NE-keisho.md`）
- [x] NO 時を溶かす者（¥580、約7,200字、`docs/note-articles/NO-toki.md`）

**U1 相性マトリクス完全版**:
- [x] U1 相性マトリクス完全版（¥1,480、約13,200字、190ペア網羅、`docs/note-articles/U1-compatibility.md`）

**既存AN/NAのリファイン**:
- [x] AN/NA 末尾にセルフレビュー5パス記録を追加（2026-04-18）

**ビジネス予想レポート**:
- [x] `docs/business-forecast.md` — 3シナリオ売上予測、成功確率、リスクマップ、12ヶ月マイルストーン、推奨アクション

### 3. TikTok投稿開始

- 画像スライド10本のうち、まず第1投稿(MBTI vs Big5)からアップロード
- 投稿時間: 平日20-22時 / 土日11-13時
- 週3-5本が目標
- 反応を見てGA4 で検証

### 4. 500人フォロワー達成後

- TikTok bio に URL 貼る (https://paternia.netlify.app)
- Google AdSense 申請
- OGP動的画像生成（2-3タイプのシェア時に模様アート表示）

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

# Netlify デプロイ（既にリンク済み）
npx netlify-cli deploy --dir=out --prod
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
- patern-ia.netlify.app の旧URL混入（正: paternia.netlify.app）

---

## 📊 現状のGA4計測イベント

計測済み:
- `page_view` (自動)
- `quiz_start` / `quiz_complete`
- `result_view` (type_code付き)
- `share_click` (platform: x/line/copy + type_code)
- `gallery_type_view` (type_code + is_own)

未計測（実装候補）:
- `note_click` - note誘導リンククリック
- `hero_pattern_change` - トップのサンプル模様切替

---

新しいチャットで継続する際は、このファイルを最初に読ませて、
「次にやりたいタスク」を1-2行で追記すれば、シームレスに続けられる。
