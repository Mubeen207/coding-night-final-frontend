"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroCard from '../components/HeroCard';

export default function Notifications() {
  const { status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchNotifications();
    }
  }, [status, router]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setMarkingRead(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    } finally {
      setMarkingRead(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Match':
        return 'bg-blue-100 text-blue-700';
      case 'Status':
        return 'bg-green-100 text-green-700';
      case 'Reputation':
        return 'bg-purple-100 text-purple-700';
      case 'Insight':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <HeroCard
        label="NOTIFICATIONS"
        title="Stay updated on requests, helpers, and trust signals."
        className="pb-20"
      >
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingRead}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/20"
          >
            {markingRead ? 'Marking...' : `Mark all as read (${unreadCount})`}
          </button>
        )}
      </HeroCard>

      <div className="bg-[#FCFAEF] p-8 md:p-12 rounded-[2rem] shadow-sm border border-[#F2EFE1] -mt-16 mx-4 md:mx-auto md:w-[85%] lg:w-[75%] relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">LIVE UPDATES</p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Notification feed
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-white text-center">
              <p className="text-gray-500">No notifications yet. Activity will appear here!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white p-6 rounded-2xl flex justify-between items-center shadow-sm border transition-colors cursor-pointer ${
                  notification.isRead ? 'border-white hover:border-gray-100' : 'border-brand-primary/30 hover:border-brand-primary/50 bg-brand-primary/5'
                }`}
              >
                <div className="flex-1">
                  <p className={`text-base text-gray-900 mb-1 ${notification.isRead ? 'font-medium' : 'font-bold'}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                    <span className="text-sm font-medium text-gray-400">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full ml-4 ${
                  notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-brand-primary/10 text-brand-primary'
                }`}>
                  {notification.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
