import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoreFront - Premium E-commerce Experience',
  description: 'Discover quality products at unbeatable prices. Fast shipping, excellent customer service, and a seamless shopping experience.',
  keywords: 'ecommerce, shopping, products, online store, retail',
  authors: [{ name: 'StoreFront Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://storefront.example.com',
    title: 'StoreFront - Premium E-commerce Experience',
    description: 'Discover quality products at unbeatable prices.',
    siteName: 'StoreFront',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StoreFront - Premium E-commerce Experience',
    description: 'Discover quality products at unbeatable prices.',
  },
}

/**
 * Root layout component
 * Provides theme and cart context to entire application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              <Header />

              {/* Main Content */}
              <main className="flex-1">
                {children}
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}