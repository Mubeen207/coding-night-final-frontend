"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroCard from '../components/HeroCard';

export default function CreateRequest() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'Web Development',
    urgency: 'Medium'
  });
  const [aiSuggestions, setAiSuggestions] = useState({
    category: 'Community',
    urgency: 'Low',
    tags: [],
    rewrite: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyAISuggestions = () => {
    if (aiSuggestions.category !== 'Community') {
      setFormData(prev => ({ ...prev, category: aiSuggestions.category }));
    }
    if (aiSuggestions.urgency !== 'Low') {
      setFormData(prev => ({ ...prev, urgency: aiSuggestions.urgency }));
    }
    if (aiSuggestions.tags.length > 0) {
      const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
      const newTags = [...new Set([...currentTags, ...aiSuggestions.tags])];
      setFormData(prev => ({ ...prev, tags: newTags.join(', ') }));
    }
    if (aiSuggestions.rewrite) {
      setFormData(prev => ({ ...prev, description: aiSuggestions.rewrite }));
    }
  };

  const generateAISuggestions = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a description first');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description })
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t)
        : [];

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          urgency: formData.urgency,
          tags: tagsArray
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/request/${data._id}`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
    } finally {
      setSubmitting(false);
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
        label="CREATE REQUEST"
        title="Turn a rough problem into a clear help request."
        description="Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite."
        className="pb-16 pt-12"
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-2 items-start">
        {/* Form Area */}
        <form onSubmit={handleSubmit} className="w-full lg:w-[60%] flex flex-col gap-6 bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 relative z-10 -mt-10">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Need review on my JavaScript quiz app before submission"
              required
              className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
              required
              className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none min-h-[160px] resize-none font-medium"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="JavaScript, Debugging, Review"
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none appearance-none font-medium"
              >
                <option>Web Development</option>
                <option>Design</option>
                <option>Career</option>
                <option>Community</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 w-full md:w-1/2 md:pr-3">
            <label className="text-sm font-bold text-gray-700">Urgency</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none appearance-none font-medium"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              type="button"
              onClick={generateAISuggestions}
              disabled={loading || !formData.description.trim()}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-6 py-3.5 rounded-full font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get AI Suggestions'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand-primary border border-brand-primary hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish request'}
            </button>
          </div>
        </form>

        {/* AI Assistant Right Panel */}
        <div className="w-full lg:w-[40%] bg-[#FCFAEF] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F2EFE1] relative lg:-mt-10 lg:sticky top-8">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">AI ASSISTANT</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Smart request guidance
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#F2EFE1] pb-6">
              <span className="text-gray-600 font-medium text-sm">Suggested category</span>
              <span className="font-bold text-gray-900">{aiSuggestions.category}</span>
            </div>

            <div className="flex justify-between items-center border-b border-[#F2EFE1] pb-6">
              <span className="text-gray-600 font-medium text-sm">Detected urgency</span>
              <span className={`font-bold ${
                aiSuggestions.urgency === 'High' ? 'text-red-600' :
                aiSuggestions.urgency === 'Medium' ? 'text-orange-600' :
                'text-gray-900'
              }`}>
                {aiSuggestions.urgency}
              </span>
            </div>

            <div className="flex justify-between items-start border-b border-[#F2EFE1] pb-6">
              <span className="text-gray-600 font-medium text-sm w-1/3">Suggested tags</span>
              <div className="flex flex-wrap gap-1 justify-end w-2/3">
                {aiSuggestions.tags.length > 0 ? (
                  aiSuggestions.tags.map((tag, idx) => (
                    <span key={idx} className="bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags detected</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium text-sm w-1/3 pt-1">Rewrite suggestion</span>
              <span className="font-bold text-gray-900 text-sm text-right leading-relaxed w-2/3">
                {aiSuggestions.rewrite || 'Generate suggestions to see an improved version'}
              </span>
            </div>
          </div>

          {(aiSuggestions.tags.length > 0 || aiSuggestions.rewrite) && (
            <button
              onClick={applyAISuggestions}
              className="w-full mt-8 bg-brand-primary hover:bg-emerald-700 text-white font-bold rounded-xl px-4 py-3 transition-colors"
            >
              Apply AI Suggestions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
