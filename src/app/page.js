"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import HeroCard from "./components/HeroCard";

export default function Home() {
  const { status } = useSession();

  return (
    <div className="flex flex-col gap-16 pt-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">SMIT GRAND CODING NIGHT 2026</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Find help faster.<br/>Become help that<br/>matters.
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg">
            HelpHub AI is a community-powered support network for students, mentors, creators, and builders. Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
          </p>
          
          <div className="flex gap-4 mb-12">
            <Link href={status === "authenticated" ? "/dashboard" : "/login"} className="bg-brand-primary hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer">
              Open product demo
            </Link>
            <Link href="/create-request" className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-6 py-3 rounded-full font-medium transition-colors shadow-sm">
              Post a request
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-2">MEMBERS</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">384+</p>
              <p className="text-gray-500 text-sm">Students, mentors, and helpers in the loop.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-2">REQUESTS</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">72+</p>
              <p className="text-gray-500 text-sm">Support posts shared across learning journeys.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-2">SOLVED</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">69+</p>
              <p className="text-gray-500 text-sm">Problems resolved through fast community action.</p>
            </div>
          </div>
        </div>

        {/* Right side Hero Card */}
        <div className="relative">
          <HeroCard 
            label="LIVE PRODUCT FEEL"
            title="More than a form. More like an ecosystem."
            description="A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, contribution signals, and leaderboard momentum built directly in HTML, CSS, JavaScript, and Next.js/MongoDB."
            className="pb-16 pt-12 relative overflow-hidden h-[650px] flex flex-col items-start justify-start"
          >
            {/* Orange visual flair */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-500 rounded-full blur-sm opacity-80"></div>
            
            <div className="flex flex-col gap-4 mt-8 w-full">
              <div className="bg-white/95 text-gray-900 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold mb-1">AI request intelligence</h3>
                <p className="text-sm text-gray-600">Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.</p>
              </div>
              <div className="bg-white/95 text-gray-900 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold mb-1">Community trust graph</h3>
                <p className="text-sm text-gray-600">Badges, helper rankings, trust score boosts, and visible contribution history.</p>
              </div>
              <div className="bg-white/95 text-gray-900 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold mb-1">100%</h3>
                <p className="text-sm text-gray-600">Top trust score currently active across the sample mentor network.</p>
              </div>
            </div>
          </HeroCard>
        </div>
      </div>

      {/* Core Flow Section */}
      <div className="mt-8">
        <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">CORE FLOW</p>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            From struggling alone to solving together
          </h2>
          <Link href="/login" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
            Try onboarding AI
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[160px]">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ask for help clearly</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[160px]">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Discover the right people</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[160px]">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track real contribution</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.
            </p>
          </div>
        </div>
      </div>
      
      {/* Featured Requests Section */}
      <div className="mt-8 pb-16">
        <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">FEATURED REQUESTS</p>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Community problems currently in motion
          </h2>
          <Link href="/explore" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
            View full feed
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock Card 1 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-medium">Web Development</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">High</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Solved</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Need help</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-3">helpn needed</p>
            </div>
            <div>
              <div className="h-px bg-gray-100 w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Ayesha Khan</p>
                  <p className="text-xs text-gray-500">Karachi • 1 helper interested</p>
                </div>
                <Link href="/login" className="text-sm font-medium border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">Open details</Link>
              </div>
            </div>
          </div>
          
          {/* Mock Card 2 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between shadow-md ring-1 ring-gray-900/5">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-medium">Web Development</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">High</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Solved</span>
              </div>
              <h3 className="font-bold text-lg mb-2 leading-snug">Need help making my portfolio responsive before demo day</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">HTML/CSS</span>
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">Responsive</span>
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">Portfolio</span>
              </div>
            </div>
            <div>
              <div className="h-px bg-gray-100 w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Sara Noor</p>
                  <p className="text-xs text-gray-500">Karachi • 1 helper interested</p>
                </div>
                <Link href="/login" className="text-sm font-medium border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">Open details</Link>
              </div>
            </div>
          </div>

          {/* Mock Card 3 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-medium">Design</span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">Medium</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Open</span>
              </div>
              <h3 className="font-bold text-lg mb-2 leading-snug">Looking for Figma feedback on a volunteer event poster</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">Figma</span>
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">Poster</span>
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">Design Review</span>
              </div>
            </div>
            <div>
              <div className="h-px bg-gray-100 w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Ayesha Khan</p>
                  <p className="text-xs text-gray-500">Lahore • 1 helper interested</p>
                </div>
                <Link href="/login" className="text-sm font-medium border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">Open details</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-sm text-gray-400 pb-8 mt-auto">
        HelpHub AI is built as a premium-feel, multi-page community support product using HTML, CSS, JavaScript, and Next.js.
      </footer>
    </div>
  );
}
