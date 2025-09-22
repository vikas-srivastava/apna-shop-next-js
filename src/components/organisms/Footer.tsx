import Link from 'next/link'
import { Typography } from '../atoms/Typography'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

/**
 * Footer component with links, newsletter signup, and contact info
 */
export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerSections = [
        {
            title: 'Shop',
            links: [
                { name: 'All Products', href: '/products' },
                { name: 'Electronics', href: '/products?category=electronics' },
                { name: 'Clothing', href: '/products?category=clothing' },
                { name: 'Home & Garden', href: '/products?category=home-garden' },
                { name: 'Sports', href: '/products?category=sports' },
                { name: 'Sale Items', href: '/products?sale=true' },
            ]
        },
        {
            title: 'Customer Service',
            links: [
                { name: 'Help Center', href: '/help' },
                { name: 'Returns & Exchanges', href: '/returns' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Track Your Order', href: '/track-order' },
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers' },
                { name: 'Press', href: '/press' },
                { name: 'Sustainability', href: '/sustainability' },
                { name: 'Affiliate Program', href: '/affiliates' },
                { name: 'Store Locator', href: '/stores' },
            ]
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'Accessibility', href: '/accessibility' },
                { name: 'Do Not Sell My Info', href: '/privacy/do-not-sell' },
            ]
        }
    ]

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/storefront' },
        { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/storefront' },
        { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/storefront' },
        { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/storefront' },
    ]

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="container-theme py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Brand and Newsletter */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Typography variant="h6" className="text-white font-bold">
                                    S
                                </Typography>
                            </div>
                            <Typography variant="h6" weight="bold" className="text-white">
                                StoreFront
                            </Typography>
                        </div>

                        {/* Description */}
                        <Typography variant="body" className="text-gray-300 max-w-md">
                            Your one-stop shop for quality products at unbeatable prices.
                            We're committed to providing exceptional customer service and
                            fast, reliable shipping.
                        </Typography>

                        {/* Newsletter Signup */}
                        <div className="space-y-3">
                            <Typography variant="subtitle" weight="semibold" className="text-white">
                                Stay in the loop
                            </Typography>
                            <Typography variant="caption" className="text-gray-300">
                                Subscribe to get special offers, updates, and more.
                            </Typography>
                            <form className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                                />
                                <Button variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section, index) => (
                        <div key={section.title} className="space-y-4">
                            <Typography variant="subtitle" weight="semibold" className="text-white">
                                {section.title}
                            </Typography>
                            <nav className="space-y-2">
                                {section.links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block text-gray-300 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Contact Info */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <div>
                                <Typography variant="caption" className="text-gray-300">
                                    Email us
                                </Typography>
                                <Typography variant="body" className="text-white">
                                    support@storefront.com
                                </Typography>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-blue-400" />
                            <div>
                                <Typography variant="caption" className="text-gray-300">
                                    Call us
                                </Typography>
                                <Typography variant="body" className="text-white">
                                    1-800-STORE-01
                                </Typography>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-blue-400" />
                            <div>
                                <Typography variant="caption" className="text-gray-300">
                                    Visit us
                                </Typography>
                                <Typography variant="body" className="text-white">
                                    123 Commerce St, City, ST 12345
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-950 border-t border-gray-800">
                <div className="container-theme py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <Typography variant="caption" className="text-gray-300">
                            © {currentYear} StoreFront. All rights reserved.
                        </Typography>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                        aria-label={social.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center space-x-2">
                            <Typography variant="caption" className="text-gray-300 mr-2">
                                We accept:
                            </Typography>
                            {/* Payment icons would go here */}
                            <div className="flex space-x-1">
                                {['Visa', 'MC', 'Amex', 'PayPal'].map((payment) => (
                                    <div
                                        key={payment}
                                        className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-200"
                                    >
                                        {payment}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}