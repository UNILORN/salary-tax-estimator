"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEFAULT_ADVANCED_DEDUCTIONS, PREFECTURES, type AdvancedDeductionInputs } from "@/lib/salary-calculator"

interface SalaryInputFormProps {
  onCalculate: (salary: number, prefecture: string, isNursingCare: boolean, spouseSalary: number, isMarried: boolean, spouseInLargeCompany: boolean, advancedDeductions: AdvancedDeductionInputs) => void
}

function normalizeNumber(value: string) {
  return value.replace(/[^0-9]/g, "")
}

function formatNumber(value: string) {
  const num = normalizeNumber(value)
  if (!num) return ""
  return Number(num).toLocaleString()
}

function AdvancedInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs">{label}</Label>
      <Input
        inputMode="numeric"
        value={formatNumber(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export function SalaryInputForm({ onCalculate }: SalaryInputFormProps) {
  const [salary, setSalary] = useState("")
  const [annualSalary, setAnnualSalary] = useState("")
  const [spouseSalary, setSpouseSalary] = useState("")
  const [spouseAnnualSalary, setSpouseAnnualSalary] = useState("")
  const [prefecture, setPrefecture] = useState("13")
  const [isNursingCare, setIsNursingCare] = useState(false)
  const [isMarried, setIsMarried] = useState(true)
  const [spouseInLargeCompany, setSpouseInLargeCompany] = useState(true)
  const [advancedDeductions, setAdvancedDeductions] = useState<Record<keyof AdvancedDeductionInputs, string>>({
    mortgageYearEndBalance: "",
    mortgageBorrowingLimit: String(DEFAULT_ADVANCED_DEDUCTIONS.mortgageBorrowingLimit),
    childUnder3Count: "",
    child3To15Count: "",
    child16To18Count: "",
    dependentGeneralCount: "",
    dependentSpecificCount: "",
    dependentElderlyCount: "",
    dependentElderlyCoResidentCount: "",
    medicalExpenses: "",
    medicalReimbursements: "",
    lifeInsurancePremium: "",
    careMedicalInsurancePremium: "",
    privatePensionPremium: "",
    hometownDonation: "",
  })

  const handleMonthlySalaryChange = (value: string, setMonthlySalary: (value: string) => void, setYearlySalary: (value: string) => void) => {
    const monthlySalary = normalizeNumber(value)
    setMonthlySalary(monthlySalary)
    setYearlySalary(monthlySalary ? String(Number(monthlySalary) * 12) : "")
  }

  const handleAnnualSalaryChange = (value: string, setMonthlySalary: (value: string) => void, setYearlySalary: (value: string) => void) => {
    const yearlySalary = normalizeNumber(value)
    setYearlySalary(yearlySalary)
    setMonthlySalary(yearlySalary ? String(Math.round(Number(yearlySalary) / 12)) : "")
  }

  const setAdvancedDeductionValue = (key: keyof AdvancedDeductionInputs, value: string) => {
    setAdvancedDeductions((current) => ({ ...current, [key]: normalizeNumber(value) }))
  }

  const getAdvancedDeductionValues = (): AdvancedDeductionInputs => ({
    mortgageYearEndBalance: Number(advancedDeductions.mortgageYearEndBalance || 0),
    mortgageBorrowingLimit: Number(advancedDeductions.mortgageBorrowingLimit || 0),
    childUnder3Count: Number(advancedDeductions.childUnder3Count || 0),
    child3To15Count: Number(advancedDeductions.child3To15Count || 0),
    child16To18Count: Number(advancedDeductions.child16To18Count || 0),
    dependentGeneralCount: Number(advancedDeductions.dependentGeneralCount || 0),
    dependentSpecificCount: Number(advancedDeductions.dependentSpecificCount || 0),
    dependentElderlyCount: Number(advancedDeductions.dependentElderlyCount || 0),
    dependentElderlyCoResidentCount: Number(advancedDeductions.dependentElderlyCoResidentCount || 0),
    medicalExpenses: Number(advancedDeductions.medicalExpenses || 0),
    medicalReimbursements: Number(advancedDeductions.medicalReimbursements || 0),
    lifeInsurancePremium: Number(advancedDeductions.lifeInsurancePremium || 0),
    careMedicalInsurancePremium: Number(advancedDeductions.careMedicalInsurancePremium || 0),
    privatePensionPremium: Number(advancedDeductions.privatePensionPremium || 0),
    hometownDonation: Number(advancedDeductions.hometownDonation || 0),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (Number(salary) > 0) {
          onCalculate(Number(salary), prefecture, isNursingCare, Number(spouseSalary || 0), isMarried, spouseInLargeCompany, getAdvancedDeductionValues())
        }
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>夫の月額給与（額面）</Label>
          <Input
            inputMode="numeric"
            value={formatNumber(salary)}
            onChange={(e) => handleMonthlySalaryChange(e.target.value, setSalary, setAnnualSalary)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>夫の年収（額面）</Label>
          <Input
            inputMode="numeric"
            value={formatNumber(annualSalary)}
            onChange={(e) => handleAnnualSalaryChange(e.target.value, setSalary, setAnnualSalary)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>妻の月額給与（額面）</Label>
          <Input
            inputMode="numeric"
            value={formatNumber(spouseSalary)}
            onChange={(e) => handleMonthlySalaryChange(e.target.value, setSpouseSalary, setSpouseAnnualSalary)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>妻の年収（額面）</Label>
          <Input
            inputMode="numeric"
            value={formatNumber(spouseAnnualSalary)}
            onChange={(e) => handleAnnualSalaryChange(e.target.value, setSpouseSalary, setSpouseAnnualSalary)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label>婚姻状態</Label>
        <Switch checked={isMarried} onCheckedChange={setIsMarried} />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label>夫が40〜64歳（介護保険対象）</Label>
        <Switch checked={isNursingCare} onCheckedChange={setIsNursingCare} />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label>妻の勤務先が51人以上</Label>
        <Switch checked={spouseInLargeCompany} onCheckedChange={setSpouseInLargeCompany} />
      </div>

      <Select value={prefecture} onValueChange={setPrefecture}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {PREFECTURES.map((pref) => (
            <SelectItem key={pref.code} value={pref.code}>{pref.name}（{pref.rate}%）</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <details className="rounded-lg border border-dashed border-border bg-muted/20 p-3">
        <summary className="cursor-pointer text-sm font-medium text-foreground">Appendix 詳細控除</summary>
        <div className="mt-4 grid gap-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <AdvancedInput label="住宅ローン年末残高" value={advancedDeductions.mortgageYearEndBalance} onChange={(value) => setAdvancedDeductionValue("mortgageYearEndBalance", value)} />
            <AdvancedInput label="住宅ローン借入限度額" value={advancedDeductions.mortgageBorrowingLimit} onChange={(value) => setAdvancedDeductionValue("mortgageBorrowingLimit", value)} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdvancedInput label="0〜2歳の子" value={advancedDeductions.childUnder3Count} onChange={(value) => setAdvancedDeductionValue("childUnder3Count", value)} />
            <AdvancedInput label="3〜15歳の子" value={advancedDeductions.child3To15Count} onChange={(value) => setAdvancedDeductionValue("child3To15Count", value)} />
            <AdvancedInput label="16〜18歳の子" value={advancedDeductions.child16To18Count} onChange={(value) => setAdvancedDeductionValue("child16To18Count", value)} />
            <AdvancedInput label="一般扶養" value={advancedDeductions.dependentGeneralCount} onChange={(value) => setAdvancedDeductionValue("dependentGeneralCount", value)} />
            <AdvancedInput label="19〜22歳の扶養" value={advancedDeductions.dependentSpecificCount} onChange={(value) => setAdvancedDeductionValue("dependentSpecificCount", value)} />
            <AdvancedInput label="老人扶養" value={advancedDeductions.dependentElderlyCount} onChange={(value) => setAdvancedDeductionValue("dependentElderlyCount", value)} />
            <AdvancedInput label="同居老親等" value={advancedDeductions.dependentElderlyCoResidentCount} onChange={(value) => setAdvancedDeductionValue("dependentElderlyCoResidentCount", value)} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdvancedInput label="年間医療費" value={advancedDeductions.medicalExpenses} onChange={(value) => setAdvancedDeductionValue("medicalExpenses", value)} />
            <AdvancedInput label="医療費の補填額" value={advancedDeductions.medicalReimbursements} onChange={(value) => setAdvancedDeductionValue("medicalReimbursements", value)} />
            <AdvancedInput label="一般生命保険料" value={advancedDeductions.lifeInsurancePremium} onChange={(value) => setAdvancedDeductionValue("lifeInsurancePremium", value)} />
            <AdvancedInput label="介護医療保険料" value={advancedDeductions.careMedicalInsurancePremium} onChange={(value) => setAdvancedDeductionValue("careMedicalInsurancePremium", value)} />
            <AdvancedInput label="個人年金保険料" value={advancedDeductions.privatePensionPremium} onChange={(value) => setAdvancedDeductionValue("privatePensionPremium", value)} />
            <AdvancedInput label="ふるさと納税額" value={advancedDeductions.hometownDonation} onChange={(value) => setAdvancedDeductionValue("hometownDonation", value)} />
          </div>
        </div>
      </details>

      <Button type="submit"><Calculator className="mr-2 h-4 w-4" />計算する</Button>
    </form>
  )
}
