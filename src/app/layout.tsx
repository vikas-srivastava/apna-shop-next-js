import './globals.css'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'StoreFront - Your Online Shopping Destination',
  description: 'Discover amazing products at great prices. Shop electronics, clothing, books, and more.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}