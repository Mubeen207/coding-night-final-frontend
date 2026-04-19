"use client";
import React, { useEffect, useState } from 'react';
import HeroCard from '../components/HeroCard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Leaderboard() {
  const { status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchLeaderboard();
    }
  }, [status, router]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeLabel = (user, index) => {
    if (user.trustScore >= 95) return 'Top Mentor';
    if (user.trustScore >= 85) return 'Code Rescuer';
    if (user.trustScore >= 75) return 'Bug Hunter';
    if (user.contributions >= 10) return 'Community Voice';
    return 'Rising Star';
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-yellow-500', // Gold
      'bg-gray-400',   // Silver
      'bg-orange-600', // Bronze
      'bg-brand-dark',
      'bg-brand-primary'
    ];
    return colors[index] || 'bg-brand-dark';
  };

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
        label="LEADERBOARD"
        title="Recognize the people who keep the community moving."
        description="Trust score, contribution count, and badges create visible momentum for reliable helpers."
        className="pb-16 pt-12"
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-2 items-start">
        {/* Top Helpers */}
        <div className="w-full lg:w-1/2 bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">TOP HELPERS</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Rankings
          </h2>

          <div className="space-y-4 pt-2">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found yet.</p>
            ) : (
              users.map((user, index) => (
                <div key={user._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                          {user.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            #{index + 1} {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{getBadgeLabel(user, index)}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 text-right">{user.trustScore || 100}%</h3>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full mb-4"></div>
                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                      <p>{user.skills?.slice(0, 3).join(', ') || 'No skills listed'}</p>
                      <p className="text-gray-900">{user.contributions || 0} contributions</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Badge System */}
        <div className="w-full lg:w-1/2 bg-[#FCFAEF] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F2EFE1]">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">BADGE SYSTEM</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Trust and achievement
          </h2>

          <div className="space-y-4 pt-2">
            {users.slice(0, 3).map((user, index) => {
              const badgeLabel = getBadgeLabel(user, index);
              const trustPercent = user.trustScore || 100;

              return (
                <div key={user._id} className="bg-white p-6 rounded-2xl border border-[#F2EFE1] hover:border-gray-200 transition-all shadow-sm flex flex-col gap-4">
                  <p className="font-bold text-lg text-gray-900 leading-none">{user.name}</p>
                  <div className="flex gap-2 mb-2">
                    <span className="text-gray-500 text-sm font-medium">{badgeLabel}</span>
                    {user.contributions >= 10 && (
                      <span className="text-brand-primary text-sm font-medium">• Community Voice</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${trustPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-right">Trust Score: {trustPercent}%</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-white rounded-2xl border border-[#F2EFE1]">
            <p className="font-bold text-gray-900 mb-4">How to Earn Badges:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                Complete requests to increase trust score
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                Help 10+ times to become a Community Voice
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                Maintain 95%+ trust for Top Mentor status
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                Fast response times earn Bug Hunter badge
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
