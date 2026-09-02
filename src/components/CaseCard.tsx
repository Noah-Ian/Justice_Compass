import React from 'react';
import { ChevronRight, FileText, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { Case, CaseStatus, DomainArea } from '../types';

interface CaseCardProps {
  caseItem: Case;
  onOpen: () => void;
}

const STATUS_CONFIG: Record<
  CaseStatus,
  { label: string; colorClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  intake: {
    label: 'Initial Intake',
    colorClass: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: Clock
  },
  gathering_facts: {
    label: 'Gathering Facts',
    colorClass: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Clock
  },
  evidence_review: {
    label: 'Evidence Review',
    colorClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    icon: FileText
  },
  drafting: {
    label: 'Drafting Guidance',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Clock
  },
  pending_human_review: {
    label: 'Needs Human Review',
    colorClass: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
    icon: ShieldAlert
  },
  action_ready: {
    label: 'Action Ready',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    icon: CheckCircle2
  },
  closed: {
    label: 'Resolved / Closed',
    colorClass: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: CheckCircle2
  }
};

const AREA_BADGES: Record<DomainArea, { label: string; badgeClass: string; dotClass: string }> = {
  housing: { label: 'Housing & Tenancy', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200', dotClass: 'bg-blue-600' }
};

export const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onOpen }) => {
  const statusCfg = STATUS_CONFIG[caseItem.status] || STATUS_CONFIG.intake;
  const areaBadge = AREA_BADGES[caseItem.area] || { label: caseItem.area, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200', dotClass: 'bg-slate-400' };
  const StatusIcon = statusCfg.icon;

  const hasPendingDocs = caseItem.documents.some((d) => d.reviewStatus === 'pending_review');
  const completedSteps = caseItem.actionPlan.filter((s) => s.completed).length;

  return (
    <article
      id={`case-card-${caseItem.id}`}
      onClick={onOpen}
      className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Header row with badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border bg-blue-50 text-blue-700 border-blue-200 capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              {caseItem.disputeCategory
                ? caseItem.disputeCategory.replace(/_/g, ' ')
                : 'Tenancy Dispute'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {caseItem.jurisdiction}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusCfg.colorClass}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </span>
        </div>

        {/* Title & issue type */}
        <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
          {caseItem.title}
        </h3>
        <p className="text-xs font-medium text-slate-500 mb-2">
          Issue: <span className="text-slate-700 font-semibold">{caseItem.issueType}</span>
        </p>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {caseItem.description}
        </p>

        {/* Pending human review alert */}
        {hasPendingDocs && (
          <div className="mb-4 bg-amber-50/80 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium text-[11px]">1 document draft pending human review & approval</span>
          </div>
        )}
      </div>

      {/* Footer stats and open button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2.5 text-[11px]">
          <span title="Documented facts">
            <strong className="text-slate-700 font-semibold">{caseItem.facts.length}</strong> facts
          </span>
          <span className="text-slate-300">•</span>
          <span title="Tangible evidence items">
            <strong className="text-slate-700 font-semibold">{caseItem.evidence.length}</strong> evidence
          </span>
          {caseItem.documents.length > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span title="Draft documents">
                <strong className="text-slate-700 font-semibold">{caseItem.documents.length}</strong> doc
              </span>
            </>
          )}
        </div>

        <button
          id={`btn-open-case-${caseItem.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="inline-flex items-center gap-1 font-semibold text-xs text-blue-600 group-hover:text-blue-700 transition-colors"
        >
          Open Case
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
};
