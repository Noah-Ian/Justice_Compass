# Justice Compass — WebMCP Challenge 2026

> **An In-Browser, Agentic Multi-Domain Assistance Workspace Powered by WebMCP (Web Model Context Protocol)**  
> _Turning everyday life problems into organized, actionable cases across Housing, Health, Family, Employment, Consumer, and Community matters — while keeping the human firmly in control of all consequential actions._

---

## 1. Product Vision & Problem Statement

Every day, ordinary people encounter complex problems in critical areas of life:

- A landlord withholds an **800,000 UGX security deposit** without explanation or itemized receipts.
- A clinic refuses to hand over a child's **immunization card** after a disputed consultation fee.
- A separated parent needs to organize **child education maintenance receipts** and propose an amicable contribution schedule.
- An employee is terminated without their **final unpaid wages** or statutory notice period.

When facing these disputes, citizens rarely know:

1. What statutory rights protect them;
2. What factual timeline and evidence must be catalogued;
3. What procedural steps to take before escalation;
4. How to draft a respectful, legally grounded notice without making unwarranted assumptions.

**Justice Compass** solves this by providing an in-browser case workspace that an autonomous AI agent can operate through **WebMCP** (Web Model Context Protocol). The agent categorizes the problem, retrieves authentic statutory guidance, extracts factual timelines, attaches tangible exhibits, and drafts structured demand letters — while the human maintains total sovereignty over every consequential decision.

---

## 2. Why WebMCP is the Perfect Architecture

Conventional legal/complaint tools either rely on opaque, hallucinations-prone chatbots or rigid, form-based wizards that cannot adapt to natural language.

**WebMCP (Web Model Context Protocol)** provides the ideal abstraction:

- **Protocol-Driven Extensibility**: Exposes 14 modular, typed tools to AI agents running in or alongside the browser.
- **Inspectable & Deterministic**: Every tool invocation adheres to a strict JSON Schema, produces typed structured outputs, and emits real-time telemetry events.
- **Frontend-Only, Zero Cloud Backend**: Eliminates server-side database vulnerabilities and sensitive data leakage. Runs locally in the browser with `localStorage` reactive persistence.
- **Enforced Human-in-the-Loop Safeguards**: Consequential operations (such as approving demand letters or filing formal complaints) cannot be executed automatically by an agent; they require explicit human review through the `review_document` tool and approval UI.

---

## 3. Supported Domain Areas

Justice Compass is built around a standardized, domain-agnostic case model supporting:

| Domain                      | Focus Matters                                                      | Grounding Statutes / Guidelines                                  |
| --------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Housing & Tenancy**       | Security deposits, eviction notices, habitability repairs          | Uganda Landlord & Tenant Act 2022 (Sec 29, 31, 38)               |
| **Health & Patient Rights** | Records access, immunization cards, emergency fee billing          | Uganda Ministry of Health Patients' Rights Charter (Sec 3, 5, 8) |
| **Family & Household**      | Child maintenance, education expenses, neutral custody schedules   | The Children Act (Cap 59) Sections 4, 5, 76                      |
| **Work & Employment**       | Unpaid wages, end-of-contract notice, severance entitlements       | Employment Act 2006 (Sections 40, 41, 58)                        |
| **Consumer Rights**         | Defective goods, refunds, merchant warranties                      | UNBS Act & Consumer Protection Regulations                       |
| **Society & Community**     | Neighborhood noise, boundary disputes, LC1 local council mediation | Local Council Courts Act 2006 (Sections 9, 10)                   |

---

## 4. WebMCP Tool Catalog (14 Registered Tools)

All tools are mounted directly to `window.webmcp` and can be inspected in the built-in **WebMCP Inspector**:

### 🔍 Classification & Triage

1. **`classify_problem_area`**: Classifies raw natural language descriptions into domain areas, extracts monetary amounts, key dates, parties, and formulates clarifying questions.

### 📚 Knowledge & Statutory Guidance

2. **`search_information`**: Queries the verified in-browser knowledge base of statutes, statutory sections, patient rights, and official dispute resolution bodies.
3. **`find_relevant_sources`**: Analyzes an existing case and binds applicable statutory provisions and dispute authority contacts to the case.

### 🗂️ Case Management

4. **`create_case`**: Initializes a structured case workspace with title, domain area, issue type, description, jurisdiction, parties involved, and desired outcome.
5. **`get_case`**: Retrieves full case workspace state including factual timeline, evidence items, action plan, and drafts.
6. **`update_case`**: Updates case metadata, status, desired outcomes, or identifies missing facts.
7. **`add_case_fact`**: Appends chronological, verifiable factual assertions (financial, timeline, communication, condition) tagged as verified or client claims.

### 📎 Evidence Management

8. **`add_evidence`**: Catalogues tangible exhibits (payment receipts, lease contracts, inspection photos, SMS/WhatsApp logs, medical records) with availability status and evidentiary significance.
9. **`get_case_evidence`**: Retrieves all evidence catalogued for a case with filtering by type or status.

### ✍️ Document & Plan Generation

10. **`generate_case_summary`**: Synthesizes an objective, factual overview highlighting undisputed facts, contested points, and missing information.
11. **`generate_action_plan`**: Assembles a prioritized, step-by-step procedural roadmap (informal communication → formal letter → mediation → official authority) with explicit human-action checkpoints.
12. **`generate_letter`**: Drafts formal correspondence (Demand Letter, Clarification Request, Notice) citing applicable statutes and flagging assumptions. **Held in `pending_review` by default.**

