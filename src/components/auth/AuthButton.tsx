'use client';

import { useState } from 'react';
import { useSupabaseAuth } from './SupabaseAuthProvider';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import Link from 'next/link';

export function AuthButton() {
    const { signIn, signUp, signOut, isAuthenticated, loading, error } = useSupabaseAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsSubmitting(true);
        try {
            if (isLoginMode) {
                await signIn(email, password);
            } else {
                await signUp(email, password, { full_name: fullName });
            }
        } catch (error) {
            console.error('Auth error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isAuthenticated) {
        return (
            <div className="text-center">
                <Typography variant="body" className="mb-4">
                    Welcome back! You are logged in.
                </Typography>
                <Button onClick={handleLogout} variant="outline">
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Typography variant="h3" weight="bold" className="mb-2">
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                </Typography>
                <Typography variant="body" color="secondary">
                    {isLoginMode
                        ? 'Welcome back! Please sign in to your account.'
                        : 'Join us today! Create your account to get started.'
                    }
                </Typography>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            required={!isLoginMode}
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <Typography variant="caption" color="error">
                            {error.message}
                        </Typography>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    loading={loading || isSubmitting}
                    disabled={!email || !password || (isSubmitting)}
                >
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                </Button>
            </form>

            <div className="text-center space-y-2">
                {isLoginMode && (
                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm underline block">
                        Forgot your password?
                    </Link>
                )}
                <button
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                    {isLoginMode
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"
                    }
                </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
                <Typography variant="caption" color="secondary">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                    </a>
                </Typography>
            </div>
        </div>
    );
}