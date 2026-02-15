# 給与手取り計算シミュレーター

月額給与（額面）から、社会保険料・所得税・住民税を概算し、月額の手取りを可視化する Next.js アプリです。

![給与手取り計算シミュレーターの画面](img/image.png)

[![Launch App](https://img.shields.io/badge/Launch%20App-Open-22c55e?style=for-the-badge)](https://unilorn.github.io/salary-tax-estimator/)

## 機能

- 月額給与（額面）から手取り額を自動計算
- 都道府県ごとの健康保険料率に対応
- 介護保険料（40歳〜64歳想定）の ON/OFF 切替
- 社会保険料・税金の内訳表示
- 内訳のグラフ表示

## 前提

- Node.js 22 以上
- pnpm 10 以上

## ローカル実行

```bash
pnpm install
pnpm dev
```

ブラウザで `http://localhost:3000` を開いてください。

## ビルド

```bash
pnpm build
```

本プロジェクトは静的エクスポート（`next export` 相当）設定です。ビルド成果物は `out/` に出力されます。

## GitHub Pages

- 公開 URL: https://unilorn.github.io/salary-tax-estimator/
- `main` ブランチへの push で GitHub Actions から自動デプロイ
- ワークフロー: `.github/workflows/deploy-pages.yml`


## 計算ロジックについて

計算ロジックは `lib/salary-calculator.ts` に実装しています。
主に以下の公的情報（令和7年度/2025年度ベース）を参照した概算です。

- 協会けんぽ 都道府県単位保険料率
- 厚生年金保険料率
- 雇用保険料率
- 国税庁の所得税率・給与所得控除

## 注意

- 本アプリの結果は概算です。実際の給与計算・税額とは差異が生じる場合があります。
- 正確な金額は、勤務先の給与計算・自治体情報・税務署公開情報をご確認ください。
