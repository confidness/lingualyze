import React from 'react';

// Mark: three word blocks stepping toward the verb, which comes last in Kazakh (SOV) and is gold.
// Same geometry as public/favicon.svg.
export const LogoMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="#0C7A9C" />
    <rect x="6" y="6.5" width="10" height="5.5" rx="2" fill="#fff" />
    <rect x="9" y="13.25" width="14" height="5.5" rx="2" fill="#fff" />
    <rect x="16" y="20" width="10" height="5.5" rx="2" fill="#F2B705" />
  </svg>
);

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <LogoMark />
    <span className="font-display font-semibold text-[17px] tracking-tight text-slate-900 dark:text-slate-100">
      Lingualyze
    </span>
  </span>
);
