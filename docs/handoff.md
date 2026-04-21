# paternia 引継ぎドキュメント

新しいチャットで「このファイル読んで作業続けて」と指示すれば、同じ温度感で再開できる。

最終更新: 2026-04-21 20:xx(**Atlas 本番デプロイ済、TikTok 10 投稿 v2 レイアウト統一完了、ZIP 生成待ち**)

---

## 🎯 プロジェクト概要

**paternia(パターニア)**: Big5 性格診断ウェブアプリ
- URL: https://paternia.vercel.app
- TikTok で性格の「なぜ」発信 → サイト診断 → note マネタイズ、の 3 段
- 目標: 月 5-30 万円の副業収益

### ブランド(Atlas、2026-04-21 確定・本番反映済)

- **コンセプト**: an atlas of personal constellations — 性格が模様になる観測ノート
- **ボイス**: 観測者/キュレーター(「静かに並べていきます」「知っているだけで、少し楽になる」)
- **パレット(CSS変数 → 本番反映済)**:
  - 背景: `#0f0a18`(warm night / aubergine)
  - テキスト: `#d4c8d0`(softer ivory、目の疲れ軽減済)
  - アクセント: `#d8bb89`(solar gold) / `#ead1a0`(ember)
  - mute: `#7a6d88`(muted mauve)
- **タイポ(軽量化済)**: 5 フォント
  - `Cormorant Garamond`(英字セリフ、paternia ロゴ、weight 400/500)
  - `Shippori Mincho`(日本語明朝、weight 500 のみ)
  - `Kiwi Maru`(日本語丸セリフ、weight 400/500)
  - `Zen Kaku Gothic New`(日本語サンセリフ、weight 400/500)
  - `Fredoka`(英字ラベル、weight 400/600)
- **ロゴ**: 5 点ペンタゴン + 中央ジェム(Big5 5 軸の観測紋章)
- **絵文字禁止** — ✦ ◆ ♡ など幾何記号のみ可

---

## 📁 ファイル構成

### ルート: `G:\projects\art\moyou-v2\`

**サイト主要ファイル(デプロイ済)**:
- `src/app/page.tsx` - トップ(3 層 80 stars + 中央回避 + Big5 ペンタゴン背景 + atlas hero)
- `src/app/result/page.tsx` - MORE ABOUT YOU が Big5 直下
- `src/app/gallery/page.tsx` + `[code]/ClientView.tsx` - 20 タイプ(HoroscopeFrame)
- `src/app/globals.css` - Warm Night palette、softer ivory 文字色
- `src/app/layout.tsx` - フォント 5 種(ウェイト最小化)

**コンポーネント**:
- `src/components/PatternCanvas.tsx` - 20 アルゴリズム(atlas 仕様適用済)
- `src/components/HoroscopeFrame.tsx` - 星図枠(mini/detail variant)

**TikTok Slide エコシステム**(`tiktok-slides/`):
- `index-atlas.html` - **10 投稿 × 6 枚 ジェネレータ(v2 統一レイアウト完成、生成待ち)** ← 次の作業
- `logo-export.html` - PNG 出力(TikTok profile / note avatar / note header)
- `logo-system.html` - ロゴバリエーション reference
- `atlas-system.html` - 全タッチポイント設計 reference
- `index-tarot.html`, `astro-mockup.html`, `atlas-mockup.html`, `minimal-mockup.html`, `pastel-mockup.html`, `tarot-mockup.html` - 過程の探索 mockup(untracked、参考用)

---

## ✅ 完了した実装

### サイト本体(デプロイ済)
- [x] Warm Night パレット + 5 フォント
- [x] atlas hero(3 層星空 + Big5 ペンタゴン + horoscope frame pattern)
- [x] HoroscopeFrame + 20 アルゴリズム adjust
- [x] 結果画面: MORE ABOUT YOU を Big5 直下
- [x] トップ: タグライン/サブ削除、paternia ember gold 大型化、CTA 同サイズ、文字 softer
- [x] フォント weight 軽量化(Shippori 3→1、Cormorant 3→2、Zen Kaku 3→2)
- [x] 直近コミット: `bfcd9d4`(top 改善)、`997e5fa`(Atlas 移行)、`3f000c1`(handoff)

### TikTok スライド 10 投稿 v2(生成ツール完成、ZIP 生成待ち)
- [x] Post 01-10 データ完成(型 A×3 / B×2 / C×2 / D×2 / E×1)
- [x] 6 枚構成 + cliffhanger + save/comment/follow CTA
- [x] キャプション 800-1200 字ミニ記事
- [x] 研究名日本語化、専門用語平易化
- [x] 中央縦横センター + 下 30% クロップゾーン考慮
- [x] **レイアウト統一**(下記参照)

---

## 🎨 スライドレイアウト確定仕様

### サイズ統一ルール(全スライド共通)

| 要素 | サイズ | 備考 |
|---|---|---|
| slide-main(default/big/xl)| **88px** / line-height 1.45 | 全ての見出しは統一 |
| slide-main.md | 64px | 1 行に収めたい長文のみ |
| slide-body | 42px | 本文の補足説明 |
| slide-lead | 36px italic Cormorant | 英字小見出し、**空でも slot 確保** |
| slide-cliff | **64px** / white-space nowrap | 本文と同格、枠線なし |
| slide-attribution | 28px italic | 出典 |

### 垂直位置(全スライド共通)

- slide-body-area: top=200, bottom=770, **justify-content: flex-start**, padding-top: 60
- lead は常に slot 確保(空なら invisibility hidden)
- main 開始位置 y ≈ 343(scale 1920)- 全スライドで統一
- cliff 位置 y = 1150-1300(下 30% クロップゾーンの境界手前)
- credit y = 1829(クロップゾーン内、展開時のみ表示)

### Japanese 改行ルール(確定)

- `word-break: keep-all` で意図しない単語内改行を防止
- 「」内では絶対に改行しない
- 句読点(、。)で改行 or 自然な文節で
- 1 行 10 chars 超なら `size:"md"` を使う
- em-dash " —" 含む cliff は `white-space:nowrap` + padding 調整で 1 行維持

### 10 投稿の型配分

| # | 型 | タイトル |
|---|---|---|
| 01 | C · 逆説 | 怒りっぽい人、実は繊細な人。 |
| 02 | A · 観察 | 年収が高い人、同じ性格だった話 |
| 03 | D · キャラ | 『一人が楽』と言う人の、本当の気持ち |
| 04 | E · 解説 | 三日坊主の科学 — 脳が新しさを求める理由 |
| 05 | A · 観察 | 長続きするカップル、共通点は 1 つだけ |
| 06 | D · キャラ | 『気にしすぎる自分』は、実は特殊能力 |
| 07 | B · 発見 | 飽きっぽい人と、続く人。脳が違った |
| 08 | C · 逆説 | 『人気者』ほど、実は疲れやすい |
| 09 | B · 発見 | ケンカが長引く人と、すぐ解決する人の差 |
| 10 | A · 観察 | 幸せかどうか、半分は性格で決まってた |

### v2 設計ルール要約

- 6 枚: hook → tension → reveal → mechanism → twist → cta
- S1-S5 に cliffhanger(「▸ 正体は —」「▸ 実は —」等、バリエーション)
- S6 = 保存 ▢ / コメント ◖ / フォロー ▸
- キャプション = 800-1200 字ミニ記事(数字・出典・実践法・導線・ハッシュタグ)

---

## 🚀 次の優先タスク

### 【最優先】 TikTok 用スライド 10 種を**実ファイル生成**

1. `tiktok-slides/index-atlas.html` をブラウザで直接開く(ダブルクリック)
2. 上部「**全て生成してZIPダウンロード**」で 10 投稿まとめて DL
   - または各投稿「この投稿を生成」で個別 DL
3. ZIP 内容: `post-NN_タイトル/` に `01.png - 06.png`(1080×1920 PNG)+ `caption.txt`
4. TikTok 投稿時:
   - 各投稿 ZIP を解凍
   - 01.png 〜 06.png を順番にカルーセル投稿
   - caption.txt の内容を投稿文に貼り付け

### その後のタスク候補

- **ロゴ PNG 出力**: `tiktok-slides/logo-export.html` で TikTok / note のアイコン DL(ユーザー作業)
- **プロフィール設定**: TikTok bio と note bio 更新(承認済み文、下記参照)
- **TikTok 投稿開始**: 10 本のうち Post 01(怒りっぽい人…)から開始推奨(既存 1000 再生の「怒りっぽい人」パターン)
- **反応を見て次の 40 投稿**: 伸びる型を見極めてから、タイプ別リビール 20 本 + Big5 基礎 10 本を追加

---

## 📝 プロフィール文(承認済)

**TikTok bio**:
> 怒りっぽい、続かない、気にしすぎ ─
> 性格の「なぜ」を Big5 の研究で解く
> paternia.vercel.app

**note bio**:
> あなたの性格が「模様」になる Big5 診断 paternia の公式 note。恋愛・キャリア・繊細さ・ストレス ── 20 タイプ別の取扱説明書を、論文引用 × 中高生でもわかる言葉で公開中。✦ paternia.vercel.app

---

## 🎨 ロゴ / ブランド資産(出力待ち)

- **メインマーク**: 5 点ペンタゴン + 中央ジェム
- **ワードマーク**: paternia(Cormorant Garamond、letter-spacing 0.22em、ember gold)
- **エクスポート**: `tiktok-slides/logo-export.html` で PNG DL
  - `paternia-tiktok-profile-night.png`(1080×1080、night bg)
  - `paternia-tiktok-profile-gold.png`(1080×1080、gold bg)
  - `paternia-note-avatar.png`(200×200)
  - `paternia-note-header-centered.png`(1280×670)
  - `paternia-note-header-left.png`(1280×670、日本語説明入り)
  - `paternia-favicon.svg`

---

## 🔧 開発コマンド

```powershell
cd G:\projects\art\moyou-v2
npm run dev       # http://localhost:3000
npm run build     # 静的エクスポート(out/)
```

Vercel は `main` push で自動デプロイ。

### 直近コミット

- `bfcd9d4` feat: top page refinement — cleaner hero, perf, atlas-native starfield
- `997e5fa` feat: Atlas direction — warm night palette, horoscope frame, observer voice
- `3f000c1` docs: refresh handoff — atlas direction
- `6b6d809` feat: 10問版診断(/quick) + 離脱計測GA4

---

## 📊 GA4 計測

Measurement ID: `G-YZTC6F541R`
- 計測済: `diagnosis_started` / `diagnosis_completed` / `question_answered` / `result_view` / `share_click` / `gallery_type_view` / `note_click`
- 未計測(低優先): `hero_pattern_change`

---

## 💰 マネタイズ(変更なし)

- 20 タイプ × 特化 note 記事(300-780 円)+ U1 相性完全版(¥1,480)+ U2 恋愛完全ガイド(¥980)+ intro 無料
- 現行 23 記事公開済、中高生レベル平易化済
- 導線: TikTok → /quick → 結果画面 MORE ABOUT YOU → note

---

## 🚫 避けるべきこと

- 絵文字の乱用(✦ ◆ ♡ 等の幾何記号のみ可)
- ユーザー不在の断定(「あなたは〇〇です」→「〇〇の傾向があります」)
- 「軸」「卒業し」など formulaic な表現
- 「」の内側での改行
- 英語研究名そのまま(「Schmitt 2004」→「アメリカの大学・53 カ国調査」に)
- 1 枚のスライドに複数の font-size 混在
- lead の有無でレイアウト変動(空でも slot 確保が必須)

---

**次の incoming セッションへ**:
1. このファイル読むだけで完全再開可能
2. **最優先タスクは `tiktok-slides/index-atlas.html` の ZIP 生成**
3. Post 01 の「怒りっぽい人、実は繊細な人。」は既存 1000 再生記録の流れを汲む、一番最初に投稿するべき回
