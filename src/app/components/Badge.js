import React from 'react';

export default function Badge({ children, variant = 'default', className = "" }) {
  const variants = {
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    primary: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-orange-100 text-orange-800 border border-orange-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
