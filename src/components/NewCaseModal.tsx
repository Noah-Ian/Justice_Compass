import React, { useState } from 'react';
import { X, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { DomainArea } from '../types';
import { caseStorage } from '../services/caseStorage';
import { webMCP } from '../webmcp';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (caseId: string) => void;
  preselectedArea?: DomainArea;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
  preselectedArea
}) => {
  const [problemDescription, setProblemDescription] = useState('');
  const [isTriageRunning, setIsTriageRunning] = useState(false);
  const [title, setTitle] = useState('');
  const [area] = useState<DomainArea>('housing');
  const [disputeCategory, setDisputeCategory] = useState<'security_deposit' | 'eviction_defense' | 'repairs_habitability' | 'lockouts_utilities' | 'rent_increase' | 'lease_agreement'>('security_deposit');
  const [issueType, setIssueType] = useState('Security Deposit Dispute');
  const [jurisdiction, setJurisdiction] = useState('Uganda');
  const [clientName, setClientName] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');

  if (!isOpen) return null;

  const handleQuickTriage = async () => {
    if (!problemDescription.trim()) return;
    setIsTriageRunning(true);
    try {
      const result = await webMCP.callTool('classify_problem_area', {
        text: problemDescription,
        jurisdictionHint: jurisdiction
      });
      if (result.disputeCategory) {
        setDisputeCategory(result.disputeCategory);
      }
      setIssueType(result.detectedIssueType);
      if (!title) {
        setTitle(`${result.detectedIssueType} Case`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriageRunning(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCase = caseStorage.saveCase({
      id: `case-housing-${Date.now().toString().slice(-5)}`,
      title: title.trim(),
      area: 'housing',
      disputeCategory,
      issueType: issueType.trim() || 'Landlord-Tenant Dispute',
      description: problemDescription.trim() || 'New landlord dispute case created by user.',
      jurisdiction: jurisdiction.trim() || 'Uganda',
      status: 'intake',
      partiesInvolved: {
        clientName: clientName.trim() || 'Tenant',
        opposingPartyOrEntity: opposingParty.trim() || 'Landlord / Property Manager',
        relationship: 'Tenancy matter'
      },
      desiredOutcome: desiredOutcome.trim() || 'Fair and lawful resolution under Landlord and Tenant Act (2022).',
      facts: [],
      evidence: [],
      relevantSourceIds: [],
      missingInformation: [],
      actionPlan: [
        {
          id: `step-${Date.now()}-1`,
          stepNumber: 1,
          title: 'Document Key Tenancy Facts & Timeline',
          description: 'Record specific dates, payment confirmations, and communications with landlord.',
          requiresHumanAction: true,
          isConsequential: false,
          completed: false
        }
      ],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    onCaseCreated(newCase.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Start New Case Workspace</h2>
              <p className="text-xs text-slate-500">
                Organize an everyday problem into verifiable facts, evidence, and clear next steps
              </p>
            </div>
          </div>
          <button
            id="btn-close-new-case-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Quick AI Triage Prompt */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800">
                Describe Your Problem (Optional AI Auto-Classification)
              </label>
              <button
                type="button"
                id="btn-run-triage-helper"
                onClick={handleQuickTriage}
                disabled={isTriageRunning || !problemDescription.trim()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTriageRunning ? 'Classifying...' : 'Auto-Classify (WebMCP)'}</span>
              </button>
            </div>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              rows={2}
              placeholder="e.g. My landlord refuses to refund my 800,000 UGX security deposit after I moved out on August 1st..."
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Case Title *</label>
            <input
              type="text"
              required
              id="input-new-case-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Security Deposit Recovery - Plot 14 Kira Road"
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dispute Category *</label>
              <select
                id="select-new-case-category"
                value={disputeCategory}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setDisputeCategory(val);
                  if (val === 'security_deposit') setIssueType('Security Deposit Withholding');
                  else if (val === 'eviction_defense') setIssueType('Unlawful Eviction Notice / Lockout');
                  else if (val === 'repairs_habitability') setIssueType('Habitability & Structural Repairs');
                  else if (val === 'rent_increase') setIssueType('Unlawful Rent Increase');
                  else setIssueType('Tenancy Dispute');
                }}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="security_deposit">Security Deposit Withholding</option>
                <option value="eviction_defense">Unlawful Eviction & Lockout</option>
                <option value="repairs_habitability">Habitability & Roof/Water Repairs</option>
                <option value="rent_increase">Illegal Rent Increase</option>
                <option value="lease_agreement">Tenancy Agreement Breach</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Type *</label>
              <input
                type="text"
                required
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                placeholder="e.g. Security Deposit Dispute"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jurisdiction</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="e.g. Uganda"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name / Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Faith Nakato"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opposing Entity / Organization</label>
              <input
                type="text"
                value={opposingParty}
                onChange={(e) => setOpposingParty(e.target.value)}
                placeholder="e.g. Mr. Patrick Byaruhanga (Landlord)"
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Desired Outcome</label>
            <input
              type="text"
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="e.g. Full refund of 800,000 UGX deposit or itemized deduction receipts within 14 days"
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-create-case-submit"
              className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              Create Case Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
