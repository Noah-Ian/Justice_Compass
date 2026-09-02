import React from 'react';
import { Case } from '../../types';
import { Sparkles, AlertCircle, User, Building, Target, Calendar } from 'lucide-react';

interface CaseOverviewProps {
  caseItem: Case;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({ caseItem }) => {
  return (
    <div className="space-y-6">
      {/* AI Case Synthesis Card */}
      {caseItem.summary && (
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider">WebMCP Case Synthesis</h3>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {caseItem.summary}
          </p>
        </div>
      )}

      {/* Narrative & Desired Outcome Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Narrative */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Problem Narrative
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
            {caseItem.description}
          </p>
        </div>

        {/* Desired Outcome & Parties */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              Desired Outcome
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              {caseItem.desiredOutcome}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Identified Parties
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-medium text-slate-400 block mb-0.5">Client / Affected:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {caseItem.partiesInvolved.clientName || 'Client'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-medium text-slate-400 block mb-0.5">Opposing Entity:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-600" />
                  {caseItem.partiesInvolved.opposingPartyOrEntity || 'Opposing Party'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Information Alerts */}
      {caseItem.missingInformation && caseItem.missingInformation.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950">
          <div className="flex items-center gap-2 mb-1.5 font-bold text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Missing Information Identified for Case Strengthening:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-900 pl-1">
            {caseItem.missingInformation.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
