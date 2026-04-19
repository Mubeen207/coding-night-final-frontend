"use client";
import React, { useEffect, useState } from 'react';
import HeroCard from '../components/HeroCard';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Explore() {
  const { status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All categories',
    urgency: 'All urgency levels',
    skills: '',
    location: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchRequests();
    }
  }, [status, router]);

  useEffect(() => {
    applyFilters();
  }, [filters, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        setFilteredRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    if (filters.category && filters.category !== 'All categories') {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    if (filters.urgency && filters.urgency !== 'All urgency levels') {
      filtered = filtered.filter(r => r.urgency === filters.urgency);
    }

    if (filters.skills.trim()) {
      const skillKeywords = filters.skills.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(r =>
        r.tags?.some(tag =>
          skillKeywords.some(keyword => tag.toLowerCase().includes(keyword))
        )
      );
    }

    if (filters.location.trim()) {
      const locationKeywords = filters.location.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(r =>
        locationKeywords.some(keyword =>
          r.requester?.location?.toLowerCase().includes(keyword)
        )
      );
    }

    setFilteredRequests(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All categories',
      urgency: 'All urgency levels',
      skills: '',
      location: ''
    });
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
        label="EXPLORE / FEED"
        title="Browse help requests with filterable community context."
        description="Filter by category, urgency, skills, and location to surface the best matches."
        className="pb-16"
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-2 items-start">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">FILTERS</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">Refine the feed</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none appearance-none"
              >
                <option>All categories</option>
                <option>Web Development</option>
                <option>Design</option>
                <option>Career</option>
                <option>Community</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Urgency</label>
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none appearance-none"
              >
                <option>All urgency levels</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Skills</label>
              <textarea
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none min-h-[100px] resize-none"
                placeholder="React, Figma, Git/GitHub"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <textarea
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none min-h-[100px] resize-none"
                placeholder="Karachi, Lahore, Remote"
              ></textarea>
            </div>

            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl px-4 py-3 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Feed List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 mb-4">No requests match your filters.</p>
              <button
                onClick={clearFilters}
                className="text-brand-primary font-medium hover:underline"
              >
                Clear filters to see all requests
              </button>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {request.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.urgency === 'High' ? 'bg-red-100 text-red-700' :
                      request.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {request.urgency}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'Solved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 leading-snug">{request.title}</h3>
                  <p className="text-gray-500 text-sm mb-6">{request.description}</p>

                  {request.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {request.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-100 w-full mb-4"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{request.requester?.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{request.requester?.location || 'Unknown'} • {request.helpers?.length || 0} helper(s) interested</p>
                  </div>
                  <Link href={`/request/${request._id}`} className="text-sm font-semibold border border-gray-200 px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors bg-white shadow-sm">
                    Open details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
