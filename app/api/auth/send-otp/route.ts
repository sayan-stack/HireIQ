import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOTP, storeOTP } from '@/lib/otpStore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Generate and store OTP
        const otp = generateOTP();
        storeOTP(email, otp, 5); // 5 minutes expiry

        if (!process.env.RESEND_API_KEY) {
            console.log(`\n📧 [Fallback] OTP for ${email}: ${otp}\n`);
            return NextResponse.json({
                success: true,
                message: 'Verification code generated! (Dev Mode - Check Console)',
                devMode: true,
                devOtp: otp
            });
        }

        try {
            console.log('Attempting to send email via Resend to:', email);
            
            const htmlContent = `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #14b8a6; font-size: 32px; margin: 0; font-weight: 700;">HireIQ</h1>
                        <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">AI-Powered Interview Platform</p>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; text-align: center;">
                        <h2 style="color: #e2e8f0; font-size: 20px; margin: 0 0 16px 0;">Your Verification Code</h2>
                        
                        <div style="background: linear-gradient(135deg, #14b8a6, #6366f1); color: white; font-size: 40px; font-weight: 700; letter-spacing: 16px; padding: 20px 30px; border-radius: 12px; display: inline-block; margin: 16px 0;">
                            ${otp}
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                            This code will expire in <span style="color: #14b8a6; font-weight: 600;">5 minutes</span>
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                </div>
            `;

            const data = await resend.emails.send({
                from: 'HireIQ <onboarding@resend.dev>',
                to: email,
                subject: '🔐 Your HireIQ Verification Code',
                html: htmlContent,
                text: `Your HireIQ verification code is: ${otp}. This code expires in 5 minutes.`
            });

            if (data.error) {
                throw new Error(data.error.message);
            }

            console.log('✅ Email sent successfully:', data.data?.id);

            return NextResponse.json({
                success: true,
                message: 'Verification code sent to your email!'
            });

        } catch (emailError: unknown) {
            const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown error';
            console.error('❌ Email send error:', errorMessage);

            return NextResponse.json({
                success: true, 
                message: `Verification code generated! (Resend Error: ${errorMessage})`,
                devMode: true,
                devOtp: otp
            });
        }

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
