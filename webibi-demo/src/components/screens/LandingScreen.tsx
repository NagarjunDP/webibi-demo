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
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [inputVal, setInputVal] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpVals, setOtpVals] = useState(["", "", "", ""]);

  useEffect(() => {
    // Add listener for phone.email success
    (window as any).phoneEmailListener = function(userObj: any) {
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

  const handleGetOtp = () => {
    if (!inputVal) return;
    // Simulate sending OTP for email only now
    setShowOtp(true);
  };

  const handleVerify = () => {
    // Simulate verification
    updateState({
      userData: { phoneOrEmail: inputVal, verified: true },
      step: "category",
    });
  };

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

        {!showOtp ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="flex bg-surface p-1 rounded-xl border border-white/5">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  method === "phone" ? "bg-surface-elevated text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMethod("phone")}
              >
                Phone
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  method === "email" ? "bg-surface-elevated text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMethod("email")}
              >
                Email
              </button>
            </div>

            <div className="space-y-4">
              {method === "phone" ? (
                <div className="w-full flex justify-center py-4 bg-surface-elevated border border-white/5 rounded-xl">
                  {/* Phone.email integration button */}
                  <div className="pe_signin_button" data-client-id="axPD9TGe1NAIsxlrhxX79kdF2woWrSXF"></div>
                </div>
              ) : (
                <>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-surface-elevated border-white/5 rounded-xl h-12 text-lg focus-visible:ring-primary"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                  <Button
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#c471ed] hover:opacity-90 transition-opacity text-base font-semibold border-0"
                    onClick={handleGetOtp}
                  >
                    Get OTP &rarr;
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
          >
            <p className="text-center text-muted-foreground">
              Enter the 4-digit code sent to <br />
              <span className="text-foreground font-medium">{inputVal}</span>
            </p>

            <div className="flex justify-center gap-4">
              {otpVals.map((val, i) => (
                <Input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-14 h-16 text-center text-2xl font-bold bg-surface-elevated border-white/5 rounded-xl focus-visible:ring-primary"
                  value={val}
                  onChange={(e) => {
                    const newVals = [...otpVals];
                    newVals[i] = e.target.value;
                    setOtpVals(newVals);
                    // auto focus logic can go here in real impl
                  }}
                />
              ))}
            </div>

            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#c471ed] hover:opacity-90 transition-opacity text-base font-semibold border-0"
              onClick={handleVerify}
            >
              Verify & Enter ✦
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
