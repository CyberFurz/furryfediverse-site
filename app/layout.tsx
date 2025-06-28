import '../styles/globals.css'
import '../styles/css/all.min.css'
import type { Metadata } from 'next'
import ThemeLayout from '../components/ThemeLayout'

export const metadata: Metadata = {
  title: 'The Furry Fediverse',
  description: 'A collection of furry instances on the Fediverse',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeLayout>{children}</ThemeLayout>
      </body>
    </html>
  )
} 