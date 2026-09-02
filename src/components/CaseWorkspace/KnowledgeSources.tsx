import React from 'react';
import { InformationSource } from '../../types';
import { BookOpen, ShieldCheck, CheckCircle2, PhoneCall, ExternalLink } from 'lucide-react';
import { INFORMATION_SOURCES } from '../../data/informationSources';

interface KnowledgeSourcesProps {
  sourceIds: string[];
  area: string;
}

export const KnowledgeSources: React.FC<KnowledgeSourcesProps> = ({ sourceIds, area }) => {
  // Find linked sources or fallback to area-matching sources
  let matched = INFORMATION_SOURCES.filter((s) => sourceIds.includes(s.id));
  if (matched.length === 0) {
    matched = INFORMATION_SOURCES.filter((s) => s.area === area);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Verified Knowledge & Statutory Guidelines ({matched.length})</h3>
        <p className="text-xs text-slate-500">
          Official statutory references, patient charters, and public-service regulations grounding this case
        </p>
      </div>

      <div className="space-y-4">
        {matched.map((src) => (
          <div
            key={src.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3.5 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200">
                    {src.sourceType.replace('-', ' ')}
                  </span>
                  <span className="font-medium text-slate-500 text-[11px]">{src.jurisdiction}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{src.title}</h4>
              </div>

              <div className="text-[11px] text-slate-500 shrink-0 font-medium">
                Topic: <span className="text-slate-800">{src.topic}</span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-slate-600 leading-relaxed">{src.summary}</p>

            {/* Citation */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-800">Authentic Citation:</strong> {src.source}
              </div>
            </div>

            {/* Recommended Steps if present */}
            {src.recommendedSteps && src.recommendedSteps.length > 0 && (
              <div>
                <span className="font-bold text-slate-800 block mb-2">Statutory Guidance Checklist:</span>
                <ul className="space-y-1.5 pl-1">
                  {src.recommendedSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Authority / Support Contact */}
            {src.authorityOrContact && (
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    <strong>Competent Authority:</strong> {src.authorityOrContact.name} ({src.authorityOrContact.role})
                  </span>
                </div>
                {src.authorityOrContact.contact && (
                  <span className="text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{src.authorityOrContact.contact}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
