import { NextRequest, NextResponse } from 'next/server';
import { verifyOTPFirestore } from '@/lib/otpStoreFirestore';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Verify OTP from Firestore (works across serverless calls)
        const result = await verifyOTPFirestore(email, otp);

        if (!result.valid) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
