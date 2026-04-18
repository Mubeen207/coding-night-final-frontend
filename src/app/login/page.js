"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroCard from "../components/HeroCard";

export default function Login() {
  const [email, setEmail] = useState("community@helphub.ai");
  const [password, setPassword] = useState("password");
  const [demoUser, setDemoUser] = useState("Ayesha Khan");
  const [role, setRole] = useState("Both");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
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
      alert("Invalid email or password");
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
          description="Choose a demo identity, set your role, and jump into a multi-page product flow designed for asking, offering, and tracking help with a premium interface."
          className="h-full min-h-[500px] flex flex-col justify-center"
        >
          <ul className="space-y-4 text-gray-300 mt-6 pl-4 border-l-2 border-brand-primary/30">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Role-based entry for Need Help, Can Help, or Both</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Direct path into dashboard, requests, AI Center, and community feed</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 mr-3 flex-shrink-0"></span>
              <span>Persistent demo session powered by MongoDB</span>
            </li>
          </ul>
        </HeroCard>

        {/* Right Side: Auth Form */}
        <div className="bg-white rounded-[2rem] p-10 md:p-14 shadow-sm border border-gray-100">
          <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">LOGIN / SIGNUP</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Authenticate your community profile
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select demo user</label>
              <select 
                value={demoUser} 
                onChange={(e) => setDemoUser(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3.5 outline-none appearance-none"
              >
                <option>Ayesha Khan</option>
                <option>Sara Noor</option>
                <option>Hassan Ali</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Role selection</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3.5 outline-none appearance-none"
              >
                <option>Both</option>
                <option>Need Help</option>
                <option>Can Help</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3.5 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-3.5 outline-none font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-emerald-700 text-white font-medium rounded-xl text-lg px-5 py-4 text-center mt-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Continue to dashboard"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}