"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroCard from '../components/HeroCard';

export default function Onboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({
    skills: [],
    trending: []
  });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skills: '',
    interests: '',
    role: 'Both'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.name) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name
      }));
    }
  }, [status, router, session]);

  // AI Suggestion logic
  useEffect(() => {
    const currentSkills = formData.skills.toLowerCase();
    const suggestedSkills = [];

    if (currentSkills.includes('web') || currentSkills.includes('javascript')) {
      suggestedSkills.push('React', 'Next.js', 'Tailwind CSS');
    }
    if (currentSkills.includes('design') || currentSkills.includes('ui')) {
      suggestedSkills.push('Figma', 'UI/UX Principles');
    }
    if (currentSkills.includes('data')) {
      suggestedSkills.push('Python', 'Data Analysis');
    }

    setSuggestions({
      skills: suggestedSkills,
      trending: ['Resume Review', 'Debugging Help', 'Deployment', 'Interview Prep']
    });
  }, [formData.skills]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        // Create welcome notification
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Welcome to HelpHub AI! Your profile is set up.',
            type: 'Insight'
          })
        });

        router.push('/dashboard');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const applySkillSuggestion = (skill) => {
    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    if (!currentSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...currentSkills, skill].join(', ')
      }));
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <HeroCard
        label="ONBOARDING"
        title="Welcome to the support network."
        description="Let's set up your profile so the AI can match you with the right community members and help requests."
        className="pb-16 pt-12"
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-2 items-start">
        {/* Form */}
        <div className="w-full lg:w-[60%] bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 lg:-mt-10 relative z-10">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">YOUR IDENTITY</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Tell us about yourself
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E.g., Ayesha Khan"
                required
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
                placeholder="E.g., Karachi, Lahore, Remote"
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Your Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Figma, Python, UX Design"
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
              />
              {suggestions.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-gray-500">AI Suggests:</span>
                  {suggestions.skills.map((skill, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applySkillSuggestion(skill)}
                      className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full hover:bg-brand-primary/20 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 pb-6">
              <label className="text-sm font-bold text-gray-700">Your Interests (Comma separated)</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Open Source, Community Building, Interview Prep"
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
              />
            </div>

            <div className="space-y-2 pb-6">
              <label className="text-sm font-bold text-gray-700">Your Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none appearance-none font-medium"
              >
                <option>Both</option>
                <option>Need Help</option>
                <option>Can Help</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-emerald-700 text-white font-bold rounded-full text-base px-5 py-4 text-center transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Onboarding'}
            </button>
          </form>
        </div>

        {/* AI Suggestions Box */}
        <div className="w-full lg:w-[40%] bg-[#FCFAEF] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F2EFE1] lg:sticky top-8 relative z-10 lg:-translate-y-10">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">AI SUGGESTIONS</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Profile recommendations
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="font-bold text-gray-900 text-sm mb-2">Based on current community demand, we suggest adding:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                <li>React & Next.js for Web Devs</li>
                <li>Figma for Designers</li>
                <li>Data Science Basics</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="font-bold text-gray-900 text-sm mb-2">Trending Help Areas:</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestions.trending.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-brand-primary/10 p-5 rounded-2xl border border-brand-primary/20">
              <p className="font-bold text-brand-primary text-sm mb-2">Pro Tip:</p>
              <p className="text-gray-600 text-sm">
                Adding more specific skills helps the AI match you with relevant requests and helpers faster!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
