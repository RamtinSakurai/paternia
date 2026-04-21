# paternia 引継ぎドキュメント

新しいチャットで「このファイル読んで作業続けて」と指示すれば、同じ温度感で再開できる。

最終更新: 2026-04-21(**Atlas 方向へのフル移行 + トップ画面最適化デプロイ済、10 投稿 v2 生成待ち**)

---

## 🎯 プロジェクト概要

**paternia(パターニア)**: Big5 性格診断ウェブアプリ
- URL: https://paternia.vercel.app
- TikTok で性格の「なぜ」発信 → サイト診断 → note マネタイズ、の 3 段
- 目標: 月 5-30 万円の副業収益

### ブランド(Atlas 方向、2026-04-21 確定)

- **コンセプト**: an atlas of personal constellations — 性格が模様になる観測ノート
- **ボイス**: 観測者/キュレーター(「静かに並べていきます」「知っているだけで、少し楽になる」)
- **パレット**:
  - 背景: `#0f0a18`(warm night / aubergine)
  - テキスト: `#d4c8d0`(softer ivory)
  - アクセント: `#d8bb89`(solar gold) / `#ead1a0`(ember)
  - mute: `#7a6d88`(muted mauve)
- **タイポ**: 5 種
  - `Cormorant Garamond`(英字セリフ、paternia ロゴ)
  - `Shippori Mincho`(日本語明朝、見出し、weight 500 のみ)
  - `Kiwi Maru`(日本語丸セリフ、本文 CTA)
  - `Zen Kaku Gothic New`(日本語サンセリフ、メタ)
  - `Fredoka`(英字ラベル)
- **ロゴ**: 5 点ペンタゴン + 中央ジェム(Big5 5 軸の観測紋章)
- **絵文字禁止** — ✦ ◆ ♡ など幾何記号のみ可

---

## 📁 ファイル構成

### ルート: `G:\projects\art\moyou-v2\`

**サイト主要ファイル**:
- `src/app/page.tsx` - トップ(3層星空 + Big5 ペンタゴン背景 + atlas hero)
- `src/app/quick/page.tsx` - 10 問診断
- `src/app/quiz/page.tsx` - 45 問診断
- `src/app/result/page.tsx` - 結果(horoscope wheel + aspect pentagon + MORE ABOUT YOU)
- `src/app/gallery/page.tsx` + `[code]/ClientView.tsx` - 20 タイプ
- `src/app/globals.css` - Warm Night palette(@theme inline)
- `src/app/layout.tsx` - 5 フォント宣言(ウェイト最小化済)

**コンポーネント**:
- `src/components/PatternCanvas.tsx` - 20 アルゴリズム(atlas 仕様適用済)
- `src/components/HoroscopeFrame.tsx` - 星図枠(mini/detail variant)
- `src/components/MiniPatternCanvas.tsx`, `Big5Summary.tsx`, `ScoreBar.tsx`

**TikTok Slide エコシステム**(`tiktok-slides/`):
- `index-atlas.html` - **10 投稿 × 6 枚 ジェネレータ(v2 スタイル、生成待ち)**
- `logo-export.html` - PNG 出力(TikTok profile / note avatar / note header)
- `logo-system.html` - ロゴバリエーション reference
- `atlas-system.html` - 全タッチポイント設計 reference
- `index.html` - 旧ジェネレータ(参考用、廃止予定)

---

## ✅ 完了した実装(Atlas 移行後)

- [x] `globals.css` Warm Night パレット
- [x] `layout.tsx` Cormorant + Shippori Mincho 追加、weight 最小化
- [x] `page.tsx` atlas hero(3 層 80 stars + 中央回避 + Big5 ペンタゴン背景)
- [x] `HoroscopeFrame.tsx` 新規作成(12 house tick + 5 軸マーカー + aspect pentagon)
- [x] ギャラリー/結果画面に HoroscopeFrame 適用
- [x] `PatternCanvas` 20 アルゴリズム atlas パレット調整済
- [x] 結果画面: MORE ABOUT YOU を Big5 スコアの直下に移動
- [x] トップ画面: タグライン/サブ削除、paternia 大型化、CTA 統一サイズ、文字可読性向上
- [x] フォントウェイト軽量化(Shippori 3→1、Cormorant 3→2、Zen Kaku 3→2)
- [x] 全 tiktok-slides HTML ツールの URL を paternia.vercel.app に
- [x] デプロイ: `main` 最新 commit `bfcd9d4`、Vercel 自動再デプロイ済

### 確定したデザインシステム

| 要素 | 仕様 |
|---|---|
| Hero Pattern | HoroscopeFrame mini (size 180) + MiniPatternCanvas auto-rotating |
| Big5 ペンタゴン背景 | canvas 中央、R=36% 画面短辺、5 点金ドット + 薄ライン、slow breathe pulse |
| 星空 | 3 層: far 45 / mid 25 / near 10(glow)、safe zone 0.26-0.32 |
| 流れ星 | 4-8 秒ごと、金色 streak |
| CTA Primary | gold fill + glow, rounded-2xl, 15px Kiwi Maru |
| CTA Secondary | outline version, 同サイズ・同位置 |
| Result wheel | 12 house tick + 5 軸 OCEAN マーカー + aspect pentagon(実スコア)|

---

## 🚀 次の優先タスク

### 【最優先】 TikTok 用スライド 10 種を実生成

