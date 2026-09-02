import React, { useState } from 'react';
import { GeneratedDocument } from '../../types';
import { FileText, ShieldAlert, CheckCircle2, XCircle, Plus, Eye, Copy, Download } from 'lucide-react';
import { DocumentReviewModal } from '../DocumentReviewModal';
import { webMCP } from '../../webmcp';

interface DocumentsViewProps {
  caseId: string;
  documents: GeneratedDocument[];
  onDocumentUpdated: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ caseId, documents, onDocumentUpdated }) => {
  const [selectedDocForReview, setSelectedDocForReview] = useState<GeneratedDocument | null>(null);
  const [isDraftingNew, setIsDraftingNew] = useState(false);
  const [newDocType, setNewDocType] = useState<any>('demand_letter');
  const [newRecipient, setNewRecipient] = useState('');

  const handleDraftDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await webMCP.callTool('generate_letter', {
        caseId,
        documentType: newDocType,
        recipient: newRecipient || 'Opposing Party'
      });
      setIsDraftingNew(false);
      setNewRecipient('');
      onDocumentUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Draft Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Generated Draft Documents & Notices ({documents.length})</h3>
          <p className="text-xs text-slate-500">
            Formally prepared correspondence held for human verification before service
          </p>
        </div>
        <button
          id="btn-toggle-draft-doc"
          onClick={() => setIsDraftingNew(!isDraftingNew)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Draft New Letter</span>
        </button>
      </div>

      {/* Inline New Draft Creator */}
      {isDraftingNew && (
        <form onSubmit={handleDraftDocument} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900">Draft New Document via WebMCP Tool</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Document Type</label>
              <select
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="demand_letter">Formal Demand Letter</option>
                <option value="clarification_request">Clarification & Records Request</option>
                <option value="formal_complaint">Formal Complaint / Grievance</option>
                <option value="records_request">Official Records Access Request</option>
                <option value="meeting_agenda">Mediation Meeting Notice</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Recipient Name & Title</label>
              <input
                type="text"
                required
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="e.g. Mr. Patrick Byaruhanga (Landlord)"
                className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDraftingNew(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-generate-draft-submit"
              className="px-4 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Draft Document (WebMCP)
            </button>
          </div>
        </form>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            No draft documents created yet. Run the WebMCP Agent Workflow or click "Draft New Letter" above.
          </div>
        ) : (
          documents.map((doc) => {
            const isPending = doc.reviewStatus === 'pending_review';
            const isApproved = doc.reviewStatus === 'approved' || doc.reviewStatus === 'edited';
            const isRejected = doc.reviewStatus === 'rejected';

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-colors flex flex-col justify-between text-xs space-y-4 relative overflow-hidden ${
                  isPending ? 'border-blue-200 bg-blue-50/10' : 'border-slate-200'
                }`}
              >
                {isPending && (
                  <div className="absolute top-0 right-0 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-lg">
                    Draft Pending Review
                  </div>
                )}

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          Recipient: <span className="font-semibold text-slate-700">{doc.recipient}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                          isPending
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : isApproved
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {isPending ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        ) : isApproved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        {doc.reviewStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Document excerpt preview */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-700 max-h-32 overflow-hidden relative">
                    <div className="whitespace-pre-wrap">{doc.content.slice(0, 350)}...</div>
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
                  </div>

                  {/* Review status note */}
                  {doc.humanNotes && (
                    <div className="mt-2 text-[11px] text-slate-600 bg-slate-100/70 p-2 rounded-lg">
                      <strong>Reviewer Note:</strong> {doc.humanNotes}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Drafted {new Date(doc.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-review-doc-${doc.id}`}
                      onClick={() => setSelectedDocForReview(doc)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isPending ? 'Review & Approve Draft' : 'View / Edit Letter'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {selectedDocForReview && (
        <DocumentReviewModal
          isOpen={true}
          onClose={() => setSelectedDocForReview(null)}
          caseId={caseId}
          document={selectedDocForReview}
          onDocumentUpdated={() => {
            setSelectedDocForReview(null);
            onDocumentUpdated();
          }}
        />
      )}
    </div>
  );
};
