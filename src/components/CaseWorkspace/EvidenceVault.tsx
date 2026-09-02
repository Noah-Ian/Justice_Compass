import React, { useState } from 'react';
import { CaseEvidence } from '../../types';
import { FileText, Plus, CheckCircle2, Clock, AlertTriangle, Image, Paperclip, MessageSquare } from 'lucide-react';
import { caseStorage } from '../../services/caseStorage';

interface EvidenceVaultProps {
  caseId: string;
  evidence: CaseEvidence[];
  onEvidenceAdded: () => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  receipt: FileText,
  lease_contract: Paperclip,
  medical_record: FileText,
  letter_email: FileText,
  photo: Image,
  message_log: MessageSquare,
  other: FileText
};

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({ caseId, evidence, onEvidenceAdded }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<any>('receipt');
  const [description, setDescription] = useState('');
  const [significance, setSignificance] = useState('');
  const [status, setStatus] = useState<'available' | 'requested' | 'missing'>('available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    caseStorage.addEvidence(caseId, {
      title: title.trim(),
      evidenceType,
      description: description.trim(),
      significance: significance.trim() || 'Corroborating record for case facts.',
      status,
      addedBy: 'human'
    });

    setTitle('');
    setDescription('');
    setSignificance('');
    setShowAddForm(false);
    onEvidenceAdded();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Evidence Vault ({evidence.length})</h3>
          <p className="text-xs text-slate-500">
            Tangible documents, payment slips, photographic records, and contract exhibits
          </p>
        </div>
        <button
          id="btn-toggle-add-evidence"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Evidence</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900">Register New Evidence Item</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Evidence Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mobile Money 800k UGX Transfer Slip"
                className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Evidence Type</label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="receipt">Payment Receipt / Bank Slip</option>
                <option value="lease_contract">Lease / Agreement Contract</option>
                <option value="photo">Photograph / Inspection Picture</option>
                <option value="message_log">Chat / SMS / WhatsApp Log</option>
                <option value="medical_record">Medical Record / Chart</option>
                <option value="letter_email">Formal Letter / Email</option>
                <option value="other">Other Exhibit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Description of Contents *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Electronic transaction confirmation with transaction ID to landlord"
              className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Evidentiary Significance</label>
            <input
              type="text"
              value={significance}
              onChange={(e) => setSignificance(e.target.value)}
              placeholder="e.g. Proves money was received and acknowledged on move-in day"
              className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <label className="text-slate-700 font-medium">Availability Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="p-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="available">Available in Hand</option>
                <option value="requested">Requested from Third Party</option>
                <option value="missing">Missing / Searching</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-submit-evidence"
                className="px-4 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Save Evidence
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidence.length === 0 ? (
          <div className="md:col-span-2 p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            No evidence catalogued yet. Add receipts, photographs, or run the WebMCP Agent to attach exhibits.
          </div>
        ) : (
          evidence.map((item) => {
            const Icon = TYPE_ICONS[item.evidenceType] || FileText;
            const isAvailable = item.status === 'available';
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        isAvailable
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-2">{item.description}</p>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      Evidentiary Significance:
                    </span>
                    <p className="text-slate-700">{item.significance}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ref: {item.fileReference || 'Digital record'}</span>
                  <span>via {item.addedBy === 'agent_webmcp' ? 'WebMCP Agent' : 'User'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
