import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'

import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: '給与手取り計算シミュレーター',
  description:
    '月額給与から社会保険料（健康保険・厚生年金・雇用保険）、所得税、住民税を自動計算し、手取り額をシミュレーションできます。令和7年度対応。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
