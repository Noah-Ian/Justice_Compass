import { webMCP } from '../webmcp';
import { DomainArea } from '../types';

export interface WorkflowStepProgress {
  stepIndex: number;
  toolName: string;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  input?: any;
  output?: any;
  durationMs?: number;
}

export type StepProgressCallback = (step: WorkflowStepProgress, allSteps: WorkflowStepProgress[]) => void;

export interface WorkflowOptions {
  promptText: string;
  clientName?: string;
  opposingParty?: string;
  jurisdiction?: string;
  onStepUpdate?: StepProgressCallback;
  delayMs?: number;
}

export async function executeAgentWorkflow(options: WorkflowOptions): Promise<{ caseId: string; steps: WorkflowStepProgress[] }> {
  const {
    promptText,
    clientName = 'Faith Nakato',
    opposingParty = 'Mr. Patrick Byaruhanga (Landlord)',
    jurisdiction = 'Uganda',
    onStepUpdate,
    delayMs = 600
  } = options;

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const steps: WorkflowStepProgress[] = [
    {
      stepIndex: 0,
      toolName: 'classify_problem_area',
      label: 'Classify Problem Area',
      description: 'Analyze natural language description and extract domain, issue type, and monetary amounts.',
      status: 'pending'
    },
    {
      stepIndex: 1,
      toolName: 'search_information',
      label: 'Search Statutory Guidelines',
      description: 'Retrieve verified legal and public service guidance from the knowledge base.',
      status: 'pending'
    },
    {
      stepIndex: 2,
      toolName: 'create_case',
      label: 'Create Case Workspace',
      description: 'Initialize a persistent, structured case workspace with identified parties.',
      status: 'pending'
    },
    {
      stepIndex: 3,
      toolName: 'add_case_fact',
      label: 'Organize Timeline & Facts',
      description: 'Add chronological events, rental receipts, move-out dates, and verified details.',
      status: 'pending'
    },
    {
      stepIndex: 4,
      toolName: 'add_evidence',
      label: 'Attach Tangible Evidence',
      description: 'Catalogue payment receipts, lease contracts, and exit photo inspection records.',
      status: 'pending'
    },
    {
      stepIndex: 5,
      toolName: 'find_relevant_sources',
      label: 'Link Relevant Authorities',
      description: 'Bind authoritative Landlord & Tenant Act sections and LC1 mediation contacts to case.',
      status: 'pending'
    },
    {
      stepIndex: 6,
      toolName: 'generate_case_summary',
      label: 'Synthesize Case Summary',
      description: 'Produce an objective factual synthesis highlighting strengths and missing records.',
      status: 'pending'
    },
    {
      stepIndex: 7,
      toolName: 'generate_action_plan',
      label: 'Generate Action Plan',
      description: 'Assemble prioritized steps with explicit human-action checkpoints and disclaimers.',
      status: 'pending'
    },
    {
      stepIndex: 8,
      toolName: 'generate_letter',
      label: 'Draft Demand Letter (Pending Review)',
      description: 'Draft formal notice requiring human review and approval before any dispatch.',
      status: 'pending'
    }
  ];

  const updateStep = (idx: number, status: WorkflowStepProgress['status'], input?: any, output?: any, durationMs?: number) => {
    steps[idx].status = status;
    if (input !== undefined) steps[idx].input = input;
    if (output !== undefined) steps[idx].output = output;
    if (durationMs !== undefined) steps[idx].durationMs = durationMs;
    if (onStepUpdate) onStepUpdate(steps[idx], steps);
  };

  let createdCaseId = '';
  let classifiedArea: DomainArea = 'housing';
  let disputeCategory: 'security_deposit' | 'eviction_defense' | 'repairs_habitability' | 'lockouts_utilities' | 'rent_increase' | 'lease_agreement' = 'security_deposit';
  let issueType = 'Security Deposit Dispute';

  // STEP 0: Classify Problem Area
  updateStep(0, 'running', { text: promptText });
  if (delayMs > 0) await wait(delayMs);
  const t0 = performance.now();
  const classResult = await webMCP.callTool('classify_problem_area', { text: promptText, jurisdictionHint: jurisdiction });
  classifiedArea = 'housing';
  disputeCategory = classResult.disputeCategory || 'security_deposit';
  issueType = classResult.detectedIssueType || 'Security Deposit Recovery';
  updateStep(0, 'completed', { text: promptText }, classResult, Math.round(performance.now() - t0));

  // STEP 1: Search Statutory Guidelines
  updateStep(1, 'running', { query: issueType, area: classifiedArea, jurisdiction });
  if (delayMs > 0) await wait(delayMs);
  const t1 = performance.now();
  const searchResult = await webMCP.callTool('search_information', {
    query: issueType,
    area: classifiedArea,
    jurisdiction
  });
  updateStep(1, 'completed', { query: issueType, area: classifiedArea }, searchResult, Math.round(performance.now() - t1));

  // STEP 2: Create Case Workspace
  let caseTitle = 'Security Deposit Refund (800,000 UGX)';
  let desiredOutcome = 'Full refund of 800,000 UGX security deposit or itemized receipts for lawful deductions within 14 days.';

  if (disputeCategory === 'eviction_defense') {
    caseTitle = 'Unlawful 7-Day Eviction Notice & Padlock Lockout Defense';
    desiredOutcome = 'Immediate retraction of invalid 7-day notice, cessation of illegal lockout threats, and compliance with statutory 30-day notice under Section 38.';
  } else if (disputeCategory === 'repairs_habitability') {
    caseTitle = 'Habitability & Urgent Roof Leak Repair Demand';
    desiredOutcome = 'Immediate inspection and structural repairs to leaking roof and ceiling within 14 days pursuant to Sections 11–13 of the Landlord and Tenant Act (2022).';
  } else if (disputeCategory === 'rent_increase') {
    caseTitle = 'Disputed Unlawful Rent Increase';
    desiredOutcome = 'Reversion to agreed rental rate and compliance with statutory 90-day rent increase notice rules.';
  }

  const caseDescription = promptText;

  updateStep(2, 'running', { title: caseTitle, area: classifiedArea, issueType, disputeCategory });
  if (delayMs > 0) await wait(delayMs);
  const t2 = performance.now();
  const createResult = await webMCP.callTool('create_case', {
    title: caseTitle,
    area: classifiedArea,
    disputeCategory,
    issueType,
    description: caseDescription,
    jurisdiction,
    clientName,
    opposingPartyOrEntity: opposingParty,
    desiredOutcome
  });
  createdCaseId = createResult.caseId;
  updateStep(2, 'completed', { title: caseTitle, area: classifiedArea, disputeCategory }, createResult, Math.round(performance.now() - t2));

  // STEP 3: Add Case Facts
  updateStep(3, 'running', { caseId: createdCaseId });
  if (delayMs > 0) await wait(delayMs);
  const t3 = performance.now();

  if (disputeCategory === 'eviction_defense') {
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Tenant has resided continuously in the rental unit under a valid periodic tenancy.',
      date: '2024-01-15',
      sourceOrWitness: 'Tenancy agreement and initial rent records',
      category: 'timeline',
      verified: true
    });
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'All monthly rental obligations are fully settled with zero arrears.',
      date: '2026-08-01',
      sourceOrWitness: 'Payment transfer confirmation',
      category: 'financial',
      verified: true
    });
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Landlord served an invalid 7-day verbal/electronic notice to vacate and threatened padlocking.',
      date: '2026-08-10',
      sourceOrWitness: 'WhatsApp messages and voice notes',
      category: 'communication',
      verified: true
    });
  } else if (disputeCategory === 'repairs_habitability') {
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Severe water penetration through roof leaking into living area and kitchen during rainfall.',
      date: '2026-07-14',
      sourceOrWitness: 'Timestamped video and photographic evidence',
      category: 'condition',
      verified: true
    });
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Tenant formally notified property management on multiple occasions without corrective action.',
      date: '2026-07-15',
      sourceOrWitness: 'Acknowledged messages to property manager',
      category: 'communication',
      verified: true
    });
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Water seepage near electrical fixture poses an immediate safety and fire hazard.',
      date: '2026-08-05',
      sourceOrWitness: 'Electrician hazard assessment slip',
      category: 'condition',
      verified: true
    });
  } else {
    // security_deposit and default
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Tenant paid 800,000 UGX security deposit upon commencement of tenancy.',
      date: '2025-08-01',
      sourceOrWitness: 'Mobile Money Confirmation & Tenancy Clause',
      category: 'financial',
      verified: true
    });
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Tenant surrendered vacant possession on August 1st and handed all keys to caretaker.',
      date: '2026-08-01',
      sourceOrWitness: 'Caretaker Key Handover Note',
      category: 'timeline',
      verified: true
    });
    await webMCP.callTool('add_case_fact', {
      caseId: createdCaseId,
      statement: 'Landlord has withheld deposit beyond 30 days without providing itemized repair receipts.',
      date: '2026-08-20',
      sourceOrWitness: 'Unanswered formal communications',
      category: 'communication',
      verified: false
    });
  }
  updateStep(3, 'completed', { caseId: createdCaseId }, { factsAdded: 3 }, Math.round(performance.now() - t3));

  // STEP 4: Add Evidence
  updateStep(4, 'running', { caseId: createdCaseId });
  if (delayMs > 0) await wait(delayMs);
  const t4 = performance.now();

  if (disputeCategory === 'eviction_defense') {
    await webMCP.callTool('add_evidence', {
      caseId: createdCaseId,
      title: 'Current Month Rent Payment Confirmation',
      evidenceType: 'receipt',
      description: 'Proof of rent received and cleared for the current rental period.',
      significance: 'Demonstrates tenant is in lawful standing with no rental default.'
    });
    await webMCP.callTool('add_evidence', {
      caseId: createdCaseId,
      title: 'WhatsApp Communications & Lockout Ultimatum Logs',
      evidenceType: 'message_log',
      description: 'Audio and message exports showing landlord demand to vacate in 7 days and padlock threats.',
      significance: 'Direct evidence of breach of Section 38 notice requirements and Section 49 lockout prohibition.'
    });
  } else if (disputeCategory === 'repairs_habitability') {
    await webMCP.callTool('add_evidence', {
      caseId: createdCaseId,
      title: 'Photographs of Roof Leaks and Water Damaged Ceilings',
      evidenceType: 'photo',
      description: 'High-resolution images showing active leaks, discoloration, and water buckets in living room.',
      significance: 'Proves substantial habitability defect and tenant distress.'
    });
    await webMCP.callTool('add_evidence', {
      caseId: createdCaseId,
      title: 'Licensed Contractor Repair Estimate (UGX 450,000)',
      evidenceType: 'receipt',
      description: 'Written quote detailing the exact scope and cost to reseal roof flashing and replace compromised plasterboard.',
      significance: 'Quantifies exact remedy required under Section 11 statutory repair duty.'
    });
  } else {
    // security_deposit and default
    await webMCP.callTool('add_evidence', {
      caseId: createdCaseId,
      title: 'Security Deposit Mobile Money Payment Receipt (800,000 UGX)',
      evidenceType: 'receipt',
      description: 'Electronic transaction confirmation to landlord mobile money wallet.',
      significance: 'Conclusive evidence that the deposit was paid and acknowledged.'
    });
    await webMCP.callTool('add_evidence', {
      caseId: createdCaseId,
      title: 'Exit Inspection Photographs',
      evidenceType: 'photo',
      description: 'Photos taken on August 1st showing undamaged fixtures, repainted walls, and broom-swept floors.',
      significance: 'Demonstrates property was returned in clean state without damage beyond normal wear.'
    });
  }
  updateStep(4, 'completed', { caseId: createdCaseId }, { evidenceAdded: 2 }, Math.round(performance.now() - t4));

  // STEP 5: Find & Link Relevant Sources
  updateStep(5, 'running', { caseId: createdCaseId });
  if (delayMs > 0) await wait(delayMs);
  const t5 = performance.now();
  const sourceResult = await webMCP.callTool('find_relevant_sources', { caseId: createdCaseId });
  updateStep(5, 'completed', { caseId: createdCaseId }, sourceResult, Math.round(performance.now() - t5));

  // STEP 6: Generate Case Summary
  updateStep(6, 'running', { caseId: createdCaseId });
  if (delayMs > 0) await wait(delayMs);
  const t6 = performance.now();
  const summaryResult = await webMCP.callTool('generate_case_summary', { caseId: createdCaseId });
  updateStep(6, 'completed', { caseId: createdCaseId }, summaryResult, Math.round(performance.now() - t6));

  // STEP 7: Generate Action Plan
  updateStep(7, 'running', { caseId: createdCaseId });
  if (delayMs > 0) await wait(delayMs);
  const t7 = performance.now();
  const planResult = await webMCP.callTool('generate_action_plan', { caseId: createdCaseId });
  updateStep(7, 'completed', { caseId: createdCaseId }, planResult, Math.round(performance.now() - t7));

  // STEP 8: Generate Letter (Held for Human Review)
  const documentType =
    disputeCategory === 'eviction_defense'
      ? 'formal_complaint'
      : disputeCategory === 'repairs_habitability'
      ? 'clarification_request'
      : 'demand_letter';

  updateStep(8, 'running', { caseId: createdCaseId, documentType });
  if (delayMs > 0) await wait(delayMs);
  const t8 = performance.now();
  const letterResult = await webMCP.callTool('generate_letter', {
    caseId: createdCaseId,
    documentType,
    recipient: opposingParty
  });
  updateStep(8, 'completed', { caseId: createdCaseId }, letterResult, Math.round(performance.now() - t8));

  return {
    caseId: createdCaseId,
    steps
  };
}
