"use client";
import React, { useEffect, useState } from 'react';
import HeroCard from '../../components/HeroCard';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

export default function RequestDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHelper, setIsHelper] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && params.id) {
      fetchRequest();
    }
  }, [status, router, params.id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/requests/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setRequest(data);

        // Check if current user is a helper
        const userRes = await fetch('/api/users/profile');
        if (userRes.ok) {
          const userData = await userRes.json();
          const isUserHelper = data.helpers?.some(h =>
            h._id?.toString() === userData._id?.toString()
          );
          setIsHelper(isUserHelper);
        }
      } else {
        router.push('/explore');
      }
    } catch (error) {
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleICanHelp = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/requests/${params.id}/help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        fetchRequest();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsSolved = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/requests/${params.id}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Request marked as ${data.status}`);
        fetchRequest();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Generate AI summary
  const generateAISummary = (desc) => {
    if (!desc) return '';
    const text = desc.toLowerCase();

    if (text.includes('interview')) {
      return 'Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.';
    }
    if (text.includes('portfolio') || text.includes('responsive')) {
      return 'Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.';
    }
    if (text.includes('figma') || text.includes('design')) {
      return 'A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.';
    }
    if (text.includes('bug') || text.includes('debug')) {
      return 'Technical debugging request. Requires patience and systematic troubleshooting approach.';
    }
    return `${desc.substring(0, 100)}... This request needs community support.`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg mb-4">Request not found</p>
        <Link href="/explore" className="text-brand-primary hover:underline">
          Browse all requests
        </Link>
      </div>
    );
  }

  const isOwner = request.requester?.email === session?.user?.email;
  const aiSummary = generateAISummary(request.description);

  return (
    <div className="flex flex-col gap-8">
      <HeroCard
        label="REQUEST DETAIL"
        title={request.title}
        description={request.description}
        className="pb-16 pt-12"
      >
        <div className="flex gap-2 flex-wrap">
          <span className="bg-brand-primary/20 border border-brand-primary/30 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {request.category}
          </span>
          <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${
            request.urgency === 'High' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
            request.urgency === 'Medium' ? 'bg-orange-500/20 border-orange-500/30 text-orange-300' :
            'bg-white/10 border-white/20 text-white'
          }`}>
            {request.urgency}
          </span>
          <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${
            request.status === 'Solved' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
            'bg-blue-500/20 border-blue-500/30 text-blue-300'
          }`}>
            {request.status}
          </span>
        </div>
      </HeroCard>

      <div className="flex flex-col lg:flex-row gap-6 mt-2 items-start">
        {/* Left Column: AI Summary & Actions */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6 lg:-mt-10 relative z-10">
          <div className="bg-[#FCFAEF] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F2EFE1]">
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">AI SUMMARY</p>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                H
              </div>
              <p className="font-bold text-gray-900 border-b border-transparent">HelpHub AI</p>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {aiSummary}
            </p>
            {request.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {request.tags.map((tag, idx) => (
                  <span key={idx} className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-0 sm:mr-4">ACTIONS</p>

            {!isOwner && (
              <button
                onClick={handleICanHelp}
                disabled={actionLoading}
                className={`w-full sm:w-auto px-6 py-3 font-bold rounded-full text-sm text-center transition-colors shadow-sm ${
                  isHelper
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-brand-primary hover:bg-emerald-700 text-white'
                }`}
              >
                {actionLoading ? 'Processing...' : (isHelper ? 'Remove as helper' : 'I can help')}
              </button>
            )}

            {isOwner && (
              <button
                onClick={handleMarkAsSolved}
                disabled={actionLoading}
                className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-full text-sm px-6 py-3 text-center transition-colors shadow-sm"
              >
                {actionLoading ? 'Updating...' : (request.status === 'Solved' ? 'Mark as Open' : 'Mark as solved')}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Requester & Helpers */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:sticky top-8 relative z-10 lg:-translate-y-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">REQUESTER</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-bold">
                {request.requester?.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{request.requester?.name || 'Anonymous'}</p>
                <p className="text-xs text-gray-500">{request.requester?.location || 'Unknown location'}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FCFAEF] p-8 rounded-[2rem] shadow-sm border border-[#F2EFE1]">
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">HELPERS</p>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
              People ready to support
            </h3>

            <div className="space-y-4">
              {request.helpers?.length === 0 ? (
                <p className="text-gray-500 text-sm">No helpers yet. Be the first to help!</p>
              ) : (
                request.helpers.map((helper, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {helper.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm mb-1">{helper.name}</p>
                        <p className="text-xs text-gray-500">{helper.skills?.slice(0, 3).join(', ') || 'No skills listed'}</p>
                      </div>
                    </div>
                    <div className="bg-[#E4F3F0] text-brand-primary rounded-full px-3 py-1 text-xs font-bold">
                      Trust {helper.trustScore || 100}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
