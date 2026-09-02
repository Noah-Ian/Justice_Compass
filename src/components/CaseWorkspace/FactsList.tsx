import React, { useState } from 'react';
import { CaseFact } from '../../types';
import { CheckCircle2, AlertCircle, Plus, Calendar, UserCheck, Tag } from 'lucide-react';
import { caseStorage } from '../../services/caseStorage';

interface FactsListProps {
  caseId: string;
  facts: CaseFact[];
  onFactAdded: () => void;
}

export const FactsList: React.FC<FactsListProps> = ({ caseId, facts, onFactAdded }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [statement, setStatement] = useState('');
  const [date, setDate] = useState('');
  const [sourceOrWitness, setSourceOrWitness] = useState('');
  const [category, setCategory] = useState<'timeline' | 'financial' | 'communication' | 'condition' | 'general'>('general');
  const [verified, setVerified] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;

    caseStorage.addFact(caseId, {
      statement: statement.trim(),
      date: date || undefined,
      sourceOrWitness: sourceOrWitness || 'Human recorded fact',
      category,
      verified,
      addedBy: 'human'
    });

    setStatement('');
    setDate('');
    setSourceOrWitness('');
    setShowAddForm(false);
    onFactAdded();
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Fact Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Factual Ledger & Timeline ({facts.length})</h3>
          <p className="text-xs text-slate-500">
            Chronological, verifiable assertions separated into documented facts versus unconfirmed statements
          </p>
        </div>
        <button
          id="btn-toggle-add-fact"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fact</span>
        </button>
      </div>

      {/* Inline Add Fact Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900">Record New Case Fact</h4>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Factual Statement *</label>
            <input
              type="text"
              id="input-fact-statement"
              required
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. Paid 800,000 UGX security deposit via Mobile Money on August 1st."
              className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Source / Witness</label>
              <input
                type="text"
                value={sourceOrWitness}
                onChange={(e) => setSourceOrWitness(e.target.value)}
                placeholder="e.g. Caretaker signed slip"
                className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="timeline">Timeline</option>
                <option value="financial">Financial</option>
                <option value="communication">Communication</option>
                <option value="condition">Condition</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 font-medium">Corroborated by written receipt or document</span>
            </label>

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
                id="btn-submit-fact"
                className="px-4 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Save Fact
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Facts Timeline List */}
      <div className="space-y-2.5">
        {facts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            No facts recorded yet. Click "Add Fact" or run the WebMCP Agent Workflow to organize facts automatically.
          </div>
        ) : (
          facts.map((fact, index) => (
            <div
              key={fact.id}
              className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:border-slate-300 transition-colors flex items-start justify-between gap-4 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-bold mt-0.5 shrink-0 border border-blue-100">
                  {index + 1}
                </div>

                <div className="space-y-1">
                  <p className="text-slate-900 font-medium leading-relaxed">{fact.statement}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    {fact.date && (
                      <span className="flex items-center gap-1 font-mono text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {fact.date}
                      </span>
                    )}
                    {fact.sourceOrWitness && (
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        Source: <span className="font-semibold text-slate-700">{fact.sourceOrWitness}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span className="capitalize">{fact.category}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      via {fact.addedBy === 'agent_webmcp' ? 'WebMCP Agent' : 'Human'}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  fact.verified
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {fact.verified ? 'Verified' : 'Claim'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
