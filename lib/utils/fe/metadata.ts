import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'wdcyd',
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
  },
  openGraph: {
    title: 'wdcyd',
    description: 'What dates can you do?',
    url: 'https://wdcyd.com',
    siteName: 'wdcyd',
    images: [
      {
        url: 'https://wdcyd.com/logo-cr.webp',
        width: 1024,
        height: 536
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
}
