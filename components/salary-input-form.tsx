"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PREFECTURES } from "@/lib/salary-calculator"

interface SalaryInputFormProps {
  onCalculate: (salary: number, prefecture: string, isNursingCare: boolean) => void
}

export function SalaryInputForm({ onCalculate }: SalaryInputFormProps) {
  const [salary, setSalary] = useState("")
  const [prefecture, setPrefecture] = useState("13") // 東京都
  const [isNursingCare, setIsNursingCare] = useState(false)
  const quickFillAmounts = [
    ...Array.from({ length: 10 }, (_, i) => (i + 1) * 100000),
    2000000,
    4000000,
    6000000,
    8000000,
    10000000,
  ]

  const formatNumber = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    if (!num) return ""
    return Number(num).toLocaleString()
  }

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    setSalary(raw)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numSalary = Number(salary)
    if (numSalary > 0) {
      onCalculate(numSalary, prefecture, isNursingCare)
    }
  }

  const handleQuickFill = (amount: number) => {
    setSalary(String(amount))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="salary" className="text-sm font-medium text-foreground">
          月額給与（額面）
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {"¥"}
          </span>
          <Input
            id="salary"
            type="text"
            inputMode="numeric"
            value={salary ? formatNumber(salary) : ""}
            onChange={handleSalaryChange}
            placeholder="300,000"
            className="pl-8 pr-3 text-lg h-12 bg-card border-border"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {quickFillAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleQuickFill(amt)}
              className="px-3 py-1 text-xs rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              {(amt / 10000).toFixed(0)}{"万円"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="prefecture" className="text-sm font-medium text-foreground">
          都道府県（健康保険料率に影響）
        </Label>
        <Select value={prefecture} onValueChange={setPrefecture}>
          <SelectTrigger id="prefecture" className="h-12 bg-card border-border">
            <SelectValue placeholder="都道府県を選択" />
          </SelectTrigger>
          <SelectContent>
            {PREFECTURES.map((pref) => (
              <SelectItem key={pref.code} value={pref.code}>
                {pref.name}（{pref.rate}{"％"}）
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="nursing-care" className="text-sm font-medium text-foreground cursor-pointer">
            介護保険料を含める
          </Label>
          <span className="text-xs text-muted-foreground">
            {"40歳〜64歳の方が対象（保険料率: 1.59%）"}
          </span>
        </div>
        <Switch
          id="nursing-care"
          checked={isNursingCare}
          onCheckedChange={setIsNursingCare}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!salary || Number(salary) <= 0}
      >
        <Calculator className="mr-2 h-5 w-5" />
        計算する
      </Button>
    </form>
  )
}
