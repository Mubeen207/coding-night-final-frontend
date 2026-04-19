"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ToTitleCase from "../components/ToTitleCase";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Both");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "signup" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await signIn("credentials", {
        name,
        email,
        otp,
        role,
        action: "register",
        redirect: false,
      });

      if (data?.ok) {
        router.replace("/dashboard");
      } else {
        setError(data?.error || "Invalid or expired OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Sign Up | HelpHub AI</title>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Join the community securely with Email Verification
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
             <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(ToTitleCase(e.target.value))}
                  placeholder="Enter your name"
                  className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-medium text-gray-700 bg-gray-50/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="you@example.com"
                  className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-medium text-gray-700 bg-gray-50/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  I want to
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-medium text-gray-700 bg-gray-50/50 outline-none"
                  required
                >
                  <option value="Both">Ask for help & Offer help</option>
                  <option value="Need Help">Ask for help</option>
                  <option value="Can Help">Offer help</option>
                </select>
                <p className="text-xs text-gray-500 ml-1 mt-1">
                  You can change this later in your profile
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-white font-bold bg-brand-primary hover:bg-emerald-700 active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-brand-primary/20 cursor-pointer mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating OTP..." : "Get Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Enter 6-digit OTP sent to {email}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,6))}
                  placeholder="Enter 6-digit code"
                  className="w-full text-center tracking-[0.5em] font-mono font-bold text-2xl bg-white border border-brand-primary border-2 text-gray-900 rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:font-normal"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-brand-primary hover:bg-emerald-700 text-white font-medium rounded-xl text-lg px-5 py-4 text-center mt-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying & Creating..." : "Verify & Create Account"}
              </button>

              <div className="text-center mt-4">
                <button
                   type="button"
                   onClick={() => { setStep(1); setOtp(''); setError(''); }}
                   className="text-sm text-gray-500 hover:text-brand-primary transition-colors hover:underline"
                >
                   Go back and edit details
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-brand-primary hover:text-emerald-700 font-extrabold ml-1 hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
