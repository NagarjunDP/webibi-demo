"use client";

import { useState, useEffect } from "react";
import { FlowState } from "@/app/page";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  state: FlowState;
  updateState: (updates: Partial<FlowState>) => void;
}

export default function LandingScreen({ state, updateState }: Props) {
  // No extra state needed for phone.email integration


  useEffect(() => {
    (window as any).phoneEmailListener = async function (userObj: any) {
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userJsonUrl: userObj?.user_json_url,
            phoneNumber: "+16505553434", // fallback
            code: "654321",
            sessionInfo: null,
            mockMode: true
          }),
        });
        const data = await res.json();
        if (data.redirectUrl === '/admin') {
          window.location.href = '/admin';
          return;
        }
      } catch (err) {
        console.error("Failed to sync session cookie with backend", err);
      }

      updateState({
        userData: { phoneOrEmail: "verified-phone", verified: true },
        step: "category",
      });
    };

    // Load the phone.email script only once when mounted
    if (!document.getElementById("phone-email-script")) {
      const script = document.createElement("script");
      script.id = "phone-email-script";
      script.src = "https://www.phone.email/sign_in_button_v1.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [updateState]);



  return (
    <div className="flex flex-col flex-1 p-6 items-center justify-center relative">
      {/* Decorative blurred background orb */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#c471ed]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Logo Mark */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#c471ed] flex items-center justify-center mb-10 shadow-lg shadow-primary/20">
          <span className="font-heading font-black text-3xl text-white">W</span>
        </div>

        <h1 className="font-heading text-4xl text-center mb-4 tracking-tight leading-tight">
          Your website, <br />
          <span className="gradient-text">in 60 seconds.</span>
        </h1>
        <p className="text-muted-foreground text-center mb-10 text-lg">
          See a live demo built from your logo &mdash; right now.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-6"
        >
          <div className="space-y-4">
            <div className="w-full flex justify-center py-4 bg-surface-elevated border border-white/5 rounded-xl">
              {/* Phone.email integration button */}
              <div className="pe_signin_button" data-client-id="axPD9TGe1NAIsxlrhxX79kdF2woWrSXF"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}