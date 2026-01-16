'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import { Camera, Eye, EyeOff, Save, X } from 'lucide-react';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    bio: string;
    location: string;
}

export default function AccountPage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [profile, setProfile] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        bio: '',
        location: ''
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('hireiq_user');
        if (userData) {
            const user = JSON.parse(userData);
            setProfile({
                firstName: user.profile?.firstName || user.name?.split(' ')[0] || '',
                lastName: user.profile?.lastName || user.name?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.profile?.phone || '',
                dob: user.profile?.dob || '',
                bio: user.profile?.bio || '',
                location: user.profile?.location || ''
            });
        }
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);

        const userData = localStorage.getItem('hireiq_user');
        if (userData) {
            const user = JSON.parse(userData);
            user.profile = {
                ...user.profile,
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                dob: profile.dob,
                bio: profile.bio,
                location: profile.location
            };
            user.name = `${profile.firstName} ${profile.lastName}`.trim();
            user.email = profile.email;
            localStorage.setItem('hireiq_user', JSON.stringify(user));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            alert('New passwords do not match!');
            return;
        }
        if (passwords.new.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }

        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
        setPasswords({ current: '', new: '', confirm: '' });
        setSuccessMessage('Password changed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Success Message */}
                {successMessage && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600">
                        {successMessage}
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                                {profile.firstName.charAt(0).toUpperCase()}{profile.lastName.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-lg">
                                <Camera size={16} style={{ color: 'var(--text-secondary)' }} />
                            </button>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {profile.firstName} {profile.lastName}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)' }}>{profile.email}</p>
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{profile.location || 'Add your location'}</p>
                        </div>
                        <div className="flex gap-2">
                            {isEditing && (
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    style={{
                                        backgroundColor: 'var(--accent-primary)',
                                        color: 'white'
                                    }}
                                >
                                    <Save size={16} />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            )}
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 rounded-lg transition"
                                style={{
                                    backgroundColor: isEditing ? 'var(--accent-danger)' : 'var(--accent-primary)',
                                    color: 'white'
                                }}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>First Name</label>
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg outline-none transition"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                            opacity: isEditing ? 1 : 0.7
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg outline-none transition"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                            opacity: isEditing ? 1 : 0.7
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Date of Birth</label>
                                <input
                                    type="date"
                                    value={profile.dob}
                                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 rounded-lg outline-none transition"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        opacity: isEditing ? 1 : 0.7
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-2 rounded-lg outline-none transition"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        opacity: isEditing ? 1 : 0.7
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 rounded-lg outline-none transition"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        opacity: isEditing ? 1 : 0.7
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Location</label>
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="City, Country"
                                    className="w-full px-4 py-2 rounded-lg outline-none transition"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        opacity: isEditing ? 1 : 0.7
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    disabled={!isEditing}
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-4 py-2 rounded-lg outline-none transition resize-none"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        opacity: isEditing ? 1 : 0.7
                                    }}
                                />
                            </div>

                            {isEditing && (
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="w-full py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition"
                                    style={{ backgroundColor: 'var(--accent-primary)' }}
                                >
                                    <Save size={18} />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Change Password</h2>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-2 pr-10 rounded-lg outline-none transition"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <button
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-8"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>New Password</label>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 pr-10 rounded-lg outline-none transition"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <button
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-8"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-2 pr-10 rounded-lg outline-none transition"
                                    style={{
                                        backgroundColor: 'var(--bg-input)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <button
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-8"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <button
                                onClick={handleChangePassword}
                                disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
                                className="w-full py-2 rounded-lg text-white font-medium transition disabled:opacity-50"
                                style={{ backgroundColor: 'var(--accent-secondary)' }}
                            >
                                {isSaving ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
