'use client';

import { ReactNode } from 'react'

import { ThemeProvider } from "@/components/providers/theme-provider"
import { ProductProvider } from '@/contexts/ProductContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import SupabaseAuthProvider from '@/components/auth/SupabaseAuthProvider'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { DiscountBanner } from '@/components/molecules/DiscountOffers'
import { ThemeSwitcher } from '@/components/molecules/ThemeSwitcher'


import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>

        <ErrorBoundary>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <SupabaseAuthProvider>
                  <Toaster />
                  <DiscountBanner />
                  <Header />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                  <div className="fixed bottom-4 right-4 z-50">
                    <ThemeSwitcher />
                  </div>
                </SupabaseAuthProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </ErrorBoundary>
      </ThemeProvider >
    </ErrorBoundary >
  )
}
