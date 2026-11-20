# Sleep Habit RPG

睡眠習慣をゲーム進行に連動させるReact + TypeScript製RPGのMVPです。

## セットアップ

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
npm run preview
```

## テスト・品質

```bash
npm test
npm run lint
npm run format
```

## 主な機能

- 睡眠アンケート、スコア、毎日の報酬
- 第1〜2章のストーリーと戦闘
- 手動/セミオート切替、スキル、必殺、防御
- ストーリー編成、装備効果、常設総合ガチャ
- ルームコード式の週末ボス疑似チーム
- 初回チュートリアル

## データ追加

`src/data/*.json` を編集するとコンテンツを追加できます。

- `chapters.json`: 章・ステージ追加
- `characters.json`: キャラクター追加
- `enemies.json`: 敵追加
- `banners.json`: ガチャ枠追加
- `weekendBoss.json`: 週末ボス追加
- `tutorial.json`: チュートリアル追加

数値・データ構造の検証はZodで行います。

## 画像差し替え

`public/assets/placeholders/manifest.json` のキーに対応する画像を配置します。

- キャラ立ち絵: `character_*`
- 敵画像: `enemy_*`
- 背景: `bg_*`
- ボタンアイコン: `icon_*`

同名ファイルへ置換するか、manifestの`path`を変更してください。

## 睡眠取得方式の差し替え

`src/services/sleepDataSource.ts` の `SleepDataSource` を実装します。
現在は `SurveySleepDataSource` がアンケートデータをlocalStorageへ保存します。
将来のHealthKit等は同インターフェースを実装し、`src/services/index.ts` の注入先だけ変更します。

## BGM差し替え

`src/services/audioManager.ts` の `BGM_TRACKS` にシーンキーと音源を追加します。
`public/assets/audio/` のファイルを差し替えて利用できます。

## ガチャ追加

1. `src/data/banners.json` にバナーを追加
2. `src/data/lineups.json` に排出アイテムを追加
3. 必要に応じてレアリティ率を設定

コード変更は不要です。

## 仮決め

- ステージ報酬は詳細表ではなく、クリア毎の基本報酬として実装
- 1-1はチュートリアル専用会話ステージ、1-2以降をゲームデータで進行
- セミオートは通常攻撃優先、必殺ゲージ5以上なら必殺優先
- ルームコードはブラウザ内で疑似チームを再現
- シナジー、ランキング、サーバー同期は未実装
- スタミナは初回起動時に最大値で開始し、保存時に5分ごとの自然回復を計算

## 技術選定理由

Zustandは小規模MVPのボイラープレートを抑え、永続化・画面間共有・テストを簡潔にできるため採用します。

## 画面遷移

```text
ホーム
├─ 睡眠習慣
├─ ストーリー → 会話 → バトル → 結果
├─ 週末ボス → バトル
├─ 編成 → ストーリー編成 / 週末編成
└─ ガチャ → 結果
```
