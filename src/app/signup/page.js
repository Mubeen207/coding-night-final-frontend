"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ToTitleCase from "../components/ToTitleCase";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Both");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && (data.status === 201 || data.status === 200)) {
        // Auto-login after successful registration
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } else {
        setError(data.message || "Registration failed");
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
              Join the community to ask for help and offer your skills
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
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
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-medium text-gray-700 bg-gray-50/50"
                required
                minLength={6}
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
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

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
