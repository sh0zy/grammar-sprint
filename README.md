# 文法スプリント（Grammar Sprint）

高校英語の定期テスト直前に、**「単元 × 出題形式」を選んで一気に総ざらい**できる演習アプリ。
完全オフラインで動作し、進捗は端末内（localStorage）に保存します。

- **単元**：完了形 / 助動詞 / 態（受動態）
- **出題形式**：4択・穴埋め・並び替え・英作文・正誤・英会話穴埋め・選択問題・スペル書き ＋ 予想問題（横断ミックス）
- **全106問**（うち予想問題15問）
- 即時フィードバック＋全問に日本語解説、間違えた問題だけの復習モード、単元別・形式別の正答率記録

---

## 技術スタック

- React 19 + Vite + TypeScript
- Tailwind CSS（ユーティリティのみ / `darkMode: "class"`）
- 状態管理は React の `useState` のみ（外部ライブラリなし）
- 永続化は `localStorage`
- アイコンは `lucide-react`
- Android 配布は Capacitor
- **外部API・通信・課金なし（オフライン完結）**

---

## セットアップ

```bash
npm install
npm run dev      # 開発サーバー（http://localhost:5173）
npm run build    # 型チェック + 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果をローカル確認
```

> `vite.config.ts` で `base: "./"` を指定済み（相対パス出力）。Capacitor / `file://` での読み込みに対応しています。

---

## ディレクトリ構成

```
src/
  data/
    problems.ts          # 全106問のデータ（型定義・ラベルも同梱）
  lib/
    grading.ts           # type 別の採点ロジック / 正規化
    storage.ts           # localStorage ラッパ + セッション型
    shuffle.ts           # Fisher-Yates シャッフル
    quiz.ts              # 出題リスト生成 + 集計
  components/
    Home.tsx             # 単元・形式・出題数・シャッフル選択 + 学習状況
    Quiz.tsx             # 出題コンテナ（進捗・スコア・採点フロー）
    Result.tsx           # 結果（単元別・形式別の内訳）
    Settings.tsx         # ダーク切替 / 進捗リセット（確認ダイアログ）
    cards/
      MCCard.tsx         # mc / choice
      FillCard.tsx       # fill / spelling
      ReorderCard.tsx    # reorder（チップをタップして並べ替え）
      WritingCard.tsx    # writing（模範解答 → 自己採点）
      ErrorCard.tsx      # error（誤文 → 訂正入力）
      DialogueCard.tsx   # dialogue（複数空所）
    common/
      Feedback.tsx       # 正誤 + 正解 + 解説 + 自己採点
      ProgressBar.tsx
      AppShell.tsx       # ヘッダ / 固定フッタ / セーフエリア
  App.tsx                # 画面遷移ステートマシン + ダークモード適用
  main.tsx
  index.css              # Tailwind ディレクティブ + ベーススタイル
```

---

## 出題形式と採点仕様

データの `type` で採点を分岐します（`src/lib/grading.ts`）。

| type | 形式 | 採点 |
|---|---|---|
| `mc` | 4択 | 選んだ選択肢が `answer` と一致 |
| `choice` | 選択問題 | 同上 |
| `fill` | 穴埋め | 前後空白除去・小文字化・連続空白圧縮で `answer` または `accept[]` と一致 |
| `reorder` | 並び替え | 並べた語をスペース連結し `answer` と一致（大小無視） |
| `writing` | 英作文 | 自動採点なし。「答えを見る」で模範解答を表示 → ○/✕ で自己採点（✕は復習対象へ） |
| `error` | 正誤 | 訂正文が `answer` / `accept[]` と一致。不一致でも解説と正文を必ず表示 |
| `dialogue` | 英会話穴埋め | `answer` を `" / "` で分割した各空所と一致。`accept[]` も候補 |
| `spelling` | スペル書き | 前後空白のみ除去・大小無視で**厳密一致**（スペルミス検出が目的） |

---

## 問題データの追加・編集

`src/data/problems.ts` の `problems` 配列に `Problem` を追加するだけで反映されます。

```ts
{
  id: "pf_mc_07",          // 一意なID
  type: "mc",              // ProblemType
  topic: "perfect",        // "perfect" | "modal" | "passive"
  predicted: true,         // 予想問題なら true（省略可）
  instruction: "…",        // 日本語の指示文
  question: "…",           // 問題本体（dialogue は \n で改行、①②マーカー使用）
  choices: ["…"],          // mc / choice のみ
  tokens: ["…"],           // reorder のみ（シャッフル済み語群）
  answer: "…",             // 正解（dialogue 複数空所は " / " 区切り）
  accept: ["…"],           // 別解（省略可）
  explanation: "…",        // 日本語解説（必須）
  translation: "…",        // 和訳（省略可）
}
```

---

## 保存データ（localStorage）

すべて try/catch で安全に読み書きし、壊れたデータは初期化します。

| キー | 内容 |
|---|---|
| `gs_progress` | `{ [id]: { correct, attempts, lastAt } }` |
| `gs_review` | 間違えた問題IDの配列（正解で除外） |
| `gs_settings` | `{ darkMode }` |
| `gs_lastSession` | 直近の出題設定（「前回の続き」用） |

設定画面の「進捗をリセット」で `gs_progress` / `gs_review` / `gs_lastSession` を消去します（表示モードは保持）。

---

## Android APK ビルド（Capacitor）

`appId: com.leopa.grammarsprint` / `appName: 文法スプリント`（`capacitor.config.ts`）。
`android/` プラットフォームは追加済みです。

```bash
# 1. Web をビルドして native にコピー & 同期
npm run cap:sync          # = npm run build && npx cap sync android

# 2. Android Studio で開く
npm run cap:open          # = npx cap open android
```

Android Studio で開いたら：

- **デバッグAPK**：`Build > Build Bundle(s) / APK(s) > Build APK(s)`
  出力先：`android/app/build/outputs/apk/debug/app-debug.apk`
- **リリースAPK**：署名鍵（keystore）を作成し `Build > Generate Signed Bundle / APK`

または Gradle CLI（Android SDK / JDK が必要）：

```bash
cd android
./gradlew assembleDebug    # Windows: gradlew.bat assembleDebug
```

> 必要環境：Android Studio（Android SDK）+ JDK 17。Web を変更したら毎回 `npm run cap:sync` を実行してから再ビルドしてください。

### アイコン / スプラッシュの差し替え

現状は Capacitor のデフォルトアイコンです。差し替えは公式ツールが簡単：

```bash
npm install -D @capacitor/assets
# resources/icon.png（1024×1024）と resources/splash.png（2732×2732）を用意
npx capacitor-assets generate --android
```

デザイン元データとして `resources/icon.svg` を同梱しています（PNG に書き出して上記に使用）。
手動で差し替える場合は `android/app/src/main/res/mipmap-*/` の各画像を置き換えます。

---

## PWA について（任意）

外部通信がないため PWA とも相性が良いです。インストール可能にする場合は
`vite-plugin-pwa` で manifest + Service Worker を追加してください（必須ではありません）。

---

## ライセンス / 出典

問題データは手元の問題集の文法事項に準拠して作成。個人学習用。
