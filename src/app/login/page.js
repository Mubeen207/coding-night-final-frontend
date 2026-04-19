"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroCard from "../components/HeroCard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status } = useSession();

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
        body: JSON.stringify({ email, type: "login" }),
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const data = await signIn("credentials", {
      email,
      otp,
      action: "login",
      redirect: false,
    });

    setIsLoading(false);

    if (data?.ok) {
      router.replace("/dashboard");
    } else {
      setError(data?.error || "Invalid or expired OTP");
    }
  };

  return (
    <>
      <title>Login | HelpHub AI</title>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-8">
        {/* Left Side: Hero Card */}
        <HeroCard
          label="COMMUNITY ACCESS"
          title="Enter the support network."
          description="Sign in to access your community profile, ask for help, offer support, and track your contributions with our passwordless AI-powered platform."
          className="h-full min-h-[500px] flex flex-col justify-center"
        >
          <ul className="space-y-4 text-gray-300 mt-6 pl-4 border-l-2 border-brand-primary/30">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Connect with mentors and peers in your field</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Passwordless secure authentication via Email OTP</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Build your trust score and earn badges</span>
            </li>
          </ul>
        </HeroCard>

        {/* Right Side: Auth Form */}
        <div className="bg-white rounded-[2rem] p-10 md:p-14 shadow-sm border border-gray-100">
          <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">
            LOGIN
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Welcome back
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3.5 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-emerald-700 text-white font-medium rounded-xl text-lg px-5 py-4 text-center mt-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending OTP..." : "Continue with Email"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
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
                {isLoading ? "Verifying..." : "Secure Sign In"}
              </button>

              <div className="text-center mt-4">
                <button
                   type="button"
                   onClick={() => { setStep(1); setOtp(''); setError(''); }}
                   className="text-sm text-gray-500 hover:text-brand-primary transition-colors hover:underline"
                >
                   Use a different email
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-primary font-semibold hover:underline transition-all"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
