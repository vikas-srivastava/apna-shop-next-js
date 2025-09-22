'use client';

import { ReactNode } from 'react'

import SupabaseAuthProvider from '@/components/auth/SupabaseAuthProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { DiscountBanner } from '@/components/molecules/DiscountOffers'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ErrorBoundary>
          <CartProvider>
            <SupabaseAuthProvider>
              <DiscountBanner />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </SupabaseAuthProvider>
          </CartProvider>
        </ErrorBoundary>
      </ThemeProvider >
    </ErrorBoundary >
  )
}