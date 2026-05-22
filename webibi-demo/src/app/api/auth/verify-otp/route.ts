import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { signToken } from '@/lib/authSession';

export async function POST(req: Request) {
  try {
    const { phoneNumber, code, sessionInfo, mockMode, userJsonUrl } = await req.json();

    let cleanPhone = phoneNumber?.trim() || "";

    if (userJsonUrl) {
      try {
        const fetchRes = await fetch(userJsonUrl);
        const data = await fetchRes.json();
        console.log("[VERIFY-OTP] Fetched from userJsonUrl:", data);
        if (data.user_phone_number) {
          const countryCode = data.user_country_code || '';
          cleanPhone = `${countryCode}${data.user_phone_number}`.trim();
        }
      } catch (e) {
        console.error("Failed to fetch phone.email json:", e);
      }
    }

    console.log("[VERIFY-OTP] Final cleanPhone:", cleanPhone);

    if (!cleanPhone && !code) {
      return NextResponse.json({ error: 'Phone number or code is required' }, { status: 400 });
    }

    const { firebaseInitialized, mockDb } = getFirebaseAdmin();
    const adminPhone = process.env.ADMIN_PHONE || '+16505553434'; // Default admin phone
    console.log("[VERIFY-OTP] AdminPhone from env:", adminPhone);

    let verified = false;

    // 1. Phone.email verification (if userJsonUrl was provided and we got a phone number)
    if (userJsonUrl && cleanPhone) {
      verified = true;
    }

    // 2. Try Firebase Verification if not yet verified and Firebase is active
    const apiKey = process.env.GEMINI_API_KEY ? "AIzaSyDMyTCdk-BRfotZQwC2TXjePD-RCyrh1Rs" : null;
    if (!verified && firebaseInitialized && sessionInfo && apiKey) {
      try {
        const firebaseRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionInfo: sessionInfo,
              code: code,
            }),
          }
        );

        if (firebaseRes.ok) {
          const data = await firebaseRes.json();
          // Double check returned phone matches what user claimed
          if (data.phoneNumber === cleanPhone || data.phoneNumber.replace('+', '') === cleanPhone.replace('+', '')) {
            verified = true;
          }
        } else {
          const errData = await firebaseRes.json();
          console.warn("Firebase signInWithPhoneNumber failed:", errData);
        }
      } catch (err: any) {
        console.error("Firebase verify OTP error:", err.message);
      }
    }



    if (!verified) {
      return NextResponse.json({ error: 'Invalid or expired OTP code' }, { status: 400 });
    }

    // Determine Role
    const isAdmin = cleanPhone === adminPhone || cleanPhone.replace('+', '') === adminPhone.replace('+', '');
    const role = isAdmin ? 'admin' : 'agent';
    const redirectUrl = isAdmin ? '/admin' : '/dashboard';

    // Generate stateless JWT session token
    const token = signToken({ phoneNumber: cleanPhone, role });

    // Set cookie response
    const response = NextResponse.json({
      success: true,
      token,
      redirectUrl,
      role,
      phoneNumber: cleanPhone
    });

    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error("Error in verify-otp API:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
