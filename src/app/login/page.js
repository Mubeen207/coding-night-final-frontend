"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroCard from "../components/HeroCard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const data = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (data?.ok) {
      router.replace("/dashboard");
    } else {
      setError("Invalid email or password");
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
          description="Sign in to access your community profile, ask for help, offer support, and track your contributions with our AI-powered platform."
          className="h-full min-h-[500px] flex flex-col justify-center"
        >
          <ul className="space-y-4 text-gray-300 mt-6 pl-4 border-l-2 border-brand-primary/30">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Connect with mentors and peers in your field</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Get AI-powered help request suggestions</span>
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3.5 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3.5 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-emerald-700 text-white font-medium rounded-xl text-lg px-5 py-4 text-center mt-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
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
