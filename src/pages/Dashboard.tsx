import React, { useState } from 'react';
import { Case, DomainArea } from '../types';
import { CaseCard } from '../components/CaseCard';
import {
  Play,
  Sparkles,
  Plus,
  Search,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Home,
  ShieldAlert,
  Wrench,
  TrendingUp,
  Scale,
  Lock
} from 'lucide-react';

interface DashboardProps {
  cases: Case[];
  onOpenCase: (caseId: string) => void;
  onOpenNewCase: (area?: DomainArea) => void;
  onOpenAgentDemo: () => void;
  onSelectTab: (tab: any) => void;
}

interface TenancyCategoryMeta {
  id: string;
  label: string;
  statute: string;
  description: string;
  examples: string[];
  icon: React.ComponentType<{ className?: string }>;
  dotColor: string;
}

const TENANCY_CATEGORIES: TenancyCategoryMeta[] = [
  {
    id: 'security_deposit',
    label: 'Security Deposit Recovery',
    statute: 'Section 29, Landlord & Tenant Act 2022',
    description: 'Refund demands, itemized deduction challenges, 30-day return enforcement, and wear-and-tear verification.',
    examples: ['800k UGX Withheld', 'Unsubstantiated Painting Costs', 'Move-Out Inspection'],
    icon: Home,
    dotColor: 'bg-blue-600'
  },
  {
    id: 'eviction_defense',
    label: 'Unlawful Eviction Defense',
    statute: 'Sections 38 & 49, Landlord & Tenant Act 2022',
    description: 'Defense against abrupt 7-day or 24-hour notices, extrajudicial lockouts, padlocking, and utility disconnections.',
    examples: ['7-Day Notice Rejection', 'Criminal Lockout Warning', 'LC1 Injunction Filing'],
    icon: ShieldAlert,
    dotColor: 'bg-rose-600'
  },
  {
    id: 'repairs_habitability',
    label: 'Habitability & Structural Repairs',
    statute: 'Sections 11–13, Landlord & Tenant Act 2022',
    description: 'Enforcing statutory landlord duty to repair leaking roofs, exterior walls, plumbing, and structural electrical hazards.',
    examples: ['Roof Water Penetration', '14-Day Notice to Cure', 'Repair-and-Deduct Orders'],
    icon: Wrench,
    dotColor: 'bg-amber-600'
  },
  {
    id: 'rent_increase',
    label: 'Illegal Rent Increases',
    statute: 'Sections 26–28, Landlord & Tenant Act 2022',
    description: 'Challenging arbitrary rent hikes without mandatory 90-day written notice or violating statutory currency requirements.',
    examples: ['No 90-Day Notice', 'Arbitrary Rent Hikes', 'Foreign Currency Demands'],
    icon: TrendingUp,
    dotColor: 'bg-emerald-600'
  },
  {
    id: 'distress_for_rent',
    label: 'Distress for Rent & Seizures',
    statute: 'Section 47, Landlord & Tenant Act 2022',
    description: 'Protection against illegal confiscation or impounding of tenant personal belongings, furniture, or equipment without warrant.',
    examples: ['Illegal Belongings Confiscation', 'Unauthorized Bailiff Entry', 'Police Reporting'],
    icon: Lock,
    dotColor: 'bg-purple-600'
  },
  {
    id: 'mediation',
    label: 'LC1 Mediation & Settlement',
    statute: 'Local Council Courts Act 2006',
    description: 'Facilitating village-level mediation, documented amicable settlements, and magistrate court referral dossiers.',
    examples: ['LC1 Village Petitions', 'Binding Settlement Minutes', 'Magistrate Court Referral'],
    icon: Scale,
    dotColor: 'bg-slate-700'
  }
];

