'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the unified login page
        router.replace('/login');
    }, [router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)'
        }}>
            <p style={{ color: 'var(--text-secondary)' }}>Redirecting to login...</p>
        </div>
    );
}
