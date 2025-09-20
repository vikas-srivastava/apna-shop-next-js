'use client';

import { LogOut } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useAuthContext } from './AuthProvider';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const { isAuthenticated, logout } = useAuthContext();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
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
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={handleLogout}
            title="Logout"
        >
            <LogOut className="w-4 h-4" />
            Logout
        </Button>
    );
}