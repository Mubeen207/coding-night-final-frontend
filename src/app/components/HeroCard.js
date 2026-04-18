import React from 'react';

export default function HeroCard({ label, title, description, children, className = "" }) {
  return (
    <div className={`bg-brand-dark text-white rounded-[2rem] p-10 md:p-14 shadow-lg ${className}`}>
      {label && <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4">{label}</p>}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">{title}</h1>
      {description && <p className="text-gray-300 text-lg max-w-xl leading-relaxed">{description}</p>}
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
