"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PREFECTURES } from "@/lib/salary-calculator"

interface SalaryInputFormProps {
  onCalculate: (salary: number, prefecture: string, isNursingCare: boolean, spouseSalary: number, isMarried: boolean, spouseInLargeCompany: boolean) => void
}

export function SalaryInputForm({ onCalculate }: SalaryInputFormProps) {
  const [salary, setSalary] = useState("")
  const [spouseSalary, setSpouseSalary] = useState("")
  const [prefecture, setPrefecture] = useState("13")
  const [isNursingCare, setIsNursingCare] = useState(false)
  const [isMarried, setIsMarried] = useState(true)
  const [spouseInLargeCompany, setSpouseInLargeCompany] = useState(true)

  const formatNumber = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    if (!num) return ""
    return Number(num).toLocaleString()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (Number(salary) > 0) {
          onCalculate(Number(salary), prefecture, isNursingCare, Number(spouseSalary || 0), isMarried, spouseInLargeCompany)
        }
      }}
      className="flex flex-col gap-4"
    >
      <Label>夫の月額給与（額面）</Label>
      <Input value={formatNumber(salary)} onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, ""))} />

      <Label>妻の月額給与（額面）</Label>
      <Input value={formatNumber(spouseSalary)} onChange={(e) => setSpouseSalary(e.target.value.replace(/[^0-9]/g, ""))} />

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

      <Button type="submit"><Calculator className="mr-2 h-4 w-4" />計算する</Button>
    </form>
  )
}
