/**
 * 給与手取り計算ロジック
 *
 * 根拠：
 * - 健康保険料率: 協会けんぽ 令和7年度 都道府県別保険料率
 *   https://www.kyoukaikenpo.or.jp/g7/cat330/sb3130/r07/250214/
 * - 厚生年金保険料率: 18.3%（平成29年9月以降固定）
 *   https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/ryogakuhyo/index.html
 * - 雇用保険料率: 令和7年度 一般の事業 労働者負担 5.5/1000
 *   https://www.mhlw.go.jp/content/001401966.pdf
 * - 所得税率: 国税庁 No.2260 所得税の税率
 *   https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
 * - 給与所得控除: 国税庁 No.1410 令和7年分以降
 *   https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
 * - 住民税: 所得割10%（市民税6%+都道府県民税4%）＋均等割5,000円
 */

// ──────────────────────────────────────────────
// 都道府県別 健康保険料率（令和7年度 協会けんぽ）
// ──────────────────────────────────────────────
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
  { code: "22", name: "静岡県", rate: 9.80 },
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

// ──────────────────────────────────────────────
// 標準報酬月額テーブル（健康保険: 1〜50等級）
// ──────────────────────────────────────────────
interface GradeEntry {
  grade: number
  standardMonthly: number
  lowerBound: number
  upperBound: number
}

// 健康保険の標準報酬月額等級（1等級: 58,000円 〜 50等級: 1,390,000円）
const HEALTH_INSURANCE_GRADES: GradeEntry[] = [
  { grade: 1, standardMonthly: 58000, lowerBound: 0, upperBound: 63000 },
  { grade: 2, standardMonthly: 68000, lowerBound: 63000, upperBound: 73000 },
  { grade: 3, standardMonthly: 78000, lowerBound: 73000, upperBound: 83000 },
  { grade: 4, standardMonthly: 88000, lowerBound: 83000, upperBound: 93000 },
  { grade: 5, standardMonthly: 98000, lowerBound: 93000, upperBound: 101000 },
  { grade: 6, standardMonthly: 104000, lowerBound: 101000, upperBound: 107000 },
  { grade: 7, standardMonthly: 110000, lowerBound: 107000, upperBound: 114000 },
  { grade: 8, standardMonthly: 118000, lowerBound: 114000, upperBound: 122000 },
  { grade: 9, standardMonthly: 126000, lowerBound: 122000, upperBound: 130000 },
  { grade: 10, standardMonthly: 134000, lowerBound: 130000, upperBound: 138000 },
  { grade: 11, standardMonthly: 142000, lowerBound: 138000, upperBound: 146000 },
  { grade: 12, standardMonthly: 150000, lowerBound: 146000, upperBound: 155000 },
  { grade: 13, standardMonthly: 160000, lowerBound: 155000, upperBound: 165000 },
  { grade: 14, standardMonthly: 170000, lowerBound: 165000, upperBound: 175000 },
  { grade: 15, standardMonthly: 180000, lowerBound: 175000, upperBound: 185000 },
  { grade: 16, standardMonthly: 190000, lowerBound: 185000, upperBound: 195000 },
  { grade: 17, standardMonthly: 200000, lowerBound: 195000, upperBound: 210000 },
  { grade: 18, standardMonthly: 220000, lowerBound: 210000, upperBound: 230000 },
  { grade: 19, standardMonthly: 240000, lowerBound: 230000, upperBound: 250000 },
  { grade: 20, standardMonthly: 260000, lowerBound: 250000, upperBound: 270000 },
  { grade: 21, standardMonthly: 280000, lowerBound: 270000, upperBound: 290000 },
  { grade: 22, standardMonthly: 300000, lowerBound: 290000, upperBound: 310000 },
  { grade: 23, standardMonthly: 320000, lowerBound: 310000, upperBound: 330000 },
  { grade: 24, standardMonthly: 340000, lowerBound: 330000, upperBound: 350000 },
  { grade: 25, standardMonthly: 360000, lowerBound: 350000, upperBound: 370000 },
  { grade: 26, standardMonthly: 380000, lowerBound: 370000, upperBound: 395000 },
  { grade: 27, standardMonthly: 410000, lowerBound: 395000, upperBound: 425000 },
  { grade: 28, standardMonthly: 440000, lowerBound: 425000, upperBound: 455000 },
  { grade: 29, standardMonthly: 470000, lowerBound: 455000, upperBound: 485000 },
  { grade: 30, standardMonthly: 500000, lowerBound: 485000, upperBound: 515000 },
  { grade: 31, standardMonthly: 530000, lowerBound: 515000, upperBound: 545000 },
  { grade: 32, standardMonthly: 560000, lowerBound: 545000, upperBound: 575000 },
  { grade: 33, standardMonthly: 590000, lowerBound: 575000, upperBound: 605000 },
  { grade: 34, standardMonthly: 620000, lowerBound: 605000, upperBound: 635000 },
  { grade: 35, standardMonthly: 650000, lowerBound: 635000, upperBound: 665000 },
  { grade: 36, standardMonthly: 680000, lowerBound: 665000, upperBound: 695000 },
  { grade: 37, standardMonthly: 710000, lowerBound: 695000, upperBound: 730000 },
  { grade: 38, standardMonthly: 750000, lowerBound: 730000, upperBound: 770000 },
  { grade: 39, standardMonthly: 790000, lowerBound: 770000, upperBound: 810000 },
  { grade: 40, standardMonthly: 830000, lowerBound: 810000, upperBound: 855000 },
  { grade: 41, standardMonthly: 880000, lowerBound: 855000, upperBound: 905000 },
  { grade: 42, standardMonthly: 930000, lowerBound: 905000, upperBound: 955000 },
  { grade: 43, standardMonthly: 980000, lowerBound: 955000, upperBound: 1005000 },
  { grade: 44, standardMonthly: 1030000, lowerBound: 1005000, upperBound: 1055000 },
  { grade: 45, standardMonthly: 1090000, lowerBound: 1055000, upperBound: 1115000 },
  { grade: 46, standardMonthly: 1150000, lowerBound: 1115000, upperBound: 1175000 },
  { grade: 47, standardMonthly: 1210000, lowerBound: 1175000, upperBound: 1235000 },
  { grade: 48, standardMonthly: 1270000, lowerBound: 1235000, upperBound: 1295000 },
  { grade: 49, standardMonthly: 1330000, lowerBound: 1295000, upperBound: 1355000 },
  { grade: 50, standardMonthly: 1390000, lowerBound: 1355000, upperBound: Infinity },
]

// 厚生年金の標準報酬月額は1等級(88,000)〜32等級(650,000)
const PENSION_MIN = 88000
const PENSION_MAX = 650000

/**
 * 標準報酬月額を算出（健康保険用）
 */
function getHealthInsuranceStandardMonthly(monthlySalary: number): number {
  const entry = HEALTH_INSURANCE_GRADES.find(
    (g) => monthlySalary >= g.lowerBound && monthlySalary < g.upperBound
  )
  return entry ? entry.standardMonthly : HEALTH_INSURANCE_GRADES[HEALTH_INSURANCE_GRADES.length - 1].standardMonthly
}

/**
 * 標準報酬月額を算出（厚生年金用）
 * 厚生年金は88,000〜650,000の範囲
 */
function getPensionStandardMonthly(monthlySalary: number): number {
  // 健康保険の等級テーブルから取得し、厚生年金の範囲にクランプ
  const healthStd = getHealthInsuranceStandardMonthly(monthlySalary)
  if (healthStd < PENSION_MIN) return PENSION_MIN
  if (healthStd > PENSION_MAX) return PENSION_MAX
  return healthStd
}

// ──────────────────────────────────────────────
// 保険料率
// ──────────────────────────────────────────────
/** 厚生年金保険料率（平成29年9月〜固定）：18.3%（労使折半で9.15%） */
const PENSION_RATE = 0.183 / 2

/** 介護保険料率（令和7年度）：1.59%（労使折半で0.795%） */
const NURSING_CARE_RATE = 0.0159 / 2

/** 雇用保険料率（令和7年度 一般の事業 労働者負担）：5.5/1000 */
const EMPLOYMENT_INSURANCE_RATE = 0.0055

// ──────────────────────────────────────────────
// 給与所得控除（令和7年分以降）
// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
// ──────────────────────────────────────────────
function calcSalaryDeduction(annualIncome: number): number {
  if (annualIncome <= 1_900_000) return 650_000
  if (annualIncome <= 3_600_000) return annualIncome * 0.3 + 80_000
  if (annualIncome <= 6_600_000) return annualIncome * 0.2 + 440_000
  if (annualIncome <= 8_500_000) return annualIncome * 0.1 + 1_100_000
  return 1_950_000
}

// ──────────────────────────────────────────────
// 所得税の速算表（平成27年分以後）
// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
// ──────────────────────────────────────────────
function calcIncomeTax(taxableIncome: number): number {
  // 1,000円未満切り捨て
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

// ──────────────────────────────────────────────
// 基礎控除（令和7年分 所得税）
// 合計所得金額に応じて変動
// https://www.nta.go.jp/users/gensen/2025kiso/index.htm
// ──────────────────────────────────────────────
function getBasicDeductionIncomeTax(totalIncome: number): number {
  if (totalIncome <= 1_320_000) return 950_000 // 特別上乗せ含む（令和7・8年限定）
  if (totalIncome <= 6_550_000) return 580_000
  if (totalIncome <= 23_500_000) return 480_000
  if (totalIncome <= 24_000_000) return 480_000
  if (totalIncome <= 24_500_000) return 320_000
  if (totalIncome <= 25_000_000) return 160_000
  return 0
}

/**
 * 住民税の基礎控除（令和7年度）
 * 住民税は前年の所得に基づくが、ここでは同年の年収で概算
 */
function getBasicDeductionResidentTax(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 430_000
  if (totalIncome <= 24_500_000) return 290_000
  if (totalIncome <= 25_000_000) return 150_000
  return 0
}

// ──────────────────────────────────────────────
// 計算結果の型定義
// ──────────────────────────────────────────────
export interface CalculationResult {
  // 入力
  monthlySalary: number
  annualIncome: number
  prefectureName: string

  // 標準報酬月額
  healthInsuranceStandardMonthly: number
  pensionStandardMonthly: number

  // 社会保険料（月額）
  healthInsurance: number
  nursingCareInsurance: number
  pension: number
  employmentInsurance: number
  totalSocialInsurance: number

  // 所得控除等（年額）
  salaryDeduction: number
  salaryIncome: number
  basicDeductionIncomeTax: number
  socialInsuranceDeductionAnnual: number

  // 所得税（年額 → 月額概算）
  taxableIncomeForIncomeTax: number
  annualIncomeTax: number
  annualReconstructionTax: number
  monthlyIncomeTax: number

  // 住民税（年額 → 月額概算）
  basicDeductionResidentTax: number
  taxableIncomeForResidentTax: number
  annualResidentTax: number
  monthlyResidentTax: number

  // 合計控除 & 手取り（月額）
  totalMonthlyDeduction: number
  monthlyTakeHome: number
}

export function calculateSalary(
  monthlySalary: number,
  prefectureCode: string,
  isNursingCare: boolean
): CalculationResult {
  const prefecture = PREFECTURES.find((p) => p.code === prefectureCode) ?? PREFECTURES[12] // default: 東京
  const healthRate = prefecture.rate / 100 / 2 // 労使折半

  // 標準報酬月額
  const healthStd = getHealthInsuranceStandardMonthly(monthlySalary)
  const pensionStd = getPensionStandardMonthly(monthlySalary)

  // 社会保険料（月額）
  const healthInsurance = Math.round(healthStd * healthRate)
  const nursingCareInsurance = isNursingCare
    ? Math.round(healthStd * NURSING_CARE_RATE)
    : 0
  const pension = Math.round(pensionStd * PENSION_RATE)
  const employmentInsurance = Math.round(monthlySalary * EMPLOYMENT_INSURANCE_RATE)
  const totalSocialInsurance =
    healthInsurance + nursingCareInsurance + pension + employmentInsurance

  // 年収
  const annualIncome = monthlySalary * 12

  // 給与所得控除
  const salaryDeduction = calcSalaryDeduction(annualIncome)
  const salaryIncome = Math.max(0, annualIncome - salaryDeduction)

  // 社会保険料控除（年額）
  const socialInsuranceDeductionAnnual = totalSocialInsurance * 12

  // ── 所得税 ──
  const basicDeductionIT = getBasicDeductionIncomeTax(salaryIncome)
  const taxableIncomeIT = Math.max(
    0,
    salaryIncome - socialInsuranceDeductionAnnual - basicDeductionIT
  )
  const annualIncomeTax = Math.floor(calcIncomeTax(taxableIncomeIT))
  // 復興特別所得税（基準所得税額 × 2.1%）令和19年まで
  const annualReconstructionTax = Math.floor(annualIncomeTax * 0.021)
  const totalAnnualIncomeTax = annualIncomeTax + annualReconstructionTax
  const monthlyIncomeTax = Math.round(totalAnnualIncomeTax / 12)

  // ── 住民税 ──
  const basicDeductionRT = getBasicDeductionResidentTax(salaryIncome)
  const taxableIncomeRT = Math.max(
    0,
    salaryIncome - socialInsuranceDeductionAnnual - basicDeductionRT
  )
  // 所得割: 10%（市民税6% + 都道府県民税4%）
  const incomeBasedRT = Math.floor(taxableIncomeRT * 0.10)
  // 調整控除（簡易計算: 基礎控除差額5万円 × 税率で2,500円を控除）
  const adjustmentDeduction = taxableIncomeRT > 0 ? 2_500 : 0
  // 均等割: 市民税3,000円 + 都道府県民税1,500円 + 森林環境税1,000円 = 5,500円
  const flatRT = 5_500
  const annualResidentTax = Math.max(0, incomeBasedRT - adjustmentDeduction + flatRT)
  const monthlyResidentTax = Math.round(annualResidentTax / 12)

  // 合計控除（月額）
  const totalMonthlyDeduction =
    totalSocialInsurance + monthlyIncomeTax + monthlyResidentTax
  const monthlyTakeHome = monthlySalary - totalMonthlyDeduction

  return {
    monthlySalary,
    annualIncome,
    prefectureName: prefecture.name,
    healthInsuranceStandardMonthly: healthStd,
    pensionStandardMonthly: pensionStd,
    healthInsurance,
    nursingCareInsurance,
    pension,
    employmentInsurance,
    totalSocialInsurance,
    salaryDeduction,
    salaryIncome,
    basicDeductionIncomeTax: basicDeductionIT,
    socialInsuranceDeductionAnnual,
    taxableIncomeForIncomeTax: taxableIncomeIT,
    annualIncomeTax: totalAnnualIncomeTax,
    annualReconstructionTax,
    monthlyIncomeTax,
    basicDeductionResidentTax: basicDeductionRT,
    taxableIncomeForResidentTax: taxableIncomeRT,
    annualResidentTax,
    monthlyResidentTax,
    totalMonthlyDeduction,
    monthlyTakeHome,
  }
}
