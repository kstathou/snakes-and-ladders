import type { Metadata } from 'next'
import { Barlow_Condensed } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  title: 'Dune: The Spice Trail',
  description: 'A Snakes and Ladders game set on Arrakis',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} font-sans`}>{children}</body>
    </html>
  )
}