**方法**:
1. `tiktok-slides/index-atlas.html` をブラウザで直接開く(ダブルクリック)
2. 上部「全て生成してZIPダウンロード」で 10 投稿まとめて DL
   - または各投稿「この投稿を生成」で個別 DL
3. ZIP 内容: `post-NN_タイトル/` に `01.png - 06.png`(1080×1920)+ `caption.txt`

### 現在の 10 投稿(v2 approved)

| # | 型 | タイトル |
|---|---|---|
| 01 | C · 逆説 | 怒りっぽい人、実は繊細な人だった話 |
| 02 | A · 観察 | 年収が高い人、同じ性格だった話 |
| 03 | D · キャラ | 『一人が楽』と言う人の、本当の気持ち |
| 04 | E · 解説 | 三日坊主の科学 — 脳が新しさを求める理由 |
| 05 | A · 観察 | 長続きするカップル、共通点は 1 つだけ |
| 06 | D · キャラ | 『気にしすぎる自分』、実は特殊能力 |
| 07 | B · 発見 | 飽きっぽい人と続く人、脳が違った |
| 08 | C · 逆説 | 『人気者』ほど、実は疲れやすい |
| 09 | B · 発見 | ケンカが長引く人と、すぐ解決する人の差 |
| 10 | A · 観察 | 幸せかどうか、半分は性格で決まってた |

### v2 投稿設計ルール(確定済)

- 6 枚構成: hook → tension → reveal → mechanism → twist → cta
- S1-S5 に cliffhanger(「▸ その正体は —」「▸ 実は —」等、変化させる)
- S6 = 保存 ▢ / コメント ◖ / フォロー ▸
- スライド **中央縦横センター**、下 30%(y≥1344)は TikTok クロップゾーン
- キャプション 800-1200 字のミニ記事
- 研究名は日本語(「アメリカの大学・40 年追跡」形式)
- 専門用語を平易化:
  - 誠実性 → きちんと系
  - 神経症傾向 → 敏感さ / 不安を感じやすい人
  - 外向性 → 人と話すと元気になる人
  - メタ分析 → 世界中の研究をまとめた結果

---

## 📝 プロフィール文(承認済)

**TikTok bio**:
> 怒りっぽい、続かない、気にしすぎ ─
> 性格の「なぜ」を Big5 の研究で解く
> paternia.vercel.app

**note bio**:
> あなたの性格が「模様」になる Big5 診断 paternia の公式 note。恋愛・キャリア・繊細さ・ストレス ── 20 タイプ別の取扱説明書を、論文引用 × 中高生でもわかる言葉で公開中。✦ paternia.vercel.app

---

## 🎨 ロゴシステム

- **メインマーク**: 5 点ペンタゴン + 中央ジェム(Big5 5 軸の観測紋章)
- **ワードマーク**: paternia(Cormorant Garamond、letter-spacing 0.22em)
- **エクスポート**: `tiktok-slides/logo-export.html` で PNG DL
  - `paternia-tiktok-profile-night.png`(1080×1080、night bg)
  - `paternia-tiktok-profile-gold.png`(1080×1080、gold bg)
  - `paternia-note-avatar.png`(200×200)
  - `paternia-note-header-centered.png`(1280×670、ロゴ+タグ中央)
  - `paternia-note-header-left.png`(1280×670、ロゴ+英字+日本語説明)
  - `paternia-favicon.svg`

---

## 🔧 開発コマンド

```powershell
cd G:\projects\art\moyou-v2
npm run dev       # http://localhost:3000
npm run build     # 静的エクスポート(out/)
npx vercel --prod # 手動デプロイ(通常は git push で自動)
```

### 直近コミット

- `bfcd9d4` feat: top page refinement — cleaner hero, perf, atlas-native starfield
- `997e5fa` feat: Atlas direction — warm night palette, horoscope frame, observer voice
- `6b6d809` feat: 10問版診断(/quick) + 離脱計測GA4イベント追加

---

## 📊 GA4 計測(変更なし)

Measurement ID: `G-YZTC6F541R`
- `diagnosis_started` / `diagnosis_completed` / `question_answered`(離脱点分析用)
- `result_view` / `share_click` / `gallery_type_view` / `note_click`
- **未計測**: `hero_pattern_change`(トップのサンプル模様切替)

---

## 💰 マネタイズ(変更なし)

- 20 タイプ × 特化 note 記事(300-780 円)+ U1 相性完全版(¥1,480)+ U2 恋愛完全ガイド(¥980)+ intro 無料
- 現行 23 記事公開済
- 導線: TikTok → サイト診断(/quick)→ 結果画面 MORE ABOUT YOU → タイプ別 note
- 平易化リライト済(中高生レベル、キャプション並み)

---

## 🚫 避けるべきこと(再確認)

- 絵文字の乱用(特に結果画面・商品 UI)。✦ ◆ ♡ の幾何記号のみ可
- ユーザー不在の断定表現(「あなたは〇〇です」→「〇〇の傾向があります」)
- MBTI を否定しすぎる(MBTIユーザーもターゲット)
- 価格 300 円以下 / 1,480 円ちょうど
- 「軸」「卒業し」など formulaic な表現の多用
- 「」の内側での改行
- 引用を英語のまま(「Schmitt 2004」→「アメリカの大学・53 カ国調査」に翻訳)

---

新しいセッションで継続する際は、このファイルを最初に読ませてから、  
「次に**実行**したいこと」を 1-2 行書けば、スムーズに再開できる。

**今の next action: `tiktok-slides/index-atlas.html` を開いて 10 投稿の ZIP を生成する。**
