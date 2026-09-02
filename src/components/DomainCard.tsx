import React from 'react';
import { Home, HeartPulse, Users, Briefcase, ShoppingBag, Landmark } from 'lucide-react';
import { DomainArea } from '../types';

interface DomainCardProps {
  area: DomainArea;
  caseCount: number;
  isSelected?: boolean;
  onClick: () => void;
}

const DOMAIN_METADATA: Record<
  DomainArea,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    examples: string[];
    dotColor: string;
  }
> = {
  housing: {
    label: 'Housing & Tenancy',
    icon: Home,
    description: 'Security deposit refunds, unlawful eviction defense, rent notices, and repairs.',
    examples: ['Deposit Withholding (800k UGX)', 'Notice to Vacate', 'Roof Repairs'],
    dotColor: 'bg-blue-600'
  }
};

export const DomainCard: React.FC<DomainCardProps> = ({ area, caseCount, isSelected, onClick }) => {
  const meta = DOMAIN_METADATA[area];
  const Icon = meta.icon;

  return (
    <button
      id={`domain-card-${area}`}
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-full group bg-white shadow-xs ${
        isSelected
          ? 'ring-2 ring-blue-600 border-blue-600'
          : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${meta.dotColor}`} />
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/70 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {caseCount} {caseCount === 1 ? 'case' : 'cases'}
          </span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
          {meta.label}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {meta.description}
        </p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
        {meta.examples.map((ex, i) => (
          <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/80 font-medium">
            {ex}
          </span>
        ))}
      </div>
    </button>
  );
};
