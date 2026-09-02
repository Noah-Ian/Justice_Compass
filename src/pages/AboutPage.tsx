import React from 'react';
import { Compass, Shield, ShieldCheck, Terminal, AlertTriangle, CheckCircle2, Lock, Cpu, HeartPulse } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Justice Compass</h1>
            <p className="text-xs text-blue-400 font-mono">
              WebMCP Challenge 2026 Submission • Landlord & Tenant Dispute Navigator
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          An in-browser agentic case workspace built on the WebMCP (Web Model Context Protocol) standard. Designed specifically to help tenants structure, clarify, and resolve landlord disputes — including security deposit recovery, eviction defense, and habitability claims — without losing human control over consequential outcomes.
        </p>
      </div>

      {/* Strict Legal and Medical Disclaimers */}
      <section aria-labelledby="disclaimer-heading" className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-4 text-xs text-amber-950 shadow-xs">
        <div className="flex items-center gap-2.5 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 id="disclaimer-heading" className="text-base font-bold text-amber-950">Important Legal & Medical Disclaimers</h2>
        </div>

        <div className="space-y-3 leading-relaxed text-amber-900">
          <p>
            <strong>General Information & Organizational Assistance:</strong> Justice Compass is an educational and organizational tool. It does not provide legal representation, medical diagnosis or treatment, financial advisory, or professional counseling.
          </p>
          <p>
            <strong>No Attorney-Client or Doctor-Patient Relationship:</strong> The use of Justice Compass and its registered WebMCP tools does not establish any fiduciary, attorney-client, or clinician-patient relationship.
          </p>
          <p>
            <strong>Human Review Mandatory:</strong> All synthesized summaries, checklists, and correspondence drafts must be reviewed, verified, and adapted by the user. If you face imminent eviction, acute medical distress, domestic danger, or strict statutory deadlines, consult a licensed attorney, medical practitioner, or emergency community service immediately.
          </p>
        </div>
      </section>

      {/* Human Sovereignty Safeguard Section */}
      <section aria-labelledby="safety-heading" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2.5 text-slate-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <h2 id="safety-heading" className="text-base font-bold text-slate-900">Safety Framework & Consequential Action Guardrails</h2>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Justice Compass strictly enforces the principle of <strong>Human Sovereignty over Consequential Actions</strong>. The application and connected AI agents:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              No Auto-Dispatch
            </span>
            <p className="text-slate-600">
              The app <strong>never</strong> automatically transmits letters, submits complaints, or contacts opposing parties.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              Mandatory Review Gate
            </span>
            <p className="text-slate-600">
              All generated documents are created in <code>pending_review</code> status. They cannot be marked approved without explicit human sign-off.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              Verifiable Grounding
            </span>
            <p className="text-slate-600">
              Every action plan and demand letter cites specific statutory provisions from our verified in-browser knowledge base.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              Explicit Assumption Highlighting
            </span>
            <p className="text-slate-600">
              Draft letters explicitly call out assumptions (dates, amounts, conditions) that the human must verify before sending.
            </p>
          </div>
        </div>
      </section>

      {/* WebMCP Protocol Architecture */}
      <section aria-labelledby="architecture-heading" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2.5 text-slate-900">
          <Terminal className="w-5 h-5 text-blue-600 shrink-0" />
          <h2 id="architecture-heading" className="text-base font-bold text-slate-900">WebMCP Protocol Architecture</h2>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Justice Compass is built to demonstrate the power of <strong>WebMCP (Web Model Context Protocol)</strong>, enabling AI agents to seamlessly interact with frontend state in the browser:
        </p>

        <div className="space-y-2 text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">In-Browser Registry (<code>window.webmcp</code>):</strong> Exposes 14 modular JSON-RPC tools with standard JSON Schema parameter specifications, execution latency metrics, and real-time telemetry events.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Zero Cloud or Backend Dependencies:</strong> Runs entirely in the client container using local state persistence (<code>localStorage</code>), eliminating server vulnerabilities and latency.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Comprehensive Tenancy Workspaces:</strong> Standardized case workspace model specialized exclusively for Security Deposit Withholding, Unlawful Eviction Defense, Habitability & Structural Repairs, Rent Increases, and LC1 Village Mediation.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
