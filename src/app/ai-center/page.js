"use client";
import React, { useEffect, useState } from 'react';
import HeroCard from '../components/HeroCard';
import Link from 'next/link';

export default function AICenter() {
  const [insights, setInsights] = useState({
    topCategory: 'Loading...',
    highUrgencyCount: 0,
    trustedHelpersCount: 0,
    requestsNeedingAttention: [],
    trendingTags: [],
    categoryDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/ai/insights');
      if (!res.ok) {
        throw new Error('Failed to fetch insights');
      }
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-orange-100 text-orange-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const generateAISummary = (request) => {
    const desc = request.description?.toLowerCase() || '';
    const category = request.category || 'General';

    if (desc.includes('interview')) {
      return 'Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.';
    }
    if (desc.includes('portfolio') || desc.includes('responsive')) {
      return 'Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.';
    }
    if (desc.includes('figma') || desc.includes('design')) {
      return 'A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.';
    }
    if (desc.includes('bug') || desc.includes('debug')) {
      return 'Technical debugging request. Requires patience and systematic troubleshooting approach.';
    }
    if (desc.includes('api') || desc.includes('backend')) {
      return 'Backend/API related request. Requires knowledge of server-side technologies and database concepts.';
    }
    return `${category} request with ${request.urgency || 'normal'} urgency. Best matched with helpers experienced in ${request.tags?.slice(0, 2).join(' or ') || category}.`;
  };

  return (
    <div className="flex flex-col gap-8">
      <HeroCard
        label="AI CENTER"
        title="See what the platform intelligence is noticing."
        description="AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations."
        className="pb-24 pt-12"
      />

      {/* Stats overlapping the hero card slightly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 px-8 relative z-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">TREND PULSE</p>
            <p className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
              {loading ? '...' : insights.topCategory}
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8">Most common support area based on active community requests.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">URGENCY WATCH</p>
            <p className="text-6xl font-black text-gray-900 mb-2">
              {loading ? '...' : insights.highUrgencyCount}
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8">Requests currently flagged high priority by the urgency detector.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">MENTOR POOL</p>
            <p className="text-6xl font-black text-gray-900 mb-2">
              {loading ? '...' : insights.trustedHelpersCount}
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-8">Trusted helpers with strong response history and contribution signals.</p>
        </div>
      </div>

      {/* Trending Tags */}
      {!loading && insights.trendingTags.length > 0 && (
        <div className="px-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-3">TRENDING SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {insights.trendingTags.map((tag, idx) => (
                <span key={idx} className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full text-sm font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">AI RECOMMENDATIONS</p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">Requests needing attention</h2>
          </div>
          <Link href="/explore" className="text-brand-primary text-sm font-medium hover:underline">
            View all requests →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 rounded-2xl border border-red-100 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchInsights}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-full font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : insights.requestsNeedingAttention.length === 0 ? (
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <p className="text-gray-500 mb-4">No urgent requests at the moment.</p>
            <Link
              href="/explore"
              className="text-brand-primary font-medium hover:underline"
            >
              Browse all requests →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.requestsNeedingAttention.map((request) => (
              <Link
                key={request._id}
                href={`/request/${request._id}`}
                className="block p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{request.title}</h3>
                  <div className="flex gap-2">
                    <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {request.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  AI summary: {generateAISummary(request)}
                </p>
                {request.tags && request.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {request.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
