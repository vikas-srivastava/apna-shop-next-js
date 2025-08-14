'use client';

import './globals.css'
import { ReactNode } from 'react'
import AuthProvider from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <CartProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}