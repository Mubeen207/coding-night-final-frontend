"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (data?.ok) {
      alert("Welcome");
      setEmail("");
      setPassword("");
      router.replace("/");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <title>Login | Todo App</title>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Login to manage your daily tasks
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Email"
                className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700 bg-gray-50/50"
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
                placeholder="Password"
                className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700 bg-gray-50/50"
                required
              />
            </div>

            <input
              type="submit"
              value="login"
              className="w-full py-4 text-white font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-indigo-100 cursor-pointer mt-4 uppercase tracking-wider"
            />
          </form>

          <div className="mt-10 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-orange-700 hover:text-orange-800 font-extrabold ml-1 hover:underline transition-all"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}