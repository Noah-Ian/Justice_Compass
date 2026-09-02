import React, { useState, useEffect } from 'react';
import { Case, GeneratedDocument } from '../types';
import { caseStorage } from '../services/caseStorage';
import { CaseOverview } from '../components/CaseWorkspace/CaseOverview';
import { FactsList } from '../components/CaseWorkspace/FactsList';
import { EvidenceVault } from '../components/CaseWorkspace/EvidenceVault';
import { KnowledgeSources } from '../components/CaseWorkspace/KnowledgeSources';
import { ActionPlanView } from '../components/CaseWorkspace/ActionPlanView';
import { DocumentsView } from '../components/CaseWorkspace/DocumentsView';
import { DocumentReviewModal } from '../components/DocumentReviewModal';
import {
  ArrowLeft,
  ShieldAlert,
  FileText,
  CheckCircle2,
  ListTodo,
  Paperclip,
  BookOpen,
  LayoutDashboard,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseId, onBack }) => {
  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'facts' | 'evidence' | 'plan' | 'documents' | 'sources'>('overview');
  const [reviewModalDoc, setReviewModalDoc] = useState<GeneratedDocument | null>(null);

  const reloadCase = () => {
    const c = caseStorage.getCase(caseId);
    setCaseItem(c || null);
  };

  useEffect(() => {
    reloadCase();
    const unsubscribe = caseStorage.subscribe(reloadCase);
    return unsubscribe;
  }, [caseId]);

  if (!caseItem) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-4">
        <p>Case not found or has been removed.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white"
        >
          Return to Cases
        </button>
      </div>
    );
  }

  const pendingDoc = caseItem.documents.find((d) => d.reviewStatus === 'pending_review');

  return (
    <div className="space-y-6">
      {/* Top breadcrumb & back button */}
      <div className="flex items-center justify-between">
        <button
          id="btn-case-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Cases</span>
        </button>

        <span className="text-xs font-mono text-slate-400">ID: {caseItem.id}</span>
      </div>

      {/* Case Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 capitalize">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {caseItem.disputeCategory ? caseItem.disputeCategory.replace(/_/g, ' ') : 'Tenancy Dispute'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {caseItem.jurisdiction}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-600">
              Issue: <strong className="text-slate-800">{caseItem.issueType}</strong>
            </span>
          </div>

          <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto capitalize">
            Status: {caseItem.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{caseItem.title}</h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-4xl">
            {caseItem.description}
          </p>
        </div>

        {/* Pending Human Review Notification Bar */}
        {pendingDoc && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold text-amber-950">Action Required:</strong>{' '}
                <span>
                  The draft "{pendingDoc.title}" is in <strong>pending_review</strong>. Consequential legal notice requires your human verification and approval.
                </span>
              </div>
            </div>

            <button
              id="btn-header-review-now"
              onClick={() => setReviewModalDoc(pendingDoc)}
              className="px-3.5 py-1.5 rounded-lg font-semibold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors shrink-0"
            >
              Review Draft Now
            </button>
          </div>
        )}
      </div>

      {/* Case Workspace Navigation Tabs - Clean Utility */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-medium text-slate-500">
        <button
          id="tab-case-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          id="tab-case-facts"
          onClick={() => setActiveTab('facts')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'facts'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Facts & Timeline</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
            activeTab === 'facts' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {caseItem.facts.length}
          </span>
        </button>

        <button
          id="tab-case-evidence"
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'evidence'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Paperclip className="w-4 h-4" />
          <span>Evidence Vault</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
            activeTab === 'evidence' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {caseItem.evidence.length}
          </span>
        </button>

        <button
          id="tab-case-plan"
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'plan'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Action Plan</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
            activeTab === 'plan' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {caseItem.actionPlan.length}
          </span>
        </button>

        <button
          id="tab-case-documents"
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'documents'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Draft Documents</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
            pendingDoc
              ? 'bg-amber-100 text-amber-800'
              : activeTab === 'documents'
              ? 'bg-blue-700 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}>
            {caseItem.documents.length}
          </span>
        </button>

        <button
          id="tab-case-sources"
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'sources'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Knowledge & Sources</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && <CaseOverview caseItem={caseItem} />}
      {activeTab === 'facts' && (
        <FactsList caseId={caseItem.id} facts={caseItem.facts} onFactAdded={reloadCase} />
      )}
      {activeTab === 'evidence' && (
        <EvidenceVault caseId={caseItem.id} evidence={caseItem.evidence} onEvidenceAdded={reloadCase} />
      )}
      {activeTab === 'plan' && (
        <ActionPlanView caseId={caseItem.id} actionPlan={caseItem.actionPlan} onPlanUpdated={reloadCase} />
      )}
      {activeTab === 'documents' && (
        <DocumentsView caseId={caseItem.id} documents={caseItem.documents} onDocumentUpdated={reloadCase} />
      )}
      {activeTab === 'sources' && (
        <KnowledgeSources sourceIds={caseItem.relevantSourceIds} area={caseItem.area} />
      )}

      {/* Dedicated Review Modal when triggered */}
      {reviewModalDoc && (
        <DocumentReviewModal
          isOpen={true}
          onClose={() => setReviewModalDoc(null)}
          caseId={caseItem.id}
          document={reviewModalDoc}
          onDocumentUpdated={() => {
            setReviewModalDoc(null);
            reloadCase();
          }}
        />
      )}
    </div>
  );
};
