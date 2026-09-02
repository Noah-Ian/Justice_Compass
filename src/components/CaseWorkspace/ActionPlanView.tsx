import React from 'react';
import { ActionPlanStep } from '../../types';
import { CheckCircle2, Circle, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { caseStorage } from '../../services/caseStorage';

interface ActionPlanViewProps {
  caseId: string;
  actionPlan: ActionPlanStep[];
  onPlanUpdated: () => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({ caseId, actionPlan, onPlanUpdated }) => {
  const handleToggleStep = (stepId: string, currentCompleted: boolean) => {
    const targetCase = caseStorage.getCase(caseId);
    if (!targetCase) return;

    targetCase.actionPlan = targetCase.actionPlan.map((s) =>
      s.id === stepId ? { ...s, completed: !currentCompleted } : s
    );
    caseStorage.saveCase(targetCase);
    onPlanUpdated();
  };

  const completedCount = actionPlan.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Procedural Action Plan & Checklist</h3>
          <p className="text-xs text-slate-500">
            Prioritized procedure from informal resolution to official arbitration
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">
            {completedCount} of {actionPlan.length} Steps Completed
          </span>
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${actionPlan.length ? (completedCount / actionPlan.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {actionPlan.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            No action plan steps generated yet. Run the WebMCP Agent Workflow to generate a structured procedural roadmap.
          </div>
        ) : (
          actionPlan.map((step) => {
            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                  step.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-80'
                    : step.isConsequential
                    ? 'bg-white border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      id={`btn-toggle-step-${step.id}`}
                      onClick={() => handleToggleStep(step.id, step.completed)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title={step.completed ? 'Mark uncompleted' : 'Mark completed'}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          Step {step.stepNumber}: {step.title}
                        </span>

                        {step.requiresHumanAction && (
                          <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                            Human Action Required
                          </span>
                        )}

                        {step.isConsequential && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            Consequential Decision
                          </span>
                        )}
                      </div>

                      <p className={`text-slate-600 leading-relaxed ${step.completed ? 'line-through text-slate-400' : ''}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {step.deadline && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{step.deadline}</span>
                    </div>
                  )}
                </div>

                {step.warningOrDisclaimer && !step.completed && (
                  <div className="ml-8 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{step.warningOrDisclaimer}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
