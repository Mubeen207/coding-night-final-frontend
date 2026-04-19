"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Bell, Check, X } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotificationCount();
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotificationCount();
        if (showDropdown) fetchNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [status, showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
        setNotificationCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PUT' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setNotificationCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.relatedRequestId) {
      router.push(`/request/${notification.relatedRequestId}`);
    }
    setShowDropdown(false);
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
                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {notificationCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-brand-primary hover:text-emerald-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-center text-gray-500 text-sm">No notifications</p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                                !notification.isRead ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification._id);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Check className="w-4 h-4 text-brand-primary" />
                                  </button>
                                )}
                              </div>
                              {notification.actionRequired && notification.helpStatus === 'pending' && (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/request/${notification.relatedRequestId}`);
                                      setShowDropdown(false);
                                    }}
                                    className="text-xs bg-brand-primary text-white px-3 py-1 rounded-full hover:bg-emerald-700"
                                  >
                                    View Request
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
