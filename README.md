# Sleep Habit RPG

睡眠習慣をゲーム進行に連動させるReact + TypeScript製RPGのMVPです。UIとゲームデータは日本語です。

## 必要環境

- Node.js 20以上（npm付属）

## セットアップと起動

```bash
npm install
npm run dev
```

ブラウザでViteが表示するURLを開いてください。ゲーム状態はブラウザのlocalStorageに保存されます。

## ビルド・プレビュー・テスト

```bash
npm run build
npm run preview
npm test
npm run lint
npm run format:check
```

Vitestのユニットテストは睡眠スコア/報酬、戦闘計算、ガチャ抽選を対象にしています。GitHub上のファイル編集環境ではNode/npmコマンドを実行できないため、実行結果はローカル環境またはCIで確認してください。

## 主な機能

- 共通ヘッダー、プレイヤーステータス、下部クイックナビ
- 睡眠時間・就寝時刻・質の入力、日付ごとの記録、履歴とスコア
- 睡眠報酬（石、7時間以上のチケット、スタミナ全回復。1日1回）
- 第1〜2章の会話・ステージ選択・戦闘、前ステージクリアによる解放
- 通常攻撃、スキルCT、必殺ゲージ、防御、ターゲット選択、セミオート
- ストーリー編成、常設総合ガチャ、ルームコード式ローカル週末ボス
- 初回チュートリアル、JSONゲームデータ、仮SVGアセット

## データ追加

`src/data/` のJSONを編集します。

- `chapters.json`: 章・会話・ステージ・敵構成
- `characters.json`: キャラクター、職業、ステータス、スキル名、必殺威力
- `enemies.json`: 敵のHP・攻撃力
- `banners.json`: ガチャ枠、確率、排出アイテム
- `weekendBoss.json`: 週末ボスのHP・攻撃・報酬EXP
- `tutorial.json`: 初回案内
- `assets.json`: キーとアセットURLの対応

`src/data/schema.ts` のZodスキーマで、章・キャラ・敵・ガチャデータをアプリ起動時に検証します。ステージの敵ID、キャラクターIDは対応するJSON内のIDと一致させてください。ガチャ確率の合計は100にしてください。

## 画像差し替え

仮SVG画像は `public/assets/placeholders/` にあります。同名ファイルを差し替えるか、新しい画像を配置して `src/data/assets.json` のURLを変更してください。現状の画面は仮テキスト表示が中心で、画像manifestは将来の表示箇所追加にも使える形で用意しています。

## 睡眠データの取得方式

`src/services/sleepDataSource.ts` の `SleepDataSource`（`getDailySleep`、`saveDailySleep`、`listSleepRecords`）が取得層のインターフェースです。現在の `SurveySleepDataSource` はlocalStorageを利用します。将来はHealthKit/Google Fit/API用クラスで同インターフェースを実装し、画面に注入する実装を差し替えます。どの実装も共通の `SleepRecord` を返す設計です。

ゲーム画面の現在の睡眠記録保存はZustand persistを使います。外部連携を有効化する際は、UIの保存・読込を `SleepDataSource` 経由に統一してください。

## ガチャ追加

`src/data/banners.json` にバナーを追加し、確率合計を100に設定します。各バナーの `lineup` に排出アイテム（`character` / `equipment` / `skill`）を追加します。抽選はレアリティ確率に従い、該当レアリティのラインナップから選びます。単発300石、10連3000石です。

## BGM追加・差し替え

`src/services/audioManager.ts` のシーンキー/音源パスマップへエントリーを追加し、音源を `public/assets/audio/` に配置します。`home`、`story`、`battle` のキーは画面遷移で利用します。ブラウザの自動再生制限により、ユーザー操作前は再生されない場合があります。音源ファイル自体は同梱していません。

## 技術選定

- **React + TypeScript + Vite**: MVPの開発・ビルドを簡潔にし、型安全な画面・データ構造を作るため。
- **Zustand**: 小さなアプリで画面共有状態を簡潔に実装し、persistでlocalStorageへ保存できるため。
- **Vitest**: Vite/TypeScriptと統合し、重要な計算ロジックをテストしやすいため。

## 仮決め・未実装

- 1日の入力値は日次記録、直近7件の記録は週次スコアとして集計。週次基本点は最大140、平均品質点は最大45、規則性は最大15で合計200。規則性は就寝時刻の差が60分以内なら加点。
- 7時間以上の記録で100石・チケット1枚、6時間以上で25石。6時間以上はスタミナを全回復します。記録の同日更新では報酬を再付与しません。
- ストーリー報酬、素材ドロップ、装備所持/装着UI、役割別スキル効果、詳細な難易度選択は簡略化されています。
- 週末ボスは同じブラウザ内の疑似ルームで、実際のオンライン通信や週末ボスバトルは未実装です。
- 連続日数ボーナス、ランキング、チームシナジー、サーバー同期、HealthKit/Google Fit連携、自然スタミナ回復は未実装です。
- StorageAdapter、SleepDataSource、AudioManagerは差し替えの境界を用意していますが、現状の全画面が各抽象化を経由する段階には至っていません。
