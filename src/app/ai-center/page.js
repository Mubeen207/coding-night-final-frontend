"use client";
import React from 'react';
import HeroCard from '../components/HeroCard';

export default function AICenter() {
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
            <p className="text-4xl font-bold text-gray-900 mb-2 leading-tight">Web<br/>Development</p>
          </div>
          <p className="text-gray-500 text-sm mt-8">Most common support area based on active community requests.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">URGENCY WATCH</p>
            <p className="text-6xl font-black text-gray-900 mb-2">2</p>
          </div>
          <p className="text-gray-500 text-sm mt-8">Requests currently flagged high priority by the urgency detector.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">MENTOR POOL</p>
            <p className="text-6xl font-black text-gray-900 mb-2">2</p>
          </div>
          <p className="text-gray-500 text-sm mt-8">Trusted helpers with strong response history and contribution signals.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
        <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-6">AI RECOMMENDATIONS</p>
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">Requests needing attention</h2>

        <div className="space-y-4">
          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Need help</h3>
            <p className="text-gray-600 text-sm mb-4">AI summary: Web Development request with high urgency. Best suited for members with relevant expertise.</p>
            <div className="flex gap-2">
              <span className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full text-xs font-semibold">Web Development</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">High</span>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Need help making my portfolio responsive before demo day</h3>
            <p className="text-gray-600 text-sm mb-4">Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.</p>
            <div className="flex gap-2">
              <span className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full text-xs font-semibold">Web Development</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">High</span>
            </div>
          </div>

          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Looking for Figma feedback on a volunteer event poster</h3>
            <p className="text-gray-600 text-sm mb-4">A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.</p>
            <div className="flex gap-2">
              <span className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full text-xs font-semibold">Design</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">Medium</span>
            </div>
          </div>

          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Need mock interview support for internship applications</h3>
            <p className="text-gray-600 text-sm mb-4">Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.</p>
            <div className="flex gap-2">
              <span className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full text-xs font-semibold">Career</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
