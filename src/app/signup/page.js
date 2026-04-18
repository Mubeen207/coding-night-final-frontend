"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ToTitleCase from "../components/ToTitleCase";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const {message , status} = await res.json();
    alert(message);
    
    if (status == 201 || status == 200) {
      setName("");
      setEmail("");
      setPassword("");

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    }
  };

  return (
    <>
      <title>Sign Up | Todo App</title>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Join us to start organizing your tasks
            </p>
          </div>

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
                className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700 bg-gray-50/50"
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
                placeholder="name@example.com"
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
                placeholder="Create a strong password"
                className="w-full py-3.5 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700 bg-gray-50/50"
                required
              />
            </div>

            <input 
              type="submit" 
              value="Signup" 
              className="w-full py-4 text-white font-bold bg-orange-800 hover:bg-orange-900 active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-orange-100 cursor-pointer mt-4"
            />
          </form>

          <div className="mt-10 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm font-medium">
              Have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-extrabold ml-1 hover:underline transition-all"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}