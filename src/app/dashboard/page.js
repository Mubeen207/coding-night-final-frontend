"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroCard from '../components/HeroCard';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    trustScore: 100,
    contributions: 0,
    aiInsight: "Loading..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileRes = await fetch('/api/users/profile');
      if (profileRes.ok) {
        const user = await profileRes.json();
        setUserData(user);
        setStats({
          trustScore: user.trustScore || 100,
          contributions: user.contributions || 0,
          aiInsight: user.skills?.includes('React') || user.skills?.includes('JavaScript')
            ? "High demand for React bugs"
            : "High demand for design review"
        });
      }

      // Fetch recent requests
      const requestsRes = await fetch('/api/requests?limit=5');
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(data.slice(0, 2)); // Show only 2 recent requests
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleICanHelp = async (requestId) => {
    try {
      const res = await fetch(`/api/requests/${requestId}/help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error offering help:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <HeroCard
        label="DASHBOARD"
        title={`Welcome back, ${session?.user?.name || 'Helper'}`}
        description="Here is an overview of community activity and where your help is needed most right now."
        className="pb-16 pt-12"
      >
        <div className="flex gap-4">
          <Link href="/create-request" className="bg-brand-primary hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
            Ask for Help
          </Link>
          <Link href="/explore" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full border border-white/20 font-medium transition-colors">
            Offer Help
          </Link>
        </div>
      </HeroCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-10 px-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-2">YOUR TRUST SCORE</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">{stats.trustScore}%</p>
          <p className="text-gray-500 text-sm">Top percentile of reliable helpers.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-2">CONTRIBUTIONS</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">{stats.contributions}</p>
          <p className="text-gray-500 text-sm">Help requests resolved by you.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-2">AI INSIGHT</p>
          <p className="text-xl font-bold text-gray-900 mb-2 leading-tight">{stats.aiInsight}</p>
          <Link href="/ai-center" className="text-brand-primary text-sm font-medium hover:underline">View AI Center →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
             <h3 className="text-2xl font-bold text-gray-900">Recent community requests</h3>
             <Link href="/explore" className="text-brand-primary text-sm font-medium hover:underline">View all</Link>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No requests yet. Be the first to create one!</p>
            ) : (
              requests.map((request, index) => (
                <div
                  key={request._id}
                  className={`flex items-start justify-between ${index < requests.length - 1 ? 'border-b border-gray-50 pb-6' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        request.urgency === 'High' ? 'bg-red-100 text-red-700' :
                        request.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {request.urgency} Urgency
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {request.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{request.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{request.description}</p>
                  </div>
                  <button
                    onClick={() => handleICanHelp(request._id)}
                    className="whitespace-nowrap px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 ml-4"
                  >
                    I can help
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
             <Link href="/profile" className="p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors flex items-center justify-between group">
               <div>
                 <p className="font-bold text-gray-900">Update Profile</p>
                 <p className="text-xs text-gray-500">Edit skills and availability</p>
               </div>
               <span className="text-gray-300 group-hover:text-brand-primary transition-colors">→</span>
             </Link>
             <Link href="/notifications" className="p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors flex items-center justify-between group">
               <div>
                 <p className="font-bold text-gray-900">Check Notifications</p>
                 <p className="text-xs text-gray-500">View unread updates</p>
               </div>
               <span className="text-gray-300 group-hover:text-brand-primary transition-colors">→</span>
             </Link>
             <Link href="/leaderboard" className="p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors flex items-center justify-between group">
               <div>
                 <p className="font-bold text-gray-900">View Leaderboard</p>
                 <p className="text-xs text-gray-500">See top community helpers</p>
               </div>
               <span className="text-gray-300 group-hover:text-brand-primary transition-colors">→</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
