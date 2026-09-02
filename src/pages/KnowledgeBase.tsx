import React, { useState } from 'react';
import { INFORMATION_SOURCES } from '../data/informationSources';
import { DomainArea } from '../types';
import { Search, BookOpen, CheckCircle2, PhoneCall, Plus, ExternalLink, ShieldCheck } from 'lucide-react';

interface KnowledgeBaseProps {
  onStartCaseInDomain: (domain: DomainArea) => void;
}

const TENANCY_TOPICS = [
  { id: 'all', label: 'All Statutory Topics' },
  { id: 'deposit', label: 'Security Deposits' },
  { id: 'eviction', label: 'Eviction Protection' },
  { id: 'repairs', label: 'Habitability & Repairs' },
  { id: 'lockout', label: 'Illegal Lockouts' },
  { id: 'rent', label: 'Rent Increases' },
  { id: 'mediation', label: 'LC1 Mediation' }
];

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onStartCaseInDomain }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = INFORMATION_SOURCES.filter((src) => {
    let matchesTopic = true;
    if (selectedTopic === 'deposit') {
      matchesTopic = src.keywords.some(k => k.includes('deposit') || k.includes('refund'));
    } else if (selectedTopic === 'eviction') {
      matchesTopic = src.keywords.some(k => k.includes('eviction') || k.includes('notice to vacate'));
    } else if (selectedTopic === 'repairs') {
      matchesTopic = src.keywords.some(k => k.includes('repairs') || k.includes('habitability'));
    } else if (selectedTopic === 'lockout') {
      matchesTopic = src.keywords.some(k => k.includes('lockout') || k.includes('utilities') || k.includes('padlock'));
    } else if (selectedTopic === 'rent') {
      matchesTopic = src.keywords.some(k => k.includes('rent increase') || k.includes('distress for rent'));
    } else if (selectedTopic === 'mediation') {
      matchesTopic = src.keywords.some(k => k.includes('mediation') || k.includes('lc1'));
    }

    const matchesQuery =
      src.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.source.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory & Dispute Guidance Registry</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Landlord & Tenant Statutory Knowledge Base
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          The verified legal guidance powering the WebMCP <code>search_information</code> tool. Every tenancy notice and action plan synthesized by Justice Compass is grounded in the Uganda Landlord and Tenant Act (2022), Local Council Courts Act (2006), and verified judicial procedures.
        </p>

        {/* Filters */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {TENANCY_TOPICS.map((t) => (
              <button
                key={t.id}
                id={`btn-kb-filter-${t.id}`}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedTopic === t.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search statutes or topics..."
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Grid of Knowledge Sources */}
      <div className="space-y-4">
        {filtered.map((src) => (
          <article
            key={src.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                    {src.area}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {src.jurisdiction}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] font-medium text-slate-600">
                    Topic: <strong>{src.topic}</strong>
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{src.title}</h3>
              </div>

              <button
                id={`btn-kb-start-case-${src.id}`}
                onClick={() => onStartCaseInDomain(src.area)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start Case Here</span>
              </button>
            </div>

            <p className="text-slate-700 leading-relaxed font-sans">{src.summary}</p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-700">
              <BookOpen className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-slate-900">Legal / Regulatory Citation:</strong>{' '}
                <span>{src.source}</span>
              </div>
            </div>

            {src.recommendedSteps && (
              <div>
                <span className="font-bold text-slate-800 block mb-2">Procedural Guidance Steps:</span>
                <ul className="space-y-1.5 pl-1">
                  {src.recommendedSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {src.authorityOrContact && (
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    <strong>Competent Public Body:</strong> {src.authorityOrContact.name} ({src.authorityOrContact.role})
                  </span>
                </div>
                {src.authorityOrContact.contact && (
                  <span className="font-mono text-slate-500">{src.authorityOrContact.contact}</span>
                )}
              </div>
            )}
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-white">
            No knowledge records found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
