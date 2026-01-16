'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: 'recruiter' | 'candidate') => Promise<void>;
    signup: (name: string, email: string, password: string, role: 'recruiter' | 'candidate') => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                parsed.createdAt = new Date(parsed.createdAt);
                setUser(parsed);
            } catch {
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = async (email: string, _password: string, role: 'recruiter' | 'candidate') => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            role,
            createdAt: new Date(),
        };

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    const signup = async (name: string, email: string, _password: string, role: 'recruiter' | 'candidate') => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: Date.now().toString(),
            email,
            name,
            role,
            createdAt: new Date(),
        };

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
