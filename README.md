# Sleep Habit RPG

睡眠習慣をゲーム進行に連動させるReact + TypeScript製RPGのMVPです。画面文言・コンテンツは日本語です。

## 必要環境

- Node.js 20以上（npm付属）

## セットアップと起動

```bash
npm install
npm run dev
```

表示されたローカルURLをブラウザで開きます。進行状況はブラウザのlocalStorageに保存されます。

## ビルド・プレビュー

```bash
npm run build
npm run preview
```

## テスト・品質チェック

```bash
npm test
npm run lint
npm run format:check
```

Vitestのユニットテストは睡眠スコア/報酬、戦闘計算、ガチャ抽選を対象にしています。

## 実装済みの主な機能

- 共通ヘッダー、プレイヤーステータス、下部クイックナビ
- 睡眠時間・就寝時刻・質の入力、日付ごとの記録、履歴とスコア
- 睡眠時間に応じた石報酬（同じ日付への再保存では再付与しない）
- 第1〜2章のステージ一覧、前ステージクリアによる解放
- 通常攻撃、スキルボタン、必殺、防御、ターゲット選択、セミオート
- ストーリー編成、常設総合ガチャ、ルームコード式ローカル週末ボス
- 初回チュートリアル、JSONゲームデータ、仮SVGアセット

## データ追加

ゲームデータは `src/data/` のJSONを編集します。

- `chapters.json`: 章・会話・ステージ・敵構成
- `characters.json`: キャラクター、職業、ステータス、スキル名、必殺威力
- `enemies.json`: 敵のHP・攻撃力
- `banners.json`: ガチャ枠、確率、排出アイテム
- `weekendBoss.json`: 週末ボスのHP・攻撃・報酬EXP
- `tutorial.json`: 初回案内
- `assets.json`: キーとアセットURLの対応

`src/data/schema.ts` のZodスキーマで、章・キャラ・敵・ガチャデータをアプリ起動時に検証します。新しい参照IDはJSON間で一致させてください。

## 画像差し替え

仮画像は `public/assets/placeholders/` にあります。既存のSVGを同名で置換するか、ファイルを追加して `src/data/assets.json` の該当キーのパスを変更します。画面側の画像表示にキーを接続するのもアセット表示を追加する際の手順です（現在の画面は仮テキスト表示を中心としています）。

## 睡眠データ取得方式の差し替え

`src/services/sleepDataSource.ts` の `SleepDataSource`（`getDailySleep`、`saveDailySleep`、`listSleepRecords`）が取得層の契約です。現在の `SurveySleepDataSource` はlocalStorageを利用します。将来は同インターフェースを実装するHealthKit/Google Fit/API用クラスを作り、画面から利用する実装を差し替えます。表示・スコア計算には同じ `SleepRecord` 型を使います。

## ガチャ追加

`src/data/banners.json` にバナーを追加し、確率の合計が100になるように設定してください。排出アイテムは各バナーの `lineup` に追加します。新規アイテムの種類は `character`、`equipment`、`skill` のいずれかです。JSONを起点に表示・抽選し、各抽選結果は所持履歴に保存されます。

## BGM追加・差し替え

`src/services/audioManager.ts` のシーンキーとパスの対応表へエントリーを追加し、音源を `public/assets/audio/` に配置します。`home`、`story`、`battle` のキーは画面遷移時に使用されます。ブラウザの自動再生制限により、ユーザー操作前は再生されない場合があります。

## 技術選定

- **Zustand**: 小さなMVPで画面共有状態を簡潔に実装でき、永続化ミドルウェアも利用できるため採用。
- **localStorage**: サーバー不要で手元のMVPを実行できる。`StorageAdapter` と `SleepDataSource` の境界を用意し、将来の永続層差し替えに備える。
- **Vitest**: Vite/TypeScript構成と統合しやすく、重要な計算ロジックを高速に検証できるため採用。

## 画面遷移

```text
ホーム ─┬─ 睡眠習慣
        ├─ ストーリー → 会話/バトル → 結果
        ├─ 週末ボス → ローカルルーム
        ├─ 編成
        └─ ガチャ → 抽選結果
```

## 仮決め・未実装

- スコアは日次表示に加え、直近7件の睡眠記録から週次（0〜200）を集計します。規則性は記録間の就寝時刻差がすべて60分以内なら加点し、品質は7日以内の平均星数で算出します。
- 報酬詳細・素材ドロップ、装備所持/装着UI、アクティブスキルCT、週末バトル操作・報酬は簡略化されています。
- 週末ルームは同一ブラウザのlocalStorage内のみで、実際のオンライン通信はありません。
- 睡眠の連続日数ボーナス、ランキング、チームシナジー、サーバー同期、HealthKit/Google Fit連携は未実装です。
- 自然スタミナ回復の時間経過処理・睡眠報酬でのスタミナ全回復・チケット付与は今後の実装項目です。
- 画像manifestとAudioManagerは用意済みですが、キャラ画像の全画面反映や音源ファイルそのものは同梱していません。
