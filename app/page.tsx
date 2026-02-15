"use client"

import { useState } from "react"
import { Receipt } from "lucide-react"
import { SalaryInputForm } from "@/components/salary-input-form"
import { SalaryResult } from "@/components/salary-result"
import { DeductionChart } from "@/components/deduction-chart"
import { calculateSalary, type CalculationResult } from "@/lib/salary-calculator"

export default function Page() {
  const [result, setResult] = useState<CalculationResult | null>(null)

  const handleCalculate = (
    salary: number,
    prefecture: string,
    isNursingCare: boolean
  ) => {
    const calc = calculateSalary(salary, prefecture, isNursingCare)
    setResult(calc)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <Receipt className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              {"給与手取り計算シミュレーター"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {"令和7年度（2025年度）対応"}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 入力フォーム */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 flex flex-col gap-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-base font-semibold text-foreground mb-5">
                  {"給与情報を入力"}
                </h2>
                <SalaryInputForm onCalculate={handleCalculate} />
              </div>

              {/* チャート */}
              {result && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <DeductionChart result={result} />
                </div>
              )}
            </div>
          </div>

          {/* 結果表示 */}
          <div className="lg:col-span-7">
            {result ? (
              <SalaryResult result={result} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-xl border border-dashed border-border bg-card p-12">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <Receipt className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {"給与を入力して計算しましょう"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    {"月額の額面給与を入力すると、社会保険料・所得税・住民税の内訳と手取り額が表示されます。"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <footer className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p className="font-medium">{"出典・根拠"}</p>
            <ul className="flex flex-col gap-1 leading-relaxed">
              <li>
                {"健康保険料率: "}
                <a
                  href="https://www.kyoukaikenpo.or.jp/g7/cat330/sb3130/r07/250214/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {"協会けんぽ 令和7年度都道府県単位保険料率"}
                </a>
              </li>
              <li>
                {"厚生年金保険料率: "}
                <a
                  href="https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/ryogakuhyo/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {"日本年金機構 厚生年金保険料額表"}
                </a>
              </li>
              <li>
                {"雇用保険料率: "}
                <a
                  href="https://www.mhlw.go.jp/content/001401966.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {"厚生労働省 令和7年度雇用保険料率"}
                </a>
              </li>
              <li>
                {"所得税率: "}
                <a
                  href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {"国税庁 No.2260 所得税の税率"}
                </a>
              </li>
              <li>
                {"給与所得控除: "}
                <a
                  href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {"国税庁 No.1410 給与所得控除（令和7年分以降）"}
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </main>
  )
}
