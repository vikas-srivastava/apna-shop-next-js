import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { Card } from '@/components/ui/Card'
import dynamic from 'next/dynamic'
import { getCategories, getFeaturedProducts } from '@/lib/api'
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon, Gift, Zap, Trophy } from 'lucide-react'
import { CompactThemeSwitcher } from '@/components/molecules/ThemeSwitcher'

// Lazy load FeaturedProducts for better code splitting
const FeaturedProducts = dynamic(() => import('@/components/organisms/ProductGrid').then(mod => ({ default: mod.FeaturedProducts })), {
  loading: () => <div className="text-center py-8">Loading featured products...</div>
})

/**
 * Homepage component with hero section, featured products, and categories
 */
export default async function HomePage() {
  // Fetch data at build time for better performance
  const [categoriesResponse, featuredResponse] = await Promise.all([
    getCategories(),
    getFeaturedProducts(6)
  ])

  const categories = categoriesResponse.success ? categoriesResponse.data : []
  const featuredProducts = featuredResponse.success ? featuredResponse.data : []

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $99'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer service'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Top-quality products or money back'
    }
  ]

  const scrollingMessages = [
    "🎉 FREE SHIPPING on orders over $99",
    "⚡ Flash Sale: Up to 50% OFF selected items",
    "🎁 New arrivals every week",
    "🏆 Rated #1 Customer Service 2024",
    "💝 Special discounts for newsletter subscribers"
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50))' }}>
        <div className="container-theme py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Typography
                  variant="h1"
                  className="text-4xl lg:text-6xl font-bold leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Discover Your
                  <span className="text-primary-600"> Perfect</span>
                  <br />
                  Shopping Experience
                </Typography>
                <Typography
                  variant="body"
                  className="text-xl max-w-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  From the latest electronics to timeless fashion, find everything
                  you need with unbeatable prices and lightning-fast delivery.
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/categories">
                    Browse Categories
                  </Link>
                </Button>
                <CompactThemeSwitcher />
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <Typography variant="h4" weight="bold" className="text-primary-600">
                    50K+
                  </Typography>
                  <Typography variant="caption" className="text-secondary">
                    Happy Customers
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4" weight="bold" className="text-primary-600">
                    10K+
                  </Typography>
                  <Typography variant="caption" className="text-secondary">
                    Products
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4" weight="bold" className="text-primary-600">
                    4.9★
                  </Typography>
                  <Typography variant="caption" className="text-secondary">
                    Average Rating
                  </Typography>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-slide-in">
              <div className="relative aspect-square max-w-lg mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                  alt="Shopping Experience"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />

                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 p-4 rounded-xl shadow-lg animate-bounce-subtle bg-white">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning-400 fill-current" />
                    <Typography variant="caption" weight="semibold">
                      4.9 Rating
                    </Typography>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 p-4 rounded-xl shadow-lg animate-bounce-subtle bg-primary-500 text-white">
                  <Typography variant="caption" weight="semibold">
                    Free Shipping!
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shiny Banner Section 1 - After Hero */}
      <section className="relative overflow-hidden">
        <div className="py-8 bg-gradient-to-r from-warning-400 via-warning-300 to-warning-400">
          <div className="container-theme">
            <div className="flex items-center justify-center gap-6 text-center">
              <Zap className="w-8 h-8 animate-pulse text-warning-800" />
              <div>
                <Typography
                  variant="h3"
                  weight="bold"
                  className="mb-2 text-warning-900"
                >
                  ⚡ MEGA FLASH SALE ⚡
                </Typography>
                <Typography
                  variant="body"
                  className="text-warning-800"
                >
                  Up to 70% OFF on Electronics | Limited Time Only!
                </Typography>
              </div>
              <Button variant="primary" asChild>
                <Link href="/products?category=electronics">
                  Shop Sale
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-theme" style={{ backgroundColor: 'var(--color-secondary-50)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="text-center animate-fade-in">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <Typography variant="subtitle" weight="semibold" className="mb-2">
                  {feature.title}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {feature.description}
                </Typography>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="container-theme space-y-8" style={{ backgroundColor: 'var(--color-secondary-50)' }}>
          <div className="text-center space-y-4">
            <Typography variant="h2" weight="bold">
              Shop by Category
            </Typography>
            <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
              Discover our wide range of categories, each carefully curated
              with the best products for your needs.
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => (
              <Card
                key={category.id}
                hover
                padding="none"
                className="animate-fade-in"
              >
                <Link href={`/products?category=${category.slug}`}>
                  <div className="relative aspect-square overflow-hidden rounded-t-theme-lg">
                    <Image
                      src={category.image || 'https://via.placeholder.com/400x300'}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <Typography variant="subtitle" weight="semibold" className="mb-2">
                      {category.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {category.description}
                    </Typography>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/categories">
                View All Categories
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Shiny Banner Section 2 - Mid Page */}
      <section className="relative overflow-hidden">
        <div className="py-12 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600">
          <div className="container-theme">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
              <div className="text-white">
                <Gift className="w-12 h-12 mx-auto md:mx-0 mb-4 animate-bounce" />
                <Typography variant="h4" weight="bold" className="mb-2 text-white">
                  Exclusive Deals
                </Typography>
                <Typography variant="body" className="opacity-90 text-white">
                  Member-only special offers
                </Typography>
              </div>
              <div className="text-white">
                <Trophy className="w-12 h-12 mx-auto md:mx-0 mb-4 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <Typography variant="h4" weight="bold" className="mb-2 text-white">
                  Premium Quality
                </Typography>
                <Typography variant="body" className="opacity-90 text-white">
                  Award-winning products
                </Typography>
              </div>
              <div className="text-center">
                <Button variant="secondary" className="font-bold px-8 py-3" asChild>
                  <Link href="/account">
                    Join VIP Club
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-slow"></div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container-theme" style={{ backgroundColor: 'var(--color-secondary-50)' }}>
        <FeaturedProducts limit={6} />
        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-accent-500">
        <div className="container-theme py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Typography variant="h3" weight="bold" className="text-white">
              Stay Updated with Our Latest Offers
            </Typography>
            <Typography variant="body" className="text-white">
              Subscribe to our newsletter and be the first to know about
              exclusive deals, new arrivals, and special promotions.
            </Typography>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input flex-1 bg-white text-primary border-secondary-300"
                required
              />
              <Button variant="secondary" size="md" type="submit">
                Subscribe
              </Button>
            </form>

            <Typography variant="caption" className="text-white">
              No spam, unsubscribe anytime. Read our privacy policy.
            </Typography>
          </div>
        </div>
      </section>

      {/* Shiny Banner Section 3 - Before Footer */}
      <section className="relative overflow-hidden">
        <div className="py-10 bg-gradient-to-r from-accent-500 to-accent-600">
          <div className="container-theme text-center">
            <div className="space-y-4">
              <Typography variant="h2" weight="bold" className="text-white">
                🌟 Don't Miss Out! 🌟
              </Typography>
              <Typography variant="h4" className="text-white">
                Last chance to grab amazing deals before they're gone!
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="secondary" className="font-bold px-8 py-3" asChild>
                  <Link href="/products?sale=final">
                    Shop Final Sale
                  </Link>
                </Button>
                <Typography variant="body" className="font-semibold text-white">
                  ⏰ Ends in 24 hours!
                </Typography>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse-shine"></div>
        </div>
      </section>
    </div>
  )
}