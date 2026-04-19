"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function LiveFeed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLiveRequests();
  }, []);

  const fetchLiveRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/requests');
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setRequests(data);
    } catch (err) {
      console.error('Error fetching live requests:', err);
      setError(err.message || 'Something went wrong while loading the live feed.');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'bg-green-100 text-green-700';
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="pt-8 mb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">LIVE FEED</p>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Live Community Signals
            </h1>
            <span className="relative flex h-3 w-3 mt-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
            </span>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl text-lg">
            Watch community problems get solved in real-time. Jump in and offer help where needed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          // Loading skeleton guarantees visual UI during network delay
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between animate-pulse min-h-[250px]">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
                <div className="h-px bg-gray-100 w-full mb-4"></div>
                <div className="h-8 bg-gray-200 rounded-full w-1/3 ml-auto"></div>
              </div>
            ))}
          </>
        )}

        {!loading && error && (
          // Error state prevents blank page collapse
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-red-50 p-8 rounded-3xl border border-red-100 text-center flex flex-col items-center justify-center min-h-[300px]">
            <svg className="w-12 h-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load feed</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchLiveRequests} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-full font-medium transition-colors">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          // Empty state handles valid but empty arrays protecting from blank page
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active signals</h3>
            <p className="text-gray-500 mb-6 max-w-md">The community is quiet right now. There are no live requests. Be the first to ask for help!</p>
            <Link
              href="/create-request"
              className="bg-brand-primary text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors"
            >
              Post a Request
            </Link>
          </div>
        )}

        {!loading && !error && requests.length > 0 && requests.map((request) => (
          // Secure array map with rigorous prop fallbacks guarding against undefined objects
          <div key={request._id || Math.random().toString()} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow min-h-[250px]">
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-medium">
                  {request.category || 'General'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency || 'Normal'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status || 'Open'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 leading-snug">{request.title || 'Untitled Request'}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">{request.description || 'No description provided.'}</p>
              {request.tags && Array.isArray(request.tags) && request.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {request.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="h-px bg-gray-100 w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{request.requester?.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{request.requester?.location || 'Unknown'} • {request.helpers ? request.helpers.length : 0} helper(s)</p>
                </div>
                {request._id ? (
                  <Link href={`/request/${request._id}`} className="text-sm font-medium border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                    Open details
                  </Link>
                ) : (
                  <button className="text-sm font-medium border border-gray-200 px-4 py-2 rounded-full opacity-50 cursor-not-allowed">
                    Open details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
