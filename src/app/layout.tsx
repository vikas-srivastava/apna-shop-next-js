'use client';

import './globals.css'
import { ReactNode } from 'react'
import AuthProvider from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { DiscountBanner } from '@/components/molecules/DiscountOffers'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <CartProvider>
              <AuthProvider>
                <DiscountBanner />
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </AuthProvider>
            </CartProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}