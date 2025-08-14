'use client';

import { getSignInUrl, getSignUpUrl, signOut } from '@workos-inc/authkit-nextjs';
import { useEffect, useState } from 'react';

export function AuthButton() {
    const [origin, setOrigin] = useState('');
    const [stateParam, setStateParam] = useState('');
    const [isLocal, setIsLocal] = useState(false);

    useEffect(() => {
        // Set the origin only on the client side and precompute OAuth state
        const o = window.location.origin;
        setOrigin(o);

        // Detect local development to enable quick login fallback
        try {
            const hn = window.location.hostname;
            setIsLocal(hn === 'localhost' || hn === '127.0.0.1' || hn === '::1');
        } catch {
            setIsLocal(false);
        }

        try {
            const ru = localStorage.getItem('post_login_redirect') || `${window.location.pathname}${window.location.search}`;
            const tenant = process.env.NEXT_PUBLIC_TENANT_ID || '';
            const st = btoa(JSON.stringify({ ru, t: tenant, ts: Date.now() }));
            localStorage.setItem('oauth_state', st);
            setStateParam(st);
        } catch {
            // best-effort
        }
    }, []);

    const handleLogin = async () => {
        const email = prompt('Enter your email for login / signup');
        if (email) {
            try {
                // Store email in localStorage for callback processing
                try {
                    localStorage.setItem('pending_user_email', email);
                } catch { }
                const url = await getSignInUrl({
                    loginHint: email,
                    // @ts-ignore - SDK may accept these options
                    state: stateParam
                });
                window.location.href = url;
            } catch (e: any) {
                const msg = e?.message || 'Unknown AuthKit error';
                alert(`AuthKit login error: ${msg}
- Ensure AuthKit Redirect URI exactly matches: ${origin}/auth/callback
- Verify NEXT_PUBLIC_WORKOS_CLIENT_ID is valid
Falling back to Dev Login (local only) if enabled.`);
                if (isLocal || process.env.NEXT_PUBLIC_DEV_AUTH === 'true') {
                    await handleDevLogin();
                }
            }
        }
    };

    const handleRegister = async () => {
        const email = prompt('Enter your email to register');
        if (email) {
            try {
                // Store email in localStorage for callback processing
                try {
                    localStorage.setItem('pending_user_email', email);
                } catch { }
                const url = await getSignUpUrl({
                    loginHint: email,
                    // @ts-ignore - SDK may accept these options
                    state: stateParam
                });
                window.location.href = url;
            } catch (e: any) {
                const msg = e?.message || 'Unknown AuthKit error';
                alert(`AuthKit signup error: ${msg}
- Ensure AuthKit Redirect URI exactly matches: ${origin}/auth/callback
- Verify NEXT_PUBLIC_WORKOS_CLIENT_ID is valid
Falling back to Dev Login (local only) if enabled.`);
                if (isLocal || process.env.NEXT_PUBLIC_DEV_AUTH === 'true') {
                    await handleDevLogin();
                }
            }
        }
    };

    const handleDevLogin = async () => {
        try {
            const storedRU = typeof window !== 'undefined' ? localStorage.getItem('post_login_redirect') : null;
            const email = prompt('Enter email for Dev Login', 'demo@local.test') || 'demo@local.test';
            const res = await fetch('/api/auth/sync-customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name: email.split('@')[0], gender: 'male' })
            });
            const data = await res.json();
            if (data?.success && data?.customerId) {
                localStorage.setItem('customer_id', data.customerId);
                window.location.href = storedRU || '/';
            } else {
                alert('Dev login failed: ' + (data?.error || 'Unknown error'));
            }
        } catch (e: any) {
            alert('Dev login exception: ' + (e?.message || 'Unknown'));
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Magic Link Authentication */}
            <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Magic Link Login
            </button>
            <button
                onClick={handleRegister}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Magic Link Register
            </button>

            {/* Optional: Dev quick login for local development */}
            {(isLocal || process.env.NEXT_PUBLIC_DEV_AUTH === 'true') && (
                <button
                    onClick={handleDevLogin}
                    className="px-4 py-2 bg-amber-600 text-white rounded"
                >
                    Dev Login (local only)
                </button>
            )}

            {/* Logout */}
            <button
                onClick={() => {
                    try {
                        signOut();
                    } finally {
                        try {
                            localStorage.removeItem('customer_id');
                            localStorage.removeItem('pending_user_email');
                            localStorage.removeItem('post_login_redirect');
                            localStorage.removeItem('pending_add_to_cart');
                            localStorage.removeItem('oauth_state');
                        } catch { }
                    }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
            >
                Logout
            </button>
        </div>
    );
}