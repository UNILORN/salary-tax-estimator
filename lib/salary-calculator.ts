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

export interface AdvancedDeductionInputs {
  mortgageYearEndBalance: number
  mortgageBorrowingLimit: number
  childUnder3Count: number
  child3To15Count: number
  child16To18Count: number
  dependentGeneralCount: number
  dependentSpecificCount: number
  dependentElderlyCount: number
  dependentElderlyCoResidentCount: number
  medicalExpenses: number
  medicalReimbursements: number
  lifeInsurancePremium: number
  careMedicalInsurancePremium: number
  privatePensionPremium: number
  hometownDonation: number
}

export interface AdvancedDeductionResult {
  incomeTaxDeduction: number
  residentTaxDeduction: number
  mortgageCreditPotential: number
  mortgageIncomeTaxCredit: number
  mortgageResidentTaxCredit: number
  dependentIncomeTaxDeduction: number
  dependentResidentTaxDeduction: number
  medicalDeduction: number
  lifeInsuranceIncomeTaxDeduction: number
  lifeInsuranceResidentTaxDeduction: number
  hometownDonationIncomeTaxDeduction: number
  hometownDonationIncomeTaxReduction: number
  hometownDonationResidentTaxBasicCredit: number
  hometownDonationResidentTaxSpecialCredit: number
  totalIncomeTaxReduction: number
  totalResidentTaxReduction: number
  totalMonthlyTakeHomeIncrease: number
  childAllowanceMonthly: number
  childAllowanceAnnual: number
}

export const DEFAULT_ADVANCED_DEDUCTIONS: AdvancedDeductionInputs = {
  mortgageYearEndBalance: 0,
  mortgageBorrowingLimit: 30_000_000,
  childUnder3Count: 0,
  child3To15Count: 0,
  child16To18Count: 0,
  dependentGeneralCount: 0,
  dependentSpecificCount: 0,
  dependentElderlyCount: 0,
  dependentElderlyCoResidentCount: 0,
  medicalExpenses: 0,
  medicalReimbursements: 0,
  lifeInsurancePremium: 0,
  careMedicalInsurancePremium: 0,
  privatePensionPremium: 0,
  hometownDonation: 0,
}

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

function getIncomeTaxRate(taxableIncome: number): number {
  const ti = Math.floor(taxableIncome / 1000) * 1000
  if (ti <= 0) return 0
  if (ti <= 1_949_000) return 0.05
  if (ti <= 3_299_000) return 0.10
  if (ti <= 6_949_000) return 0.20
  if (ti <= 8_999_000) return 0.23
  if (ti <= 17_999_000) return 0.33
  if (ti <= 39_999_000) return 0.40
  return 0.45
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

function calcNewLifeInsuranceDeductionForIncomeTax(premium: number): number {
  if (premium <= 20_000) return premium
  if (premium <= 40_000) return premium * 0.5 + 10_000
  if (premium <= 80_000) return premium * 0.25 + 20_000
  return 40_000
}

function calcNewLifeInsuranceDeductionForResidentTax(premium: number): number {
  if (premium <= 12_000) return premium
  if (premium <= 32_000) return premium * 0.5 + 6_000
  if (premium <= 56_000) return premium * 0.25 + 14_000
  return 28_000
}

function calcAdvancedIncomeDeductions(salaryIncome: number, options: AdvancedDeductionInputs) {
  const dependentIncomeTaxDeduction =
    options.child16To18Count * 380_000 +
    options.dependentGeneralCount * 380_000 +
    options.dependentSpecificCount * 630_000 +
    options.dependentElderlyCount * 480_000 +
    options.dependentElderlyCoResidentCount * 580_000
  const dependentResidentTaxDeduction =
    options.child16To18Count * 330_000 +
    options.dependentGeneralCount * 330_000 +
    options.dependentSpecificCount * 450_000 +
    options.dependentElderlyCount * 380_000 +
    options.dependentElderlyCoResidentCount * 450_000
  const medicalDeductionBase =
    options.medicalExpenses - options.medicalReimbursements - Math.min(100_000, salaryIncome * 0.05)
  const medicalDeduction = Math.min(2_000_000, Math.max(0, medicalDeductionBase))
  const lifeInsuranceIncomeTaxDeduction = Math.min(
    120_000,
    calcNewLifeInsuranceDeductionForIncomeTax(options.lifeInsurancePremium) +
      calcNewLifeInsuranceDeductionForIncomeTax(options.careMedicalInsurancePremium) +
      calcNewLifeInsuranceDeductionForIncomeTax(options.privatePensionPremium),
  )
  const lifeInsuranceResidentTaxDeduction = Math.min(
    70_000,
    calcNewLifeInsuranceDeductionForResidentTax(options.lifeInsurancePremium) +
      calcNewLifeInsuranceDeductionForResidentTax(options.careMedicalInsurancePremium) +
      calcNewLifeInsuranceDeductionForResidentTax(options.privatePensionPremium),
  )
  const hometownDonationIncomeTaxDeduction = Math.max(0, Math.min(options.hometownDonation, salaryIncome * 0.4) - 2_000)

  return {
    dependentIncomeTaxDeduction,
    dependentResidentTaxDeduction,
    medicalDeduction,
    lifeInsuranceIncomeTaxDeduction,
    lifeInsuranceResidentTaxDeduction,
    hometownDonationIncomeTaxDeduction,
    incomeTaxDeduction:
      dependentIncomeTaxDeduction +
      medicalDeduction +
      lifeInsuranceIncomeTaxDeduction +
      hometownDonationIncomeTaxDeduction,
    residentTaxDeduction: dependentResidentTaxDeduction + medicalDeduction + lifeInsuranceResidentTaxDeduction,
  }
}

function calcChildAllowance(options: AdvancedDeductionInputs) {
  let childOrder = options.dependentSpecificCount
  let monthly = 0

  for (let i = 0; i < options.child16To18Count; i += 1) {
    childOrder += 1
    monthly += childOrder >= 3 ? 30_000 : 10_000
  }
  for (let i = 0; i < options.child3To15Count; i += 1) {
    childOrder += 1
    monthly += childOrder >= 3 ? 30_000 : 10_000
  }
  for (let i = 0; i < options.childUnder3Count; i += 1) {
    childOrder += 1
    monthly += childOrder >= 3 ? 30_000 : 15_000
  }

  return {
    childAllowanceMonthly: monthly,
    childAllowanceAnnual: monthly * 12,
  }
}

function calcPerson(monthlySalary: number, healthRate: number, isNursingCare: boolean, hasSocialInsurance: boolean, extraDeductionIT = 0, extraDeductionRT = 0, advancedDeductions: AdvancedDeductionInputs = DEFAULT_ADVANCED_DEDUCTIONS) {
  const healthInsurance = hasSocialInsurance ? Math.round(monthlySalary * healthRate) : 0
  const nursingCareInsurance = hasSocialInsurance && isNursingCare ? Math.round(monthlySalary * NURSING_CARE_RATE) : 0
  const pension = hasSocialInsurance ? Math.round(monthlySalary * PENSION_RATE) : 0
  const employmentInsurance = hasSocialInsurance ? Math.round(monthlySalary * EMPLOYMENT_INSURANCE_RATE) : 0
  const totalSocialInsurance = healthInsurance + nursingCareInsurance + pension + employmentInsurance

  const annualIncome = monthlySalary * 12
  const salaryDeduction = calcSalaryDeduction(annualIncome)
  const salaryIncome = Math.max(0, annualIncome - salaryDeduction)
  const socialInsuranceDeductionAnnual = totalSocialInsurance * 12
  const additionalDeductions = calcAdvancedIncomeDeductions(salaryIncome, advancedDeductions)

  const taxableIncomeITBeforeAdvanced = Math.max(0, salaryIncome - socialInsuranceDeductionAnnual - getBasicDeductionIncomeTax(salaryIncome) - extraDeductionIT)
  const annualIncomeTaxBeforeAdvanced = Math.floor(calcIncomeTax(taxableIncomeITBeforeAdvanced))
  const annualReconstructionTaxBeforeAdvanced = Math.floor(annualIncomeTaxBeforeAdvanced * 0.021)
  const annualIncomeTaxBeforeAdvancedTotal = annualIncomeTaxBeforeAdvanced + annualReconstructionTaxBeforeAdvanced
  const taxableIncomeIT = Math.max(0, taxableIncomeITBeforeAdvanced - additionalDeductions.incomeTaxDeduction)
  const annualIncomeTaxBeforeCredits = Math.floor(calcIncomeTax(taxableIncomeIT))
  const annualReconstructionTax = Math.floor(annualIncomeTaxBeforeCredits * 0.021)
  const annualIncomeTaxBeforeCreditsTotal = annualIncomeTaxBeforeCredits + annualReconstructionTax

  const taxableIncomeRTBeforeAdvanced = Math.max(0, salaryIncome - socialInsuranceDeductionAnnual - getBasicDeductionResidentTax(salaryIncome) - extraDeductionRT)
  const annualResidentTaxBeforeAdvanced = Math.max(0, Math.floor(taxableIncomeRTBeforeAdvanced * 0.1) - 2_500 + 5_500)
  const taxableIncomeRT = Math.max(0, taxableIncomeRTBeforeAdvanced - additionalDeductions.residentTaxDeduction)
  const annualResidentTaxBeforeCredits = Math.max(0, Math.floor(taxableIncomeRT * 0.1) - 2_500 + 5_500)

  const mortgageCreditPotential = Math.floor(Math.min(advancedDeductions.mortgageYearEndBalance, advancedDeductions.mortgageBorrowingLimit) * 0.007)
  const mortgageIncomeTaxCredit = Math.min(annualIncomeTaxBeforeCreditsTotal, mortgageCreditPotential)
  const mortgageResidentTaxCreditLimit = Math.min(Math.floor(taxableIncomeIT * 0.05), 97_500)
  const mortgageResidentTaxCredit = Math.min(
    annualResidentTaxBeforeCredits,
    mortgageResidentTaxCreditLimit,
    Math.max(0, mortgageCreditPotential - mortgageIncomeTaxCredit),
  )
  const incomeTaxRateForDonation = getIncomeTaxRate(taxableIncomeIT)
  const hometownDonationResidentTaxBase = Math.max(0, Math.min(advancedDeductions.hometownDonation, salaryIncome * 0.3) - 2_000)
  const hometownDonationResidentTaxBasicCredit = Math.floor(hometownDonationResidentTaxBase * 0.1)
  const hometownDonationResidentTaxSpecialCredit = Math.min(
    Math.floor(annualResidentTaxBeforeCredits * 0.2),
    Math.max(0, Math.floor(hometownDonationResidentTaxBase * (0.9 - incomeTaxRateForDonation * 1.021))),
  )
  const annualIncomeTax = Math.max(0, annualIncomeTaxBeforeCreditsTotal - mortgageIncomeTaxCredit)
  const annualResidentTax = Math.max(
    0,
    annualResidentTaxBeforeCredits -
      mortgageResidentTaxCredit -
      hometownDonationResidentTaxBasicCredit -
      hometownDonationResidentTaxSpecialCredit,
  )
  const monthlyIncomeTax = Math.round(annualIncomeTax / 12)
  const monthlyResidentTax = Math.round(annualResidentTax / 12)

  const monthlyTakeHome = monthlySalary - totalSocialInsurance - monthlyIncomeTax - monthlyResidentTax
  const childAllowance = calcChildAllowance(advancedDeductions)
  const advanced: AdvancedDeductionResult = {
    ...additionalDeductions,
    ...childAllowance,
    mortgageCreditPotential,
    mortgageIncomeTaxCredit,
    mortgageResidentTaxCredit,
    hometownDonationIncomeTaxReduction: Math.min(
      annualIncomeTaxBeforeAdvancedTotal,
      Math.floor(additionalDeductions.hometownDonationIncomeTaxDeduction * incomeTaxRateForDonation * 1.021),
    ),
    hometownDonationResidentTaxBasicCredit,
    hometownDonationResidentTaxSpecialCredit,
    totalIncomeTaxReduction: Math.max(0, annualIncomeTaxBeforeAdvancedTotal - annualIncomeTax),
    totalResidentTaxReduction: Math.max(0, annualResidentTaxBeforeAdvanced - annualResidentTax),
    totalMonthlyTakeHomeIncrease: Math.round(((annualIncomeTaxBeforeAdvancedTotal - annualIncomeTax) + (annualResidentTaxBeforeAdvanced - annualResidentTax)) / 12),
  }

  return { annualIncome, salaryIncome, healthInsurance, nursingCareInsurance, pension, employmentInsurance, totalSocialInsurance, monthlyIncomeTax, monthlyResidentTax, monthlyTakeHome, advanced }
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
  spouseHealthInsurance: number
  spouseNursingCareInsurance: number
  spousePension: number
  spouseEmploymentInsurance: number
  spouseMonthlyIncomeTax: number
  spouseMonthlyResidentTax: number
  spouseTotalMonthlyDeduction: number
  spouseMonthlyTakeHome: number
  spouseIsSocialDependent: boolean
  spouseSpecialDeductionIncomeTax: number
  spouseSpecialDeductionResidentTax: number
  householdAnnualIncome: number
  householdMonthlyTakeHome: number
  advanced: AdvancedDeductionResult
}

export function calculateSalary(monthlySalary: number, prefectureCode: string, isNursingCare: boolean, spouseMonthlySalary = 0, isMarried = false, spouseInLargeCompany = true, advancedDeductions: AdvancedDeductionInputs = DEFAULT_ADVANCED_DEDUCTIONS): CalculationResult {
  const prefecture = PREFECTURES.find((p) => p.code === prefectureCode) ?? PREFECTURES[12]
  const healthRate = prefecture.rate / 100 / 2

  const spouseAnnualIncome = spouseMonthlySalary * 12
  const spouseSalaryIncome = Math.max(0, spouseAnnualIncome - calcSalaryDeduction(spouseAnnualIncome))
  const husbandPreview = calcPerson(monthlySalary, healthRate, isNursingCare, true)

  const spouseSpecialDeductionIncomeTax = isMarried ? calcSpouseSpecialDeductionIncomeTax(husbandPreview.salaryIncome, spouseSalaryIncome) : 0
  const spouseSpecialDeductionResidentTax = isMarried ? calcSpouseSpecialDeductionResidentTax(husbandPreview.salaryIncome, spouseSalaryIncome) : 0

  const husband = calcPerson(monthlySalary, healthRate, isNursingCare, true, spouseSpecialDeductionIncomeTax, spouseSpecialDeductionResidentTax, advancedDeductions)
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
    spouseHealthInsurance: wife.healthInsurance,
    spouseNursingCareInsurance: wife.nursingCareInsurance,
    spousePension: wife.pension,
    spouseEmploymentInsurance: wife.employmentInsurance,
    spouseMonthlyIncomeTax: wife.monthlyIncomeTax,
    spouseMonthlyResidentTax: wife.monthlyResidentTax,
    spouseTotalMonthlyDeduction: spouseMonthlySalary - wife.monthlyTakeHome,
    spouseMonthlyTakeHome: wife.monthlyTakeHome,
    spouseIsSocialDependent,
    spouseSpecialDeductionIncomeTax,
    spouseSpecialDeductionResidentTax,
    householdAnnualIncome: husband.annualIncome + wife.annualIncome,
    householdMonthlyTakeHome: husband.monthlyTakeHome + wife.monthlyTakeHome,
    advanced: husband.advanced,
  }
}
