import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, AlertCircle, Terminal, FileText, ChevronRight, X, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { SAMPLE_PROMPTS, SamplePrompt } from '../data/samplePrompts';
import { executeAgentWorkflow, WorkflowStepProgress } from '../services/agentWorkflow';

interface AgentDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCase: (caseId: string) => void;
}

export const AgentDemoModal: React.FC<AgentDemoModalProps> = ({ isOpen, onClose, onOpenCase }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<SamplePrompt>(SAMPLE_PROMPTS[0]);
  const [customText, setCustomText] = useState(SAMPLE_PROMPTS[0].problemText);
  const [clientName, setClientName] = useState('Faith Nakato');
  const [opposingParty, setOpposingParty] = useState('Mr. Patrick Byaruhanga (Landlord)');
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<WorkflowStepProgress[]>([]);
  const [completedCaseId, setCompletedCaseId] = useState<string | null>(null);
  const [activeStepInspector, setActiveStepInspector] = useState<WorkflowStepProgress | null>(null);

  if (!isOpen) return null;

  const handleSelectPrompt = (prompt: SamplePrompt) => {
    setSelectedPrompt(prompt);
    setCustomText(prompt.problemText);
    setClientName(prompt.clientName);
    setOpposingParty(prompt.opposingParty);
  };

  const handleStartWorkflow = async () => {
    setIsRunning(true);
    setCompletedCaseId(null);
    setSteps([]);
    setActiveStepInspector(null);

    try {
      const result = await executeAgentWorkflow({
        promptText: customText,
        clientName,
        opposingParty,
        jurisdiction: selectedPrompt.suggestedJurisdiction,
        delayMs: 400,
        onStepUpdate: (currStep, allSteps) => {
          setSteps([...allSteps]);
        }
      });
      setCompletedCaseId(result.caseId);
    } catch (err) {
      console.error('Workflow error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-slate-900">WebMCP Agent Workflow Simulator</h2>
                <span className="text-[10px] font-mono font-semibold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  Live Execution
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Observe an AI agent operate Justice Compass landlord-tenant dispute tools via WebMCP
              </p>
            </div>
          </div>
          <button
            id="btn-close-demo-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Prompt Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              1. Choose a Benchmark Tenancy Scenario
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_PROMPTS.map((p) => {
                const isSelected = selectedPrompt.id === p.id;
                const categoryLabel =
                  p.category === 'security_deposit'
                    ? 'Security Deposit'
                    : p.category === 'eviction_defense'
                    ? 'Eviction Defense'
                    : 'Repairs & Habitability';
                return (
                  <button
                    key={p.id}
                    id={`btn-sample-prompt-${p.id}`}
                    onClick={() => handleSelectPrompt(p)}
                    disabled={isRunning}
                    className={`text-left p-3 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-slate-900 font-medium'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="capitalize font-bold text-slate-900 text-xs">
                        {categoryLabel}
                      </span>
                      {p.id === 'prompt-housing-001' && (
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded">
                          Challenge Benchmark
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{p.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Input Textarea */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Problem Description (Natural Language Input to Agent)
              </label>
              <textarea
                id="input-demo-prompt-text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                disabled={isRunning}
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Parties Involved
              </label>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-600 font-medium">Client:</span>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={isRunning}
                    className="w-full mt-0.5 p-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <span className="text-slate-600 font-medium">Opposing Entity:</span>
                  <input
                    type="text"
                    value={opposingParty}
                    onChange={(e) => setOpposingParty(e.target.value)}
                    disabled={isRunning}
                    className="w-full mt-0.5 p-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Run Control Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-600">
              Agent will call <strong>9 WebMCP tools</strong> sequentially to structure the case.
            </div>
            <button
              id="btn-execute-agent-run"
              onClick={handleStartWorkflow}
              disabled={isRunning || !customText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing WebMCP Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run WebMCP Agent Workflow</span>
                </>
              )}
            </button>
          </div>

          {/* Live Pipeline Steps Progress */}
          {steps.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-700">
                  WebMCP Protocol Execution Trace ({steps.filter((s) => s.status === 'completed').length}/9 Steps)
                </h3>
                {completedCaseId && (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                    Workflow Completed Successfully
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {steps.map((s) => {
                  const isPending = s.status === 'pending';
                  const isCurrent = s.status === 'running';
                  const isDone = s.status === 'completed';
                  return (
                    <div
                      key={s.stepIndex}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                          : isDone
                          ? 'border-slate-200 bg-white'
                          : 'border-slate-100 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-semibold text-slate-900">
                              {s.toolName}()
                            </span>
                            <span className="font-medium text-slate-600">
                              — {s.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {s.durationMs !== undefined && (
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {s.durationMs}ms
                          </span>
                        )}
                        {isDone && (
                          <button
                            id={`btn-inspect-step-${s.stepIndex}`}
                            onClick={() => setActiveStepInspector(s)}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Inspect JSON-RPC Tool Payload"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Step JSON-RPC Inspector Drawer */}
          {activeStepInspector && (
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-blue-700 font-bold">
                  JSON-RPC WebMCP Call: {activeStepInspector.toolName}
                </span>
                <button
                  onClick={() => setActiveStepInspector(null)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 block mb-1 font-semibold">Input Parameters:</span>
                  <pre className="p-2 bg-white rounded overflow-x-auto max-h-40 border border-slate-200">
                    {JSON.stringify(activeStepInspector.input, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 font-semibold">Output Result:</span>
                  <pre className="p-2 bg-white rounded overflow-x-auto max-h-40 border border-slate-200 text-blue-700">
                    {JSON.stringify(activeStepInspector.output, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Completion Callout & Direct Link to Case */}
          {completedCaseId && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-green-950">
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-green-900">Case Created & Letter Drafted</h4>
                  <p className="text-[11px] text-green-800">
                    The agent completed all WebMCP actions. The formal notice is held in <strong>pending_review</strong> awaiting human approval.
                  </p>
                </div>
              </div>
              <button
                id="btn-open-created-case"
                onClick={() => {
                  onOpenCase(completedCaseId);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors shrink-0"
              >
                <span>Open Case & Review Draft</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>WebMCP Specification 2026 • In-Browser JSON-RPC Tool Execution</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-medium text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
