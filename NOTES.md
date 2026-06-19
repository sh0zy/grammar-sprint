# 文法スプリント — 制作メモ

## 状態：MVP完成（2026-06-19）

仕様書（高校英語 完了形/助動詞/態 の定期テスト直前対策アプリ）どおりに実装完了。
`npm run dev` / `npm run build` ともにエラーなし。採点・出題ロジックは37件の自動テストで検証済み（テストファイルは検証後に削除）。

## 検証済み
- `tsc -b`：型エラー0
- `vite build`：成功（CSS 23.3kB / JS 273kB・gzip 81kB）
- dev サーバー：HTTP 200・タイトル「文法スプリント」確認
- 採点ロジック（grading.ts）：mc/fill/reorder/spelling/error/dialogue/writing 各ケース + buildQuiz の単元・形式フィルタ + 件数を全パス
- Capacitor android プラットフォーム追加済み + `cap sync` 済み

## データ
- 全106問（perfect 31 / modal 27 / passive 33・うち spelling 10 を含む）+ 予想問題15問は内数
- `src/data/problems.ts` に集約。仕様書のデータをそのまま転記

## 実装の要点 / 設計判断
- 画面遷移は `App.tsx` の state マシン（home / quiz / result / settings）。ルーター不使用
- 出題形式に「すべて（all）」を追加（仕様の8形式＋予想に加え、総ざらい用途で有用なため）。予想問題は通常形式選択から除外し predicted モード専用
- reorder はチップ tap で組み立て（内部 state を `key={problem.id}` でリセット）
- dialogue は `answer` の `" / "` 分割数＝空所数。accept[] は空所セットごとの別解候補
- writing は自動採点せず Feedback 内で ○/✕ 自己採点 → ✕ は復習リストへ
- spelling のみ厳密一致（連続空白圧縮をかけない）
- ダークモードは `<html>` の class で制御、localStorage 保持
- localStorage キー：`gs_progress` / `gs_review` / `gs_settings` / `gs_lastSession`（全て try/catch・破損時初期化）

## 残作業（任意・MVP外）
- [ ] 実機 APK ビルド（ユーザー環境の Android Studio + JDK17 が必要。手順は README に記載）
- [ ] アプリアイコン/スプラッシュの本番差し替え（`resources/icon.svg` を元に @capacitor/assets で生成）。現状は Capacitor デフォルト
- [ ] PWA 化（vite-plugin-pwa）※オフライン前提なので相性良。必須ではない
- [ ] 問題数の拡充（現状は仕様書準拠の106問）

## 動かし方
```
npm install
npm run dev
# Android:
npm run cap:sync && npm run cap:open
```
