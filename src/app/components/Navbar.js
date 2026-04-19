"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const fetchNotificationCount = async () => {
    try {
      const res = await fetch('/api/notifications/count');
      if (res.ok) {
        const data = await res.json();
        setNotificationCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/ai-center', label: 'AI Center' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-bg-base/80 backdrop-blur-md border-b border-white/20">
      <nav className="w-full flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm md:text-lg">
            H
          </div>
          <span className="font-semibold text-base md:text-lg tracking-tight whitespace-nowrap text-gray-900">HelpHub AI</span>
        </Link>

        {/* Center Links (Visible universally as per image design) */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100/50 backdrop-blur px-2 py-1.5 rounded-full border border-gray-200/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side Elements */}
        <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
          {/* Live Community Signals */}
          <Link href="/live" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            Live Community Signal
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" className="bg-brand-primary hover:bg-emerald-700 text-white px-5 py-2 rounded-full transition-colors font-medium shadow-sm whitespace-nowrap">
                  Go to Dashboard
                </Link>
                <button 
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/";
                  }} 
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-brand-primary hover:bg-emerald-700 text-white px-5 py-2 rounded-full transition-colors font-medium shadow-sm whitespace-nowrap">
                Join the Platform
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
