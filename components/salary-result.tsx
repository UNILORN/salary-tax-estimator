"use client"

import type { CalculationResult } from "@/lib/salary-calculator"

interface SalaryResultProps { result: CalculationResult }

function formatYen(amount: number) {
  return `¥${Math.round(amount).toLocaleString()}`
}

export function SalaryResult({ result }: SalaryResultProps) {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-6">
      <h3 className="text-lg font-semibold">計算結果（世帯）</h3>
      <div>夫手取り: {formatYen(result.monthlyTakeHome)}</div>
      <div>妻手取り: {formatYen(result.spouseMonthlyTakeHome)}</div>
      <div className="font-semibold">世帯手取り合計: {formatYen(result.householdMonthlyTakeHome)}</div>
      <div>夫の年収: {formatYen(result.annualIncome)}</div>
      <div>妻の年収: {formatYen(result.spouseAnnualIncome)}</div>
      <div className="font-semibold">世帯年収合計: {formatYen(result.householdAnnualIncome)}</div>
      <div>妻の社会保険扶養: {result.spouseIsSocialDependent ? "対象" : "対象外"}</div>
      <div>配偶者特別控除（所得税）: {formatYen(result.spouseSpecialDeductionIncomeTax)}</div>
      <div>配偶者特別控除（住民税）: {formatYen(result.spouseSpecialDeductionResidentTax)}</div>
    </div>
  )
}
