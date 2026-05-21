/**
 * 給与手取り計算ロジック（世帯対応）
 */

export const PREFECTURES: { code: string; name: string; rate: number }[] = [
  { code: "01", name: "北海道", rate: 10.31 },
  { code: "02", name: "青森県", rate: 9.85 },
  { code: "03", name: "岩手県", rate: 9.62 },
  { code: "04", name: "宮城県", rate: 10.11 },
  { code: "05", name: "秋田県", rate: 10.01 },
  { code: "06", name: "山形県", rate: 9.75 },
  { code: "07", name: "福島県", rate: 9.62 },
  { code: "08", name: "茨城県", rate: 9.67 },
  { code: "09", name: "栃木県", rate: 9.82 },
  { code: "10", name: "群馬県", rate: 9.77 },
  { code: "11", name: "埼玉県", rate: 9.76 },
  { code: "12", name: "千葉県", rate: 9.79 },
  { code: "13", name: "東京都", rate: 9.91 },
  { code: "14", name: "神奈川県", rate: 9.92 },
  { code: "15", name: "新潟県", rate: 9.55 },
  { code: "16", name: "富山県", rate: 9.65 },
  { code: "17", name: "石川県", rate: 9.88 },
  { code: "18", name: "福井県", rate: 9.94 },
  { code: "19", name: "山梨県", rate: 9.89 },
  { code: "20", name: "長野県", rate: 9.69 },
  { code: "21", name: "岐阜県", rate: 9.93 },
  { code: "22", name: "静岡県", rate: 9.8 },
  { code: "23", name: "愛知県", rate: 10.03 },
  { code: "24", name: "三重県", rate: 9.99 },
  { code: "25", name: "滋賀県", rate: 9.97 },
  { code: "26", name: "京都府", rate: 10.03 },
  { code: "27", name: "大阪府", rate: 10.24 },
  { code: "28", name: "兵庫県", rate: 10.16 },
  { code: "29", name: "奈良県", rate: 10.02 },
  { code: "30", name: "和歌山県", rate: 10.19 },
  { code: "31", name: "鳥取県", rate: 9.93 },
  { code: "32", name: "島根県", rate: 9.94 },
  { code: "33", name: "岡山県", rate: 10.17 },
  { code: "34", name: "広島県", rate: 9.97 },
  { code: "35", name: "山口県", rate: 10.36 },
  { code: "36", name: "徳島県", rate: 10.47 },
  { code: "37", name: "香川県", rate: 10.21 },
  { code: "38", name: "愛媛県", rate: 10.18 },
  { code: "39", name: "高知県", rate: 10.13 },
  { code: "40", name: "福岡県", rate: 10.31 },
  { code: "41", name: "佐賀県", rate: 10.78 },
  { code: "42", name: "長崎県", rate: 10.41 },
  { code: "43", name: "熊本県", rate: 10.12 },
  { code: "44", name: "大分県", rate: 10.25 },
  { code: "45", name: "宮崎県", rate: 10.09 },
  { code: "46", name: "鹿児島県", rate: 10.31 },
  { code: "47", name: "沖縄県", rate: 9.44 },
]

const PENSION_RATE = 0.183 / 2
const NURSING_CARE_RATE = 0.0159 / 2
const EMPLOYMENT_INSURANCE_RATE = 0.0055

function calcSalaryDeduction(annualIncome: number): number {
  if (annualIncome <= 1_900_000) return 650_000
  if (annualIncome <= 3_600_000) return annualIncome * 0.3 + 80_000
  if (annualIncome <= 6_600_000) return annualIncome * 0.2 + 440_000
  if (annualIncome <= 8_500_000) return annualIncome * 0.1 + 1_100_000
  return 1_950_000
}

function calcIncomeTax(taxableIncome: number): number {
  const ti = Math.floor(taxableIncome / 1000) * 1000
  if (ti <= 0) return 0
  if (ti <= 1_949_000) return ti * 0.05
  if (ti <= 3_299_000) return ti * 0.10 - 97_500
  if (ti <= 6_949_000) return ti * 0.20 - 427_500
  if (ti <= 8_999_000) return ti * 0.23 - 636_000
  if (ti <= 17_999_000) return ti * 0.33 - 1_536_000
  if (ti <= 39_999_000) return ti * 0.40 - 2_796_000
  return ti * 0.45 - 4_796_000
}

function getBasicDeductionIncomeTax(totalIncome: number): number {
  if (totalIncome <= 1_320_000) return 950_000
  if (totalIncome <= 6_550_000) return 580_000
  if (totalIncome <= 24_000_000) return 480_000
  if (totalIncome <= 24_500_000) return 320_000
  if (totalIncome <= 25_000_000) return 160_000
  return 0
}

function getBasicDeductionResidentTax(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 430_000
  if (totalIncome <= 24_500_000) return 290_000
  if (totalIncome <= 25_000_000) return 150_000
  return 0
}

function calcSpouseSpecialDeductionIncomeTax(taxpayerIncome: number, spouseIncome: number): number {
  if (taxpayerIncome > 10_000_000 || spouseIncome <= 580_000 || spouseIncome > 1_330_000) return 0
  const caps = [950_000, 900_000, 850_000]
  const incomeLimit = caps.find((c) => taxpayerIncome <= c)
  if (!incomeLimit) return 0
  const table: [number, number][] = [[950000,380000],[1000000,360000],[1050000,310000],[1100000,260000],[1150000,210000],[1200000,160000],[1250000,110000],[1300000,60000],[1330000,30000]]
  const base = table.find(([max]) => spouseIncome <= max)?.[1] ?? 0
  if (incomeLimit === 950_000) return base
  if (incomeLimit === 900_000) return Math.floor((base * 2) / 3)
  return Math.floor(base / 3)
}

function calcSpouseSpecialDeductionResidentTax(taxpayerIncome: number, spouseIncome: number): number {
  if (taxpayerIncome > 10_000_000 || spouseIncome <= 580_000 || spouseIncome > 1_330_000) return 0
  let scale = 0
  if (taxpayerIncome <= 9_000_000) scale = 1
  else if (taxpayerIncome <= 9_500_000) scale = 2 / 3
  else if (taxpayerIncome <= 10_000_000) scale = 1 / 3
  const table: [number, number][] = [[950000,330000],[1000000,310000],[1050000,260000],[1100000,210000],[1150000,160000],[1200000,110000],[1250000,60000],[1300000,30000],[1330000,0]]
  return Math.floor((table.find(([max]) => spouseIncome <= max)?.[1] ?? 0) * scale)
}

function isSocialDependentSpouse(spouseAnnualIncome: number, spouseInLargeCompany: boolean): boolean {
  const exceeds106 = spouseInLargeCompany && spouseAnnualIncome >= 1_060_000
  if (exceeds106) return false
  return spouseAnnualIncome < 1_300_000
}

function calcPerson(monthlySalary: number, healthRate: number, isNursingCare: boolean, hasSocialInsurance: boolean, extraDeductionIT = 0, extraDeductionRT = 0) {
  const healthInsurance = hasSocialInsurance ? Math.round(monthlySalary * healthRate) : 0
  const nursingCareInsurance = hasSocialInsurance && isNursingCare ? Math.round(monthlySalary * NURSING_CARE_RATE) : 0
  const pension = hasSocialInsurance ? Math.round(monthlySalary * PENSION_RATE) : 0
  const employmentInsurance = hasSocialInsurance ? Math.round(monthlySalary * EMPLOYMENT_INSURANCE_RATE) : 0
  const totalSocialInsurance = healthInsurance + nursingCareInsurance + pension + employmentInsurance

  const annualIncome = monthlySalary * 12
  const salaryDeduction = calcSalaryDeduction(annualIncome)
  const salaryIncome = Math.max(0, annualIncome - salaryDeduction)
  const socialInsuranceDeductionAnnual = totalSocialInsurance * 12

  const taxableIncomeIT = Math.max(0, salaryIncome - socialInsuranceDeductionAnnual - getBasicDeductionIncomeTax(salaryIncome) - extraDeductionIT)
  const annualIncomeTax = Math.floor(calcIncomeTax(taxableIncomeIT))
  const annualReconstructionTax = Math.floor(annualIncomeTax * 0.021)
  const monthlyIncomeTax = Math.round((annualIncomeTax + annualReconstructionTax) / 12)

  const taxableIncomeRT = Math.max(0, salaryIncome - socialInsuranceDeductionAnnual - getBasicDeductionResidentTax(salaryIncome) - extraDeductionRT)
  const annualResidentTax = Math.max(0, Math.floor(taxableIncomeRT * 0.1) - 2_500 + 5_500)
  const monthlyResidentTax = Math.round(annualResidentTax / 12)

  const monthlyTakeHome = monthlySalary - totalSocialInsurance - monthlyIncomeTax - monthlyResidentTax

  return { annualIncome, salaryIncome, healthInsurance, nursingCareInsurance, pension, employmentInsurance, totalSocialInsurance, monthlyIncomeTax, monthlyResidentTax, monthlyTakeHome }
}

export interface CalculationResult {
  monthlySalary: number
  annualIncome: number
  prefectureName: string
  healthInsurance: number
  nursingCareInsurance: number
  pension: number
  employmentInsurance: number
  totalSocialInsurance: number
  monthlyIncomeTax: number
  monthlyResidentTax: number
  totalMonthlyDeduction: number
  monthlyTakeHome: number
  spouseMonthlySalary: number
  spouseAnnualIncome: number
  spouseMonthlyTakeHome: number
  spouseIsSocialDependent: boolean
  spouseSpecialDeductionIncomeTax: number
  spouseSpecialDeductionResidentTax: number
  householdMonthlyTakeHome: number
}

export function calculateSalary(monthlySalary: number, prefectureCode: string, isNursingCare: boolean, spouseMonthlySalary = 0, isMarried = false, spouseInLargeCompany = true): CalculationResult {
  const prefecture = PREFECTURES.find((p) => p.code === prefectureCode) ?? PREFECTURES[12]
  const healthRate = prefecture.rate / 100 / 2

  const spouseAnnualIncome = spouseMonthlySalary * 12
  const spouseSalaryIncome = Math.max(0, spouseAnnualIncome - calcSalaryDeduction(spouseAnnualIncome))
  const husbandPreview = calcPerson(monthlySalary, healthRate, isNursingCare, true)

  const spouseSpecialDeductionIncomeTax = isMarried ? calcSpouseSpecialDeductionIncomeTax(husbandPreview.salaryIncome, spouseSalaryIncome) : 0
  const spouseSpecialDeductionResidentTax = isMarried ? calcSpouseSpecialDeductionResidentTax(husbandPreview.salaryIncome, spouseSalaryIncome) : 0

  const husband = calcPerson(monthlySalary, healthRate, isNursingCare, true, spouseSpecialDeductionIncomeTax, spouseSpecialDeductionResidentTax)
  const spouseIsSocialDependent = isMarried ? isSocialDependentSpouse(spouseAnnualIncome, spouseInLargeCompany) : false
  const wife = calcPerson(spouseMonthlySalary, healthRate, false, !spouseIsSocialDependent)

  return {
    monthlySalary,
    annualIncome: husband.annualIncome,
    prefectureName: prefecture.name,
    healthInsurance: husband.healthInsurance,
    nursingCareInsurance: husband.nursingCareInsurance,
    pension: husband.pension,
    employmentInsurance: husband.employmentInsurance,
    totalSocialInsurance: husband.totalSocialInsurance,
    monthlyIncomeTax: husband.monthlyIncomeTax,
    monthlyResidentTax: husband.monthlyResidentTax,
    totalMonthlyDeduction: monthlySalary - husband.monthlyTakeHome,
    monthlyTakeHome: husband.monthlyTakeHome,
    spouseMonthlySalary,
    spouseAnnualIncome,
    spouseMonthlyTakeHome: wife.monthlyTakeHome,
    spouseIsSocialDependent,
    spouseSpecialDeductionIncomeTax,
    spouseSpecialDeductionResidentTax,
    householdMonthlyTakeHome: husband.monthlyTakeHome + wife.monthlyTakeHome,
  }
}
