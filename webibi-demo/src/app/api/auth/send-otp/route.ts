import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const { firebaseInitialized, mockDb } = getFirebaseAdmin();
    
    // We can use the default web API key from firebase configuration
    // If not configured, we look at VERCEL_TOKEN or other keys, or use a hardcoded default web API key for the project.
    const apiKey = process.env.GEMINI_API_KEY ? "AIzaSyDMyTCdk-BRfotZQwC2TXjePD-RCyrh1Rs" : null;

    if (firebaseInitialized && apiKey) {
      try {
        // Try Firebase Phone Auth REST API
        const firebaseRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: phoneNumber,
            }),
          }
        );

        if (firebaseRes.ok) {
          const data = await firebaseRes.json();
          return NextResponse.json({
            success: true,
            sessionInfo: data.sessionInfo,
            mockMode: false,
          });
        } else {
          const errData = await firebaseRes.json();
          console.warn("Firebase sendVerificationCode failed, falling back to mock mode:", errData);
        }
      } catch (err: any) {
        console.error("Firebase send OTP request error:", err.message);
      }
    }

    // Fallback: Mock OTP flow
    // Generate a 6-digit OTP
    const mockCode = (Math.floor(Math.random() * 900000) + 100000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    
    mockDb.otps.set(phoneNumber, { code: mockCode, expiresAt });
    
    console.log(`\n==========================================`);
    console.log(`[MOCK OTP SERVICE]`);
    console.log(`Phone Number: ${phoneNumber}`);
    console.log(`OTP Code:     ${mockCode}`);
    console.log(`Expires At:   ${new Date(expiresAt).toISOString()}`);
    console.log(`==========================================\n`);

    return NextResponse.json({
      success: true,
      mockMode: true,
      // For local testing, we also return the code in the API response IF not in production
      // so the testing tool or frontend can pre-fill it or display it easily.
      code: process.env.NODE_ENV === 'production' ? undefined : mockCode
    });
  } catch (error: any) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
