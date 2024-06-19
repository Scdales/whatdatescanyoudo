import { ReactNode, Suspense } from 'react'
import { Inter } from 'next/font/google'

import Loading from '@/lib/components/Loading/Loading'
import { metadata as metadataUtil } from '@/lib/utils/fe/metadata'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = metadataUtil

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  )
}
