"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroCard from '../components/HeroCard';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skills: '',
    interests: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          location: data.location || '',
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
          interests: Array.isArray(data.interests) ? data.interests.join(', ') : data.interests || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditMode(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getTrustBadge = (score) => {
    if (score >= 95) return { label: 'Top Mentor', color: 'bg-brand-primary/10 text-brand-primary' };
    if (score >= 85) return { label: 'Trusted Helper', color: 'bg-green-100 text-green-700' };
    if (score >= 75) return { label: 'Active Member', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Rising Star', color: 'bg-gray-100 text-gray-700' };
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg mb-4">Failed to load profile</p>
        <button
          onClick={fetchProfile}
          className="text-brand-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const trustBadge = getTrustBadge(user.trustScore || 100);
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const badges = user.badges || [];

  return (
    <div className="flex flex-col gap-8">
      <HeroCard
        label="PROFILE"
        title={user.name}
        description={`${user.role || 'Both'} • ${user.location || 'No location set'}`}
        className="pb-16 pt-12"
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-2 items-start">
        {/* Public Profile View */}
        <div className="w-full lg:w-[55%] bg-[#FCFAEF] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F2EFE1] lg:-mt-10 lg:sticky top-8 relative z-10">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">PUBLIC PROFILE</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Skills and reputation
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#F2EFE1] pb-6">
              <span className="text-gray-600 font-medium">Trust score</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{user.trustScore || 100}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${trustBadge.color}`}>
                  {trustBadge.label}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#F2EFE1] pb-6">
              <span className="text-gray-600 font-medium">Contributions</span>
              <span className="font-bold text-gray-900">{user.contributions || 0}</span>
            </div>

            <div className="flex justify-between items-center border-b border-[#F2EFE1] pb-6">
              <span className="text-gray-600 font-medium">Email</span>
              <span className="font-bold text-gray-900 text-sm">{user.email}</span>
            </div>

            <div className="pt-2">
              <p className="font-bold text-gray-900 mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, idx) => (
                    <span key={idx} className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full text-xs font-bold font-mono tracking-wide">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
              </div>
            </div>

            <div className="pt-6">
              <p className="font-bold text-gray-900 mb-3">Badges</p>
              <div className="flex flex-wrap gap-2">
                {badges.length > 0 ? (
                  badges.map((badge, idx) => (
                    <span key={idx} className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full text-xs font-bold font-mono tracking-wide">
                      {badge}
                    </span>
                  ))
                ) : (
                  <span className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full text-xs font-bold font-mono tracking-wide">
                    {trustBadge.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile View */}
        <div className="w-full lg:w-[45%] bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">EDIT PROFILE</p>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
                Update your identity
              </h2>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-primary/20 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-6">
            {editMode ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
                  />
                </div>

                <div className="space-y-2 pb-6">
                  <label className="text-sm font-bold text-gray-700">Interests (comma separated)</label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-brand-primary hover:bg-emerald-700 text-white font-bold rounded-full text-base px-5 py-4 text-center transition-colors shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save profile'}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: user.name || '',
                        location: user.location || '',
                        skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '',
                        interests: Array.isArray(user.interests) ? user.interests.join(', ') : user.interests || ''
                      });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full text-base px-5 py-4 text-center transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Name</p>
                  <p className="text-gray-900">{user.name}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Location</p>
                  <p className="text-gray-900">{user.location || 'Not set'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Skills</p>
                  <p className="text-gray-900">{skills.length > 0 ? skills.join(', ') : 'No skills added'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Interests</p>
                  <p className="text-gray-900">{user.interests?.length > 0 ? user.interests.join(', ') : 'No interests added'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
