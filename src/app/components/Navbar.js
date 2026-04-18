"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotificationCount();

      // Poll for new notifications every 30 seconds
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/explore', label: 'Explore' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/messages', label: 'Messages' },
  ];

  return (
    <nav className="w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto mb-4">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-lg">
          H
        </div>
        <span className="font-semibold text-lg tracking-tight">HelpHub AI</span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
        {status === "authenticated" && (
          <>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gray-900 transition-colors relative ${pathname === link.href ? 'text-gray-900' : ''}`}
              >
                {link.label}
                {link.href === '/messages' && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-2">
              <Link href="/notifications" className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Link>

              <Link
                href="/create-request"
                className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-5 py-2 rounded-full transition-colors font-medium"
              >
                Create Request
              </Link>

              <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-brand-dark text-white text-xs font-bold flex items-center justify-center">
                  {session.user?.name?.charAt(0) || '?'}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Profile
                  </Link>
                  <Link href="/ai-center" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    AI Center
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {status !== "authenticated" && (
          <Link href="/login" className="bg-brand-primary hover:bg-emerald-700 text-white px-5 py-2 rounded-full transition-colors font-medium shadow-sm ml-2">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
