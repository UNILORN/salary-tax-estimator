"use client"

import { Banknote, ReceiptText, ShieldCheck, TrendingDown, WalletCards } from "lucide-react"
import type { CalculationResult } from "@/lib/salary-calculator"

interface SalaryResultProps { result: CalculationResult }

function formatYen(amount: number) {
  return `¥${Math.round(amount).toLocaleString()}`
}

interface PersonResult {
  name: string
  monthlyGross: number
  monthlyTakeHome: number
  healthInsurance: number
  nursingCareInsurance: number
  pension: number
  employmentInsurance: number
  monthlyIncomeTax: number
  monthlyResidentTax: number
  isSocialDependent?: boolean
}

function AmountPair({ monthly, label }: { monthly: number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-semibold tracking-tight tabular-nums text-foreground">
        {formatYen(monthly)}
      </div>
      <div className="mt-1 text-xs text-muted-foreground tabular-nums">
        年間 {formatYen(monthly * 12)}
      </div>
    </div>
  )
}

function BreakdownRow({ label, monthly, accent }: { label: string; monthly: number; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-2">
      <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
      <div className="min-w-0 flex-1 text-sm text-muted-foreground">{label}</div>
      <div className="text-right">
        <div className="text-sm font-medium tabular-nums text-foreground">{formatYen(monthly)}</div>
        <div className="text-[11px] tabular-nums text-muted-foreground">{formatYen(monthly * 12)} / 年</div>
      </div>
    </div>
  )
}

function PersonCard({ person }: { person: PersonResult }) {
  const socialInsuranceTotal =
    person.healthInsurance + person.nursingCareInsurance + person.pension + person.employmentInsurance
  const taxTotal = person.monthlyIncomeTax + person.monthlyResidentTax
  const deductionTotal = socialInsuranceTotal + taxTotal
  const takeHomeRate = person.monthlyGross > 0 ? Math.round((person.monthlyTakeHome / person.monthlyGross) * 100) : 0
  const breakdown = [
    { label: "健康保険", monthly: person.healthInsurance, accent: "hsl(200, 50%, 45%)" },
    { label: "介護保険", monthly: person.nursingCareInsurance, accent: "hsl(180, 40%, 45%)" },
    { label: "厚生年金", monthly: person.pension, accent: "hsl(30, 60%, 55%)" },
    { label: "雇用保険", monthly: person.employmentInsurance, accent: "hsl(340, 50%, 55%)" },
    { label: "所得税", monthly: person.monthlyIncomeTax, accent: "hsl(260, 40%, 55%)" },
    { label: "住民税", monthly: person.monthlyResidentTax, accent: "hsl(20, 10%, 35%)" },
  ].filter((item) => item.monthly > 0 || item.label !== "介護保険")

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/35 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {person.isSocialDependent === undefined
                ? "給与と控除の概算"
                : `社会保険扶養: ${person.isSocialDependent ? "対象" : "対象外"}`}
            </p>
          </div>
          <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            手取り率 {Number.isFinite(takeHomeRate) ? takeHomeRate : 0}%
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <WalletCards className="h-4 w-4" />
              手取り
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
              {formatYen(person.monthlyTakeHome)}
            </div>
            <div className="mt-1 text-xs tabular-nums text-emerald-700">
              年間 {formatYen(person.monthlyTakeHome * 12)}
            </div>
          </div>
          <AmountPair monthly={person.monthlyGross} label="額面給与" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <AmountPair monthly={socialInsuranceTotal} label="社会保険合計" />
          <AmountPair monthly={taxTotal} label="税金合計" />
          <AmountPair monthly={deductionTotal} label="控除合計" />
        </div>

        <div className="rounded-lg border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 px-2 text-sm font-semibold text-foreground">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            控除内訳
          </div>
          <div className="grid gap-1">
            {breakdown.map((item) => (
              <BreakdownRow key={item.label} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AppendixResult({ result }: { result: CalculationResult }) {
  const items = [
    { label: "所得控除", value: result.advanced.incomeTaxDeduction },
    { label: "住民税所得控除", value: result.advanced.residentTaxDeduction },
    { label: "住宅ローン控除", value: result.advanced.mortgageCreditPotential },
    { label: "所得税軽減", value: result.advanced.totalIncomeTaxReduction },
    { label: "住民税軽減", value: result.advanced.totalResidentTaxReduction },
    { label: "児童手当（月額）", value: result.advanced.childAllowanceMonthly },
  ]
  const detailItems = [
    { label: "扶養控除", value: result.advanced.dependentIncomeTaxDeduction },
    { label: "医療費控除", value: result.advanced.medicalDeduction },
    { label: "生命保険料控除", value: result.advanced.lifeInsuranceIncomeTaxDeduction },
    { label: "ふるさと納税控除", value: result.advanced.hometownDonationIncomeTaxReduction + result.advanced.hometownDonationResidentTaxBasicCredit + result.advanced.hometownDonationResidentTaxSpecialCredit },
    { label: "住宅ローン所得税分", value: result.advanced.mortgageIncomeTaxCredit },
    { label: "住宅ローン住民税分", value: result.advanced.mortgageResidentTaxCredit },
    { label: "控除による月額影響", value: result.advanced.totalMonthlyTakeHomeIncrease },
    { label: "児童手当（年間）", value: result.advanced.childAllowanceAnnual },
    { label: "実質可処分額（月額）", value: result.householdMonthlyTakeHome + result.advanced.childAllowanceMonthly },
  ]

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Appendix 追加控除</h3>
        <span className="text-xs text-muted-foreground">夫側に適用</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-background px-3 py-2">
            <div className="text-[11px] text-muted-foreground">{item.label}</div>
            <div className="mt-1 text-sm font-semibold tabular-nums text-foreground">{formatYen(item.value)}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-1 rounded-lg bg-muted/30 p-2">
        {detailItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 px-1 text-xs">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium tabular-nums text-foreground">{formatYen(item.value)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function SalaryResult({ result }: SalaryResultProps) {
  const husband: PersonResult = {
    name: "夫",
    monthlyGross: result.monthlySalary,
    monthlyTakeHome: result.monthlyTakeHome,
    healthInsurance: result.healthInsurance,
    nursingCareInsurance: result.nursingCareInsurance,
    pension: result.pension,
    employmentInsurance: result.employmentInsurance,
    monthlyIncomeTax: result.monthlyIncomeTax,
    monthlyResidentTax: result.monthlyResidentTax,
  }
  const wife: PersonResult = {
    name: "妻",
    monthlyGross: result.spouseMonthlySalary,
    monthlyTakeHome: result.spouseMonthlyTakeHome,
    healthInsurance: result.spouseHealthInsurance,
    nursingCareInsurance: result.spouseNursingCareInsurance,
    pension: result.spousePension,
    employmentInsurance: result.spouseEmploymentInsurance,
    monthlyIncomeTax: result.spouseMonthlyIncomeTax,
    monthlyResidentTax: result.spouseMonthlyResidentTax,
    isSocialDependent: result.spouseIsSocialDependent,
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">計算結果</h2>
            <p className="mt-1 text-xs text-muted-foreground">{result.prefectureName}の健康保険料率で概算</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg bg-background px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <WalletCards className="h-3.5 w-3.5" />
                世帯手取り
              </div>
              <div className="mt-1 text-sm font-semibold tabular-nums">{formatYen(result.householdMonthlyTakeHome)}</div>
            </div>
            <div className="rounded-lg bg-background px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Banknote className="h-3.5 w-3.5" />
                世帯年収
              </div>
              <div className="mt-1 text-sm font-semibold tabular-nums">{formatYen(result.householdAnnualIncome)}</div>
            </div>
            <div className="rounded-lg bg-background px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                配偶者控除
              </div>
              <div className="mt-1 text-sm font-semibold tabular-nums">{formatYen(result.spouseSpecialDeductionIncomeTax)}</div>
            </div>
            <div className="rounded-lg bg-background px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ReceiptText className="h-3.5 w-3.5" />
                住民税控除
              </div>
              <div className="mt-1 text-sm font-semibold tabular-nums">{formatYen(result.spouseSpecialDeductionResidentTax)}</div>
            </div>
          </div>
        </div>
      </section>

      <PersonCard person={husband} />
      <PersonCard person={wife} />
      <AppendixResult result={result} />
    </div>
  )
}