### 🛡️ Human-in-the-Loop & Document Review

13. **`get_case_documents`**: Lists all generated documents and their current review status (`pending_review`, `approved`, `rejected`, `edited`).
14. **`review_document`**: **The safety-critical review gate.** Records human sign-off, edits, or rejection of drafted letters before any dispatch can take place.

---

## 5. End-to-End Demonstration: Landlord–Tenant Challenge Workflow

The primary challenge demonstration executes a complete 9-step automated pipeline:

```
[User Problem Narrative: 800,000 UGX Security Deposit Withheld]
                           ↓
               1. classify_problem_area()
                           ↓
                2. search_information()
                           ↓
                  3. create_case()
                           ↓
                 4. add_case_fact()
                           ↓
                  5. add_evidence()
                           ↓
              6. find_relevant_sources()
                           ↓
             7. generate_case_summary()
                           ↓
              8. generate_action_plan()
                           ↓
                 9. generate_letter()
                           ↓
           [HELD IN PENDING_REVIEW STATUS]
                           ↓
            🛡️ Human Review & Approval Modal
         (Preview, Edit Text, Verify Assumptions)
                           ↓
                   [APPROVED BY HUMAN]
```

### How to Run the Demonstration:

1. Click **"Run Agent Workflow"** in the top navigation bar or the green spotlight banner on the Dashboard.
2. Select the **"Housing Scenario"** (pre-filled with the 800,000 UGX challenge prompt).
3. Click **"Run WebMCP Agent Workflow"**.
4. Watch the 9 tools execute sequentially with live millisecond latency and status badges.
5. Click any tool step's eye icon to inspect the **JSON-RPC input/output payload**.
6. Click **"Open Case & Review Draft"** to enter the created workspace.
7. Click **"Review Draft Now"** to open the Human Review modal, edit the letter text, review highlighted assumptions, and grant final human approval.

---

## 6. Safety Guardrails & Human-in-the-Loop Architecture

> **The application must NOT automatically send letters, submit complaints, contact healthcare providers, contact opposing parties, file cases, make medical decisions, or take other consequential actions.**

Justice Compass adheres to this principle through 4 strict technical safeguards:

1. **Zero Auto-Dispatch**: There are no email APIs, SMS senders, or external submission endpoints. Correspondence exists only within the user's workspace.
2. **Review Gate Pattern**: `generate_letter` hardcodes `reviewStatus: 'pending_review'`. Cases with pending documents display visible review alerts and cannot transition to `action_ready` without human approval.
3. **Factual Assumption Highlighting**: All generated letters explicitly enumerate the factual assumptions (move-out dates, zero rent arrears, undamaged premises) that the user must verify.
4. **Editable In-Place**: Users can toggle between formatted preview and text editing mode to customize every paragraph before copying or exporting.

---

## 7. Legal & Medical Disclaimers

> **Notice:** Justice Compass provides general information and organizational assistance. It does not provide legal representation, medical diagnosis or treatment, or professional advice. Review important outputs with a qualified professional or appropriate official service.

- **No Attorney-Client or Doctor-Patient Relationship**: Using Justice Compass or its WebMCP tools does not form any privileged or fiduciary relationship.
- **Emergency Escalation**: If experiencing imminent illegal eviction, acute medical distress, domestic violence, or statutory filing deadlines, consult a licensed attorney, medical practitioner, or local legal aid organization immediately.

---

## 8. Technical Architecture

- **Framework**: React 18+ with TypeScript and Vite.
- **Styling**: Tailwind CSS with deliberate typographic scale, accessible color contrast, and responsive layout.
- **Icons**: `lucide-react`.
- **State Management**: Reactive in-memory subscription with `localStorage` persistence (`caseStorage`).
- **WebMCP Implementation**: Singleton `WebMCPRegistry` exposing typed `callTool()`, `registerTool()`, and event listeners via `window.webmcp`.

### Native WebMCP Registration

At application startup, `src/main.tsx` calls `initGlobalWebMCP()` before React renders. The registry registers every tool with the browser-native discovery surface:

```ts
document.modelContext.registerTool({
  name: tool.name,
  description: tool.description,
  inputSchema: tool.parameters,
  execute: async (input) => webMCP.callTool(tool.name, input),
});
```

This makes the full tool catalog discoverable by WebMCP-enabled agents through `document.modelContext`, while retaining `window.webmcp` and the in-app inspector for compatibility and debugging. Registration is idempotent, and each native execution flows through the same audited registry used by the UI.

---

## 9. Future Roadmap

1. **Native WebMCP Browser Extension**: Direct integration with Chrome/Brave agent extensions for cross-tab public portal intake.
2. **Multi-Party Mediation Summaries**: Neutral caucus summaries for community leaders and Local Council (LC1) courts.
3. **Local Document Attachment**: Client-side OCR parsing of paper receipts and tenancy agreements via WebAssembly.
4. **Offline PWA Support**: Full Progressive Web App caching for remote community paralegals operating without stable cellular data.

---

## 10. License

Copyright (c) 2026 Justice Compass contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
