import React, { useState } from 'react';
import { AlertCircle, ShieldCheck, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Legal advisory notice" className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-950">General Information & Organizational Assistance:</strong>{' '}
            Justice Compass provides organizational legal information, not legal representation. All generated drafts and action plans require human review and discretion.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3.5 h-3.5" />
            Human in the Loop
          </span>
          <button
            id="btn-dismiss-disclaimer"
            onClick={() => setDismissed(true)}
            className="text-amber-700 hover:text-amber-950 p-1 rounded transition-colors"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
