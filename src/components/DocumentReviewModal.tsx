import React, { useState } from 'react';
import { GeneratedDocument } from '../types';
import { ShieldCheck, AlertTriangle, Check, X, Edit3, Eye, Copy, Download } from 'lucide-react';
import { caseStorage } from '../services/caseStorage';

interface DocumentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  document: GeneratedDocument;
  onDocumentUpdated?: (updatedDoc: GeneratedDocument) => void;
}

export const DocumentReviewModal: React.FC<DocumentReviewModalProps> = ({
  isOpen,
  onClose,
  caseId,
  document,
  onDocumentUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(document.content);
  const [humanNotes, setHumanNotes] = useState(document.humanNotes || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleApprove = () => {
    const updated = caseStorage.reviewDocument(
      caseId,
      document.id,
      isEditing ? 'edited' : 'approved',
      humanNotes || 'Approved by human reviewer',
      isEditing ? editedContent : undefined
    );
    if (updated && onDocumentUpdated) onDocumentUpdated(updated);
    onClose();
  };

  const handleReject = () => {
    const updated = caseStorage.reviewDocument(
      caseId,
      document.id,
      'rejected',
      humanNotes || 'Draft rejected by user'
    );
    if (updated && onDocumentUpdated) onDocumentUpdated(updated);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = window.document.createElement('a');
    const file = new Blob([editedContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${document.title.replace(/\s+/g, '_')}.txt`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-slate-900">Human Document Review & Approval</h2>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    document.reviewStatus === 'approved'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : document.reviewStatus === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {document.reviewStatus.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Recipient: <span className="font-semibold text-slate-700">{document.recipient}</span>
              </p>
            </div>
          </div>
          <button
            id="btn-close-review-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Warning Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Consequential Action Safety Notice:</strong> Justice Compass will <strong>never</strong> automatically transmit letters or file claims on your behalf. You must review the document, edit any specific facts, approve the draft, and personally choose when and how to serve it.
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Key Assumptions Callout */}
          {document.assumptions && document.assumptions.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
              <span className="font-semibold text-slate-800 block mb-1">
                Underlying Factual Assumptions (Please Verify Before Sending):
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {document.assumptions.map((assump, i) => (
                  <li key={i}>{assump}</li>
                ))}
              </ul>
            </div>
          )}

          {/* View / Edit Mode Switcher */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {document.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                id="btn-toggle-edit-mode"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isEditing
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'Preview Mode' : 'Edit Text'}</span>
              </button>

              <button
                id="btn-copy-doc-text"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                id="btn-download-doc-txt"
                onClick={handleDownloadTxt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                title="Download as text file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Document Content */}
          {isEditing ? (
            <div>
              <textarea
                id="textarea-edit-letter"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={12}
                className="w-full text-xs font-mono p-3.5 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                You can directly personalize dates, phone numbers, payment account details, or specific clauses above.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap max-h-80 overflow-y-auto">
              {editedContent}
            </div>
          )}

          {/* Reviewer remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reviewer Remarks / Verification Notes (Optional)
            </label>
            <input
              type="text"
              id="input-human-review-notes"
              value={humanNotes}
              onChange={(e) => setHumanNotes(e.target.value)}
              placeholder="e.g., Verified bank slip dates, confirmed tenant signature matches"
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Modal Footer Review Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            id="btn-reject-document"
            onClick={handleReject}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Reject Draft</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-approve-document"
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes & Approve' : 'Approve Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
