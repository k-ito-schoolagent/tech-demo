# FORM — Interactive Science Lab

**https://k-ito-schoolagent.github.io/tech-demo/**

機械と半導体を3Dで動かして、仕組みを学ぶ日本語の教材集です。どのデモも、画面の裏で動いている**計算モデルとその前提を明示し、テストで検証**しています。

**だれでもデモを追加できる、オープンなプロジェクトです。** 授業で見せたい仕組み、好きな機械や回路を、1ページのデモとして足してください。GitHub がはじめての方の、issue やプルリクエストの練習にも使ってください。→ [参加のしかた](CONTRIBUTING.md)

## 収録しているデモ

| デモ | 分野 | 体験できること |
| --- | --- | --- |
| [6気筒エンジン](https://k-ito-schoolagent.github.io/tech-demo/engine.html) | 機械 | 直列6気筒。鋳造ブロック、24バルブ、吸排気、補機。外観・カットモデル・機構表示・分解。回転数、時間倍率、クランク角度、気筒と部品選択 |
| [CVT](https://k-ito-schoolagent.github.io/tech-demo/cvt.html) | 機械 | ベルト式CVT。可動シーブ、固定長の金属ベルト、入力・出力軸。変速位置、入力回転数、自動変速、ケース表示、部品説明 |
| [BJT](https://k-ito-schoolagent.github.io/tech-demo/bjt.html) | 半導体 | NPNバイポーラトランジスタ。N⁺/P/N接合と粒子表示。ベース電流、β、負荷抵抗、遮断・能動・飽和。回路図と電流グラフが同期 |
| [MOSFET](https://k-ito-schoolagent.github.io/tech-demo/mosfet.html) | 半導体 | NチャネルMOSFET。ゲート電圧・ドレイン電圧・しきい値、チャネル形成、遮断・線形・飽和。伝達特性・出力特性の同期グラフ |
| [単振り子（見本）](https://k-ito-schoolagent.github.io/tech-demo/pendulum.html) | 力学 | 振れ幅と周期の関係。厳密な周期と小角近似を比べる。**新しいデモをつくるときの見本** |

「こんなデモがほしい」は [issue](https://github.com/k-ito-schoolagent/tech-demo/issues/new/choose) でリクエストしてください。

操作：ドラッグで回転、スクロール・ピンチで拡大縮小。ドラッグを使わない視点ボタン・左右回転・拡大縮小ボタンもあります。部品は3Dまたは側面のボタンから選べ、スライダーはキーボードでも操作できます。動きを減らすOS設定では停止状態から始まります。

## 参加のしかた（くわしくは [CONTRIBUTING.md](CONTRIBUTING.md)）

| やること | 方法 |
| --- | --- |
| 話してみる | [issue](https://github.com/k-ito-schoolagent/tech-demo/issues/new/choose) に「こんなデモがほしい」「この説明はまちがっている」「表示がおかしい」を書く |
| 直す・足す | 説明文の改善、モデルの前提の追記、テストの追加をプルリクエストで送る |
| デモをつくる | `npm run new-demo -- <id> "<名前>"` で見本をコピーして、自分のデモを1ページつくる |
| GitHub の練習 | 「練習：はじめての issue」を書く、[CONTRIBUTORS.md](CONTRIBUTORS.md) に名前を足すプルリクエストを送る |

## 動かす

```sh
npm install
npm run dev        # 開発用サーバー（表示された URL を開く）
npm test           # 計算モデルのテスト
npm run build      # dist/ に書き出し
npm run preview    # ビルド結果を表示
```

Node.js 22 以上を使ってください。

## しくみ

```
demos.json            デモの登録簿（ナビ・一覧ページ・ビルド対象はここから自動でつくられる）
index.html            一覧ページ
<id>.html             各デモのページ（engine / cvt / bjt / mosfet / pendulum）
src/<id>.js           各デモの 3D と操作
src/*-model.js        計算モデル（描画から切り離し、node --test で検証）
src/*.test.js         テスト
src/stage.js          3D の舞台（カメラ、光、視点ボタン、部品のクリック、ラベル）
src/navigation.js     ヘッダーのナビ
scripts/new-demo.mjs  新しいデモの雛形をつくるスクリプト
```

### 使っている技術

- [three.js](https://threejs.org/)（3D 表示。OrbitControls・CSS2DRenderer・RoomEnvironment など addons も使用）
- [Vite](https://vite.dev/)（開発サーバーとビルド。複数ページ構成）
- [Lucide](https://lucide.dev/)（アイコン）
- Node.js の標準テストランナー `node --test`（計算モデルの検証）
- GitHub Actions + GitHub Pages（`main` に取り込まれると、テスト・ビルドのあと自動で公開。プルリクエストではテストとビルドだけ自動で確認）

## モデルの前提

### エンジン

4ストロークの直列6気筒、点火順序1–5–3–6–2–4、120°等間隔点火。1番気筒の燃焼上死点を0°とし、720°周期。スライダークランク運動学、ストローク86 mm換算。4バルブ/気筒を模式表示。カムの回転はクランクの1/2です。

バルブ時期・形状、カムとタペットの接触、点火、配管、潤滑系統、冷却系統は簡略化しています。実機のCADや熱力学モデルではありません。分解は部品群を移動する観察用表示です。

### CVT

固定の軸間距離、外接接線・巻き付き円弧に基づく一定ベルト長。入力半径に対して出力半径を数値的に解きます。すべりなしの周速一致、理想的なトルク伝達を計算します。回転表示は実時間の1/40。

油圧制御、摩擦・損失、変速過渡応答、金属ベルトの押し力と材料変形は含みません。シーブ・ベルトの寸法は模式値です。

### BJT

NPN、エミッタ接地、VCC=5 V、理想ベース電流源。固定βモデルで `IC = min(βIB, (VCC − 0.2)/RC)`、`IE = IC + IB`。飽和では負荷で電流が制限されることを表現します。飽和プリセットは到達に必要な場合のみβも100に合わせます。

実際の電圧駆動特性、温度、漏れ、接合容量、降伏、飽和時の逆注入などは再現しません。粒子の個数・速度・領域寸法は説明用の誇張。外観と端子配列は特定製品の寸法・ピン配置ではありません。

### MOSFET

エンハンスメント型の長チャネルNMOS。ソース・基板接地、理想電圧源による独立したVGS・VDS設定。過駆動電圧を `u = VGS − Vth` とし、遮断では `ID = 0`、線形領域では `ID = k(u VDS − VDS²/2)`、飽和領域では `ID = k u²/2`。`k = 0.002 A/V²`。直流ゲート電流は0。

平面型の模式断面です。チャネル厚・電界・粒子は観察用の誇張。容量、漏れ、温度、ボディ効果、チャネル長変調、降伏、ボディダイオードは含みません。MOSFETの飽和とBJTの飽和は意味が異なります。

### 単振り子（見本）

糸は伸びず質量なし、おもりは質点、空気抵抗・摩擦なし、g = 9.80665 m/s²。周期は第1種完全楕円積分による厳密解 `T = 4√(L/g)·K(sin(θ₀/2))`（算術幾何平均で計算）と、小角近似 `T₀ = 2π√(L/g)` を並べて表示。動きは運動方程式 `θ'' = −(g/L) sin θ` を4次のルンゲ＝クッタ法で解いています。

## 検証

- エンジン: 点火順序、720°周期、ストローク、コンロッド長、4行程とバルブ状態。
- CVT: 全変速域のベルト長、周速一致、理想動力保存、接線経路の連続性。
- BJT: 遮断・能動・飽和、負荷線、電流保存と制限。
- MOSFET: しきい値、線形・飽和の数値、境界の連続性、電流の単調性と消費電力。
- 単振り子: 小角近似との一致、振れ幅と周期の単調性、1周期後の角度とエネルギー保存。
- ページ間移動、主要操作、狭い画面の表示はブラウザで確認。

## 参考資料

- [BMW Engine Technology](https://bmwtechinfo.bmwgroup.com/tech_training_manual/ST501%20Engine%20Technology.pdf)
- [ジヤトコ: トランスミッションとは](https://www.jatco.co.jp/innovation/introduction/glossary.html)
- [東芝: BJTの動作原理](https://toshiba.semicon-storage.com/jp/semiconductor/knowledge/faq/mosfet_bipoler-transistors/how-do-npn-and-pnp-transistors-operate.html)
- [Three.js](https://threejs.org/docs/)

## ライセンス

- プログラム：[MIT License](LICENSE)
- 解説文（ページ内の説明、README、ドキュメント）：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ja)
- three.js（MIT）、Vite（MIT）、Lucide（ISC）はそれぞれのライセンスに従います

くわしくは [LICENSE-CONTENT.md](LICENSE-CONTENT.md) を読んでください。参加する人は [行動規範](CODE_OF_CONDUCT.md) を守ってください。
