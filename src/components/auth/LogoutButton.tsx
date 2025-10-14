'use client';

import { LogOut } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useSupabaseAuth } from './SupabaseAuthProvider';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const { isAuthenticated, signOut } = useSupabaseAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            // Clear any additional tokens if needed
            localStorage.removeItem('auth_token');
            sessionStorage.clear();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even on error, redirect to login
            router.push('/login');
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={handleLogout}
            title="Logout"
        >
            <LogOut className="w-4 h-4" />
        </Button>
    );
}