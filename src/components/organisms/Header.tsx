'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Typography } from '../atoms/Typography'
import { SearchBar } from '../molecules/SearchBar'
import { CompactThemeSwitcher } from '../molecules/ThemeSwitcher'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    onSearch?: (query: string) => void
}

/**
 * Main header component with navigation, search, and cart
 */
export function Header({ onSearch }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { itemCount } = useCart()
    const router = useRouter()
    const pathname = usePathname()

    const handleSearch = (query: string) => {
        if (onSearch) {
            onSearch(query)
        } else {
            // Navigate to products page with search query
            if (query.trim()) {
                router.push(`/products?search=${encodeURIComponent(query)}`)
            } else {
                router.push('/products')
            }
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-40">
            <div className="container-theme">
                {/* Main Header */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                <Typography variant="h6" className="text-white font-bold">
                                    S
                                </Typography>
                            </div>
                            <Typography variant="h6" weight="bold" className="hidden sm:block">
                                StoreFront
                            </Typography>
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Theme Switcher */}
                        <CompactThemeSwitcher />

                        {/* Wishlist */}
                        <Button variant="ghost" size="sm" className="p-2" asChild>
                            <Link href="/wishlist">
                                <Heart className="w-5 h-5" />
                            </Link>
                        </Button>

                        {/* User Account */}
                        <Button variant="ghost" size="sm" className="p-2" asChild>
                            <Link href="/account">
                                <User className="w-5 h-5" />
                            </Link>
                        </Button>

                        {/* Shopping Cart */}
                        <Button variant="ghost" size="sm" className="p-2 relative" asChild>
                            <Link href="/cart">
                                <ShoppingCart className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden p-2"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center space-x-8 py-4 border-t border-secondary-100">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`font-medium transition-colors ${isActive
                                    ? 'text-primary-600 border-b-2 border-primary-600 pb-4 -mb-4'
                                    : 'text-secondary-700 hover:text-primary-600'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Search Bar - Mobile */}
                <div className="md:hidden py-4 border-t border-secondary-100">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-secondary-200">
                    <div className="container-theme py-4">
                        <nav className="flex flex-col space-y-4">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`font-medium transition-colors ${isActive
                                            ? 'text-primary-600'
                                            : 'text-secondary-700 hover:text-primary-600'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}