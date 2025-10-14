'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';

export default function AuthCallback() {
    // const router = useRouter();

    // useEffect(() => {
    //     async function handleAuth() {
    //         const urlParams = new URLSearchParams(window.location.search);
    //         const code = urlParams.get('code');
    //         const state = urlParams.get('state');

    //         if (!code) {
    //             console.error('No auth code found in the callback');
    //             router.push('/');
    //             return;
    //         }

    //         try {
    //             // Fetch user profile from WorkOS / AuthKit backend
    //             // In a real app, exchange 'code' with WorkOS to get user details
    //             const userEmail = localStorage.getItem('pending_user_email');
    //             let customerId = null;

    //             if (userEmail) {
    //                 // Single upsert call to your backend which talks to the third-party API
    //                 const syncRes = await axios.post('/api/auth/sync-customer', {
    //                     email: userEmail,
    //                     name: userEmail.split('@')[0],
    //                     gender: 'male'
    //                 });
    //                 if (syncRes.data?.success) {
    //                     customerId = syncRes.data.customerId;
    //                 }
    //             }

    //             if (customerId) {
    //                 localStorage.setItem('customer_id', customerId);
    //             }

    //             // Compute post-login redirect target
    //             let redirectTo = '/';
    //             try {
    //                 // Prefer OAuth state 'ru' if present and valid
    //                 const rawState = state || localStorage.getItem('oauth_state') || '';
    //                 if (rawState) {
    //                     try {
    //                         const decoded = JSON.parse(atob(rawState as string));
    //                         const ru = decoded?.ru as string | undefined;
    //                         if (ru) {
    //                             if (ru.startsWith('/')) {
    //                                 redirectTo = ru;
    //                             } else {
    //                                 const url = new URL(ru, window.location.origin);
    //                                 if (url.origin === window.location.origin) {
    //                                     redirectTo = `${url.pathname}${url.search}`;
    //                                 }
    //                             }
    //                         }
    //                     } catch {
    //                         // ignore malformed state
    //                     }
    //                 }

    //                 // Fallback to stored post_login_redirect
    //                 if (redirectTo === '/') {
    //                     const stored = localStorage.getItem('post_login_redirect');
    //                     if (stored) {
    //                         redirectTo = stored;
    //                         localStorage.removeItem('post_login_redirect');
    //                     }
    //                 }

    //                 // Clear temporary items
    //                 localStorage.removeItem('pending_user_email');
    //                 localStorage.removeItem('oauth_state');
    //             } catch {
    //                 // no-op
    //             }

    //             router.replace(redirectTo);
    //         } catch (err) {
    //             console.error('Auth callback error', err);
    //             router.replace('/');
    //         }
    //     }

    //     handleAuth();
    // }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Auth Callback Page</p>
        </div>
    );
}