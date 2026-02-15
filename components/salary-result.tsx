"use client"

import { Shield, Building2, Briefcase, Receipt, Landmark, TrendingDown } from "lucide-react"
import type { CalculationResult } from "@/lib/salary-calculator"

interface SalaryResultProps {
  result: CalculationResult
}

function formatYen(amount: number): string {
  return `¥${Math.round(amount).toLocaleString()}`
}

function DeductionRow({
  label,
  amount,
  sublabel,
}: {
  label: string
  amount: number
  sublabel?: string
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-sm text-foreground">{label}</span>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
      <span className="text-sm font-medium tabular-nums text-foreground">
        {formatYen(amount)}
      </span>
    </div>
  )
}

function SectionCard({
  icon,
  title,
  total,
  children,
  colorClass,
}: {
  icon: React.ReactNode
  title: string
  total: number
  children: React.ReactNode
  colorClass: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className={`flex items-center justify-between p-4 ${colorClass}`}>
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <span className="font-bold tabular-nums">{formatYen(total)}</span>
      </div>
      <div className="px-4 divide-y divide-border">{children}</div>
    </div>
  )
}

export function SalaryResult({ result }: SalaryResultProps) {
  const takeHomeRate = (result.monthlyTakeHome / result.monthlySalary) * 100

  return (
    <div className="flex flex-col gap-6">
      {/* メインサマリー */}
      <div className="rounded-xl border-2 border-primary bg-card p-6">
        <div className="text-center flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{"月額の手取り（概算）"}</p>
            <p className="text-4xl font-bold tracking-tight tabular-nums text-foreground mt-1">
              {formatYen(result.monthlyTakeHome)}
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">{"額面"}</span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatYen(result.monthlySalary)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">{"控除合計"}</span>
              <span className="font-semibold tabular-nums text-destructive">
                {formatYen(result.totalMonthlyDeduction)}
              </span>
            </div>
          </div>
          {/* 手取り率バー */}
          <div className="flex flex-col gap-1.5">
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                style={{ width: `${takeHomeRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {"手取り率: "}{takeHomeRate.toFixed(1)}{"％"}
            </p>
          </div>
        </div>
      </div>

      {/* 社会保険料 */}
      <SectionCard
        icon={<Shield className="h-4 w-4 text-accent-foreground" />}
        title="社会保険料"
        total={result.totalSocialInsurance}
        colorClass="bg-accent text-accent-foreground"
      >
        <DeductionRow
          label="健康保険"
          amount={result.healthInsurance}
          sublabel={`標準報酬月額 ${formatYen(result.healthInsuranceStandardMonthly)} / ${result.prefectureName}`}
        />
        {result.nursingCareInsurance > 0 && (
          <DeductionRow
            label="介護保険"
            amount={result.nursingCareInsurance}
            sublabel="40〜64歳対象（1.59%の折半）"
          />
        )}
        <DeductionRow
          label="厚生年金"
          amount={result.pension}
          sublabel={`標準報酬月額 ${formatYen(result.pensionStandardMonthly)} / 保険料率 18.3%の折半`}
        />
        <DeductionRow
          label="雇用保険"
          amount={result.employmentInsurance}
          sublabel="一般の事業（労働者負担 0.55%）"
        />
      </SectionCard>

      {/* 所得税 */}
      <SectionCard
        icon={<Landmark className="h-4 w-4 text-foreground" />}
        title="所得税（月額概算）"
        total={result.monthlyIncomeTax}
        colorClass="bg-secondary text-secondary-foreground"
      >
        <DeductionRow
          label="年収"
          amount={result.annualIncome}
        />
        <DeductionRow
          label="給与所得控除"
          amount={result.salaryDeduction}
          sublabel="令和7年分の控除額"
        />
        <DeductionRow
          label="給与所得"
          amount={result.salaryIncome}
        />
        <DeductionRow
          label="基礎控除"
          amount={result.basicDeductionIncomeTax}
          sublabel="令和7年改正後"
        />
        <DeductionRow
          label="社会保険料控除（年額）"
          amount={result.socialInsuranceDeductionAnnual}
        />
        <DeductionRow
          label="課税所得"
          amount={result.taxableIncomeForIncomeTax}
        />
        <DeductionRow
          label="所得税+復興特別所得税（年額）"
          amount={result.annualIncomeTax}
          sublabel="復興特別所得税 = 所得税 × 2.1%"
        />
      </SectionCard>

      {/* 住民税 */}
      <SectionCard
        icon={<Building2 className="h-4 w-4 text-foreground" />}
        title="住民税（月額概算）"
        total={result.monthlyResidentTax}
        colorClass="bg-secondary text-secondary-foreground"
      >
        <DeductionRow
          label="基礎控除"
          amount={result.basicDeductionResidentTax}
        />
        <DeductionRow
          label="課税所得"
          amount={result.taxableIncomeForResidentTax}
        />
        <DeductionRow
          label="住民税（年額）"
          amount={result.annualResidentTax}
          sublabel="所得割10% + 均等割5,500円 - 調整控除"
        />
      </SectionCard>

      {/* 注意書き */}
      <div className="rounded-lg bg-muted p-4">
        <div className="flex gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground">{"ご注意"}</p>
            <ul className="text-xs text-muted-foreground leading-relaxed flex flex-col gap-0.5">
              <li>{"- 本計算は概算です。実際の金額とは異なる場合があります。"}</li>
              <li>{"- 扶養控除・配偶者控除等の各種控除は含まれていません。"}</li>
              <li>{"- 住民税は前年の所得に基づいて計算されますが、ここでは当年の年収で概算しています。"}</li>
              <li>{"- 健康保険料率は協会けんぽ（令和7年度）の料率です。組合健保の場合は異なります。"}</li>
              <li>{"- ボーナスは含まれていません。"}</li>
              <li>{"- 所得税・給与所得控除・基礎控除は令和7年分の改正後の金額です。"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
