"use client"

import { useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { CalculationResult } from "@/lib/salary-calculator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface DeductionChartProps {
  result: CalculationResult
}

function formatYen(amount: number): string {
  return `¥${Math.round(amount).toLocaleString()}`
}

const COLORS = [
  "hsl(150, 45%, 40%)", // accent green - take home
  "hsl(200, 50%, 45%)", // blue - health
  "hsl(30, 60%, 55%)",  // orange - pension
  "hsl(340, 50%, 55%)", // pink - employment
  "hsl(260, 40%, 55%)", // purple - income tax
  "hsl(20, 10%, 35%)",  // brown - resident tax
  "hsl(180, 40%, 45%)", // teal - nursing care
]

export function DeductionChart({ result }: DeductionChartProps) {
  const [view, setView] = useState<"husband" | "wife" | "household">("household")

  const filteredData = useMemo(() => {
    const husbandData = [
      { name: "手取り", value: result.monthlyTakeHome },
      { name: "健康保険", value: result.healthInsurance },
      { name: "厚生年金", value: result.pension },
      { name: "雇用保険", value: result.employmentInsurance },
      { name: "所得税", value: result.monthlyIncomeTax },
      { name: "住民税", value: result.monthlyResidentTax },
    ]
    if (result.nursingCareInsurance > 0) {
      husbandData.splice(2, 0, { name: "介護保険", value: result.nursingCareInsurance })
    }

    const wifeData = [
      { name: "手取り", value: result.spouseMonthlyTakeHome },
      { name: result.spouseWorkType === "freelance" ? "国民健康保険" : "健康保険", value: result.spouseHealthInsurance },
      { name: result.spouseWorkType === "freelance" ? "国民年金" : "厚生年金", value: result.spousePension },
      { name: "雇用保険", value: result.spouseEmploymentInsurance },
      { name: "所得税", value: result.spouseMonthlyIncomeTax },
      { name: "住民税", value: result.spouseMonthlyResidentTax },
    ]
    if (result.spouseNursingCareInsurance > 0) {
      wifeData.splice(2, 0, { name: "介護保険", value: result.spouseNursingCareInsurance })
    }

    if (view === "husband") return husbandData.filter((d) => d.value > 0)
    if (view === "wife") return wifeData.filter((d) => d.value > 0)

    const householdData = [
      { name: "手取り", value: result.householdMonthlyTakeHome },
      { name: "健康保険", value: result.healthInsurance + result.spouseHealthInsurance },
      { name: "年金", value: result.pension + result.spousePension },
      { name: "雇用保険", value: result.employmentInsurance + result.spouseEmploymentInsurance },
      { name: "所得税", value: result.monthlyIncomeTax + result.spouseMonthlyIncomeTax },
      { name: "住民税", value: result.monthlyResidentTax + result.spouseMonthlyResidentTax },
      { name: "介護保険", value: result.nursingCareInsurance + result.spouseNursingCareInsurance },
    ]
    return householdData.filter((d) => d.value > 0)
  }, [result, view])

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground text-center">
        {"給与内訳"}
      </h3>
      <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as "husband" | "wife" | "household")}>
        <ToggleGroupItem value="husband">夫</ToggleGroupItem>
        <ToggleGroupItem value="wife">妻</ToggleGroupItem>
        <ToggleGroupItem value="household">世帯</ToggleGroupItem>
      </ToggleGroup>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {filteredData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatYen(value)}
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(30, 10%, 86%)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 px-2">
        {filteredData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            <span className="text-xs font-medium tabular-nums text-foreground ml-auto">
              {formatYen(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
