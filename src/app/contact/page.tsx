'use client'

import { useState } from 'react'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Card } from '@/components/ui/Card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError('')
        setSubmitSuccess(false)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            })

            setSubmitSuccess(true)
        } catch (error) {
            setSubmitError('Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Our Location',
            content: '123 Commerce Street, Suite 100, City, State 12345'
        },
        {
            icon: Phone,
            title: 'Phone Number',
            content: '+1 (555) 123-4567'
        },
        {
            icon: Mail,
            title: 'Email Address',
            content: 'support@storefront.com'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            content: 'Monday-Friday: 9AM - 6PM, Saturday: 10AM - 4PM'
        }
    ]

    return (
        <div className="container-theme py-8 space-y-16">
            {/* Page Header */}
            <section className="text-center">
                <Typography variant="h1" weight="bold" className="mb-4">
                    Contact Us
                </Typography>
                <Typography variant="body" color="secondary" className="max-w-2xl mx-auto">
                    Have questions or feedback? We'd love to hear from you. Reach out to us through any of the channels below.
                </Typography>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <section>
                    <Typography variant="h2" weight="bold" className="mb-6">
                        Get In Touch
                    </Typography>

                    <div className="space-y-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon
                            return (
                                <Card key={index} className="flex items-start gap-4 p-6">
                                    <div className="p-3 bg-primary-100 rounded-full">
                                        <Icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <Typography variant="subtitle" weight="bold" className="mb-1">
                                            {info.title}
                                        </Typography>
                                        <Typography variant="body">
                                            {info.content}
                                        </Typography>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Map Placeholder */}
                    <div className="mt-12">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            Our Location
                        </Typography>
                        <div className="bg-secondary-100 rounded-theme-lg h-64 flex items-center justify-center">
                            <Typography variant="body" color="secondary">
                                Map placeholder
                            </Typography>
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section>
                    <Typography variant="h2" weight="bold" className="mb-6">
                        Send Us a Message
                    </Typography>

                    <Card className="p-6">
                        {submitSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <Typography variant="h4" weight="bold" className="mb-2">
                                    Message Sent!
                                </Typography>
                                <Typography variant="body" color="secondary" className="mb-6">
                                    Thank you for contacting us. We'll get back to you as soon as possible.
                                </Typography>
                                <Button onClick={() => setSubmitSuccess(false)}>
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {submitError && (
                                    <div className="p-3 bg-error-50 text-error-700 rounded-theme-md">
                                        {submitError}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                                        Name
                                    </label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-1">
                                        Subject
                                    </label>
                                    <Input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange as any}
                                        required
                                        rows={5}
                                        className="input w-full"
                                    />
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        className="w-full"
                                    >
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>
                </section>
            </div>
        </div>
    )
}