export const Dashboard: React.FC<DashboardProps> = ({
  cases,
  onOpenCase,
  onOpenNewCase,
  onOpenAgentDemo,
  onSelectTab
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingReviewCount = cases.reduce(
    (acc, c) => acc + c.documents.filter((d) => d.reviewStatus === 'pending_review').length,
    0
  );

  const filteredCases = cases.filter((c) => {
    let matchesCategory = true;
    if (selectedCategoryFilter !== 'all') {
      matchesCategory =
        c.disputeCategory === selectedCategoryFilter ||
        (selectedCategoryFilter === 'security_deposit' && c.issueType.toLowerCase().includes('deposit')) ||
        (selectedCategoryFilter === 'eviction_defense' && c.issueType.toLowerCase().includes('eviction')) ||
        (selectedCategoryFilter === 'repairs_habitability' && c.issueType.toLowerCase().includes('repair')) ||
        (selectedCategoryFilter === 'rent_increase' && c.issueType.toLowerCase().includes('rent')) ||
        (selectedCategoryFilter === 'distress_for_rent' && c.issueType.toLowerCase().includes('seizure')) ||
        (selectedCategoryFilter === 'mediation' && c.issueType.toLowerCase().includes('mediation'));
    }

    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner: WebMCP Challenge Spotlight & Instant Benchmark Runner */}
      <div className="hidden">
        <div className="max-w-3xl space-y-3.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/80 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WebMCP Challenge 2026 — Tenancy Dispute Navigator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Turn Landlord–Tenant Disputes Into Organized, Actionable Cases.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Justice Compass equips autonomous AI agents with structured WebMCP tools to categorize tenancy disputes, verify statutory protections under the Landlord and Tenant Act (2022), build evidence vaults, and draft formal notices — while keeping tenants firmly in control of all consequential actions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="btn-hero-run-demo"
              onClick={onOpenAgentDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Tenancy Agent Benchmark (800k Deposit)</span>
            </button>

            <button
              id="btn-hero-new-case"
              onClick={() => onOpenNewCase()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Start Tenancy Case</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative grid/glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Land & Tenant Matters</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Start a case workspace</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">Create one focused workspace for a land or tenant dispute, then organize the facts, evidence, and next steps.</p>
        </div>
        <button id="btn-start-workspace" onClick={() => onOpenNewCase()} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors shrink-0">
          <Plus className="w-4 h-4" />
          <span>Start new case</span>
        </button>
      </div>

      {/* Metrics Row - Clean Utility */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tenancy Disputes</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{cases.length}</span>
            <span className="text-xs text-slate-400">active case dossiers</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending Human Review</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${pendingReviewCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingReviewCount}
            </span>
            <span className="text-xs text-slate-400">drafts requiring sign-off</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">WebMCP Tenancy Tools</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">14</span>
            <span className="text-xs text-slate-400">browser JSON-RPC tools</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Human Safeguard Gate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">100%</span>
            <span className="text-xs text-slate-400">zero auto-transmissions</span>
          </div>
        </div>
      </div>

      {/* Tenancy Dispute Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tenancy Dispute Categories</h2>
            <p className="text-xs text-slate-600">
              Filter cases or launch a new case workspace tailored to specific statutory provisions
            </p>
          </div>
          {selectedCategoryFilter !== 'all' && (
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear Filter (Show All)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TENANCY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = cases.filter((c) => {
              return (
                c.disputeCategory === cat.id ||
                (cat.id === 'security_deposit' && c.issueType.toLowerCase().includes('deposit')) ||
                (cat.id === 'eviction_defense' && c.issueType.toLowerCase().includes('eviction')) ||
                (cat.id === 'repairs_habitability' && c.issueType.toLowerCase().includes('repair')) ||
                (cat.id === 'rent_increase' && c.issueType.toLowerCase().includes('rent')) ||
                (cat.id === 'distress_for_rent' && c.issueType.toLowerCase().includes('seizure')) ||
                (cat.id === 'mediation' && c.issueType.toLowerCase().includes('mediation'))
              );
            }).length;
            const isSelected = selectedCategoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                id={`tenancy-category-${cat.id}`}
                onClick={() => setSelectedCategoryFilter(isSelected ? 'all' : cat.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-full group bg-white shadow-xs ${
                  isSelected
                    ? 'ring-2 ring-blue-600 border-blue-600'
                    : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                      <div className="p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/70 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {count} {count === 1 ? 'case' : 'cases'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.label}
                  </h3>
                  <div className="text-[10px] font-semibold text-blue-600 mb-1.5">
                    {cat.statute}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap gap-1">
                  {cat.examples.slice(0, 2).map((ex, i) => (
                    <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60">
                      {ex}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cases List Section with Search & Filter */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Case Workspaces</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredCases.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Structured repositories containing factual ledgers, evidence items, and pending notices
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases or issues..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-56"
              />
            </div>

            <button
              id="btn-dashboard-new-case"
              onClick={() => onOpenNewCase()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Case</span>
            </button>
          </div>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} onOpen={() => onOpenCase(c.id)} />
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-white space-y-3">
            <p>No cases found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Protocol & Verification Callout */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Technical Inspection & WebMCP Verification</h3>
            <p className="text-xs text-slate-500">
              Directly review the 14 registered tools, JSON Schema parameters, live execution telemetry, or invoke tools manually.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('inspector')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 shadow-sm"
        >
          <span>Open WebMCP Inspector</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
