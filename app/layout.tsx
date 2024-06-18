import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode, Suspense } from 'react'
import Loading from '@/lib/components/Loading/Loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WDCYD',
  description: 'What dates can you do?',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/icon-dark.png',
        href: '/icon-dark.png'
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/icon-light.png',
        href: '/icon-light.png'
      }
    ]
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  )
}
