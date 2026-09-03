import { WebMCPToolDefinition, Case, DomainArea, CaseFact } from '../../types';
import { caseStorage } from '../../services/caseStorage';

/**
 * ============================================================================
 * WebMCP Tool: create_case
 * ============================================================================
 *
 * WHAT IT DOES:
 * Creates a structured case workspace in the application state.
 *
 * INPUT IT ACCEPTS:
 * - title (string): Descriptive title for the case
 * - area (DomainArea): The supported land and tenancy domain, 'housing'
 * - issueType (string): Subcategory of the dispute or problem
 * - description (string): Detailed problem description
 * - jurisdiction (optional string): Defaults to 'Uganda'
 * - clientName (optional string): Name of user or affected individual
 * - opposingPartyOrEntity (optional string): Name of landlord, clinic, employer, etc.
 * - desiredOutcome (optional string): What the human wants to achieve
 *
 * WHAT IT RETURNS:
 * The newly created Case object with a unique case ID and initialized arrays for facts, evidence, and documents.
 *
 * WHY AN AGENT USES IT:
 * To promote an informal problem into an organized, persistent workspace that can be tracked.
 *
 * HUMAN APPROVAL NOTE:
 * Case creation establishes a private workspace. Consequential actions (like dispatching letters) remain gated.
 */
export const createCaseTool: WebMCPToolDefinition = {
  name: 'create_case',
  description: 'Create a new organized land or landlord-tenant case workspace.',
  category: 'case_management',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Initializes a structured case file in local state for organizing facts, evidence, and documents.',
    inputs: 'Title, domain area, issue type, description, jurisdiction, parties, and desired outcome.',
    outputs: 'The newly created Case object with unique case ID.',
    whyAgentUsesIt: 'To create a dedicated workspace before adding facts, evidence, and drafting solutions.',
    humanApprovalNote: 'Creates a workspace locally; does not communicate with any external party.'
  },
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Descriptive title for the case (e.g. "Security Deposit Refund - Kira Road Apartment").'
      },
      area: {
        type: 'string',
        enum: ['housing'],
        description: 'Primary land and tenancy problem domain.'
      },
      issueType: {
        type: 'string',
        description: 'Issue classification (e.g. "Security Deposit Dispute", "Patient Records Access").'
      },
      description: {
        type: 'string',
        description: 'Comprehensive narrative of the situation.'
      },
      jurisdiction: {
        type: 'string',
        description: 'Applicable legal/geographic jurisdiction (default: "Uganda").'
      },
      clientName: {
        type: 'string',
        description: 'Name of the client or person experiencing the problem.'
      },
      opposingPartyOrEntity: {
        type: 'string',
        description: 'Name of the landlord, hospital, employer, or company involved.'
      },
      desiredOutcome: {
        type: 'string',
        description: 'Desired resolution or outcome sought by the human.'
      }
    },
    required: ['title', 'area', 'issueType', 'description']
  },
  handler: (args: {
    title: string;
    area: DomainArea;
    issueType: string;
    description: string;
    jurisdiction?: string;
    clientName?: string;
    opposingPartyOrEntity?: string;
    desiredOutcome?: string;
  }) => {
    const newCase: Case = {
      id: `case-${args.area}-${Date.now().toString().slice(-5)}`,
      title: args.title,
      area: args.area,
      issueType: args.issueType,
      description: args.description,
      jurisdiction: args.jurisdiction || 'Uganda',
      status: 'gathering_facts',
      partiesInvolved: {
        clientName: args.clientName || 'Client',
        opposingPartyOrEntity: args.opposingPartyOrEntity || 'Opposing Party',
        relationship: `${args.area} dispute`
      },
      desiredOutcome: args.desiredOutcome || 'Fair and lawful resolution under applicable guidance.',
      facts: [],
      evidence: [],
      relevantSourceIds: [],
      missingInformation: [],
      actionPlan: [],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = caseStorage.saveCase(newCase);
    return {
      success: true,
      caseId: saved.id,
      case: saved
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: get_case
 * ============================================================================
 */
export const getCaseTool: WebMCPToolDefinition = {
  name: 'get_case',
  description: 'Retrieve the complete case file including facts, evidence, sources, action plan, and draft documents.',
  category: 'case_management',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Fetches the current state of a case.',
    inputs: 'Case ID.',
    outputs: 'Complete Case object.',
    whyAgentUsesIt: 'To inspect existing facts, evidence, and missing pieces before performing actions.',
    humanApprovalNote: 'Read-only query.'
  },
  parameters: {
    type: 'object',
    properties: {
      caseId: {
        type: 'string',
        description: 'The unique ID of the case.'
      }
    },
    required: ['caseId']
  },
  handler: (args: { caseId: string }) => {
    const targetCase = caseStorage.getCase(args.caseId);
    if (!targetCase) {
      throw new Error(`Case not found: ${args.caseId}`);
    }
    return {
      case: targetCase
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: update_case
 * ============================================================================
 */
export const updateCaseTool: WebMCPToolDefinition = {
  name: 'update_case',
  description: 'Update case metadata, status, summary, or missing information notes.',
  category: 'case_management',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Updates status or high-level case attributes.',
    inputs: 'Case ID and fields to update.',
    outputs: 'Updated Case object.',
    whyAgentUsesIt: 'To advance case status as evidence and drafts are prepared.',
    humanApprovalNote: 'Organizational updates only.'
  },
  parameters: {
    type: 'object',
    properties: {
      caseId: {
        type: 'string',
        description: 'The unique ID of the case.'
      },
      status: {
        type: 'string',
        enum: ['intake', 'gathering_facts', 'evidence_review', 'drafting', 'pending_human_review', 'action_ready', 'closed'],
        description: 'New workflow status.'
      },
      desiredOutcome: {
        type: 'string',
        description: 'Updated desired outcome.'
      },
      missingInformation: {
        type: 'string',
        description: 'Comma-separated missing information notes.'
      }
    },
    required: ['caseId']
  },
  handler: (args: { caseId: string; status?: any; desiredOutcome?: string; missingInformation?: string }) => {
    const targetCase = caseStorage.getCase(args.caseId);
    if (!targetCase) {
      throw new Error(`Case not found: ${args.caseId}`);
    }

    if (args.status) targetCase.status = args.status;
    if (args.desiredOutcome) targetCase.desiredOutcome = args.desiredOutcome;
    if (args.missingInformation) {
      targetCase.missingInformation = args.missingInformation.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updated = caseStorage.saveCase(targetCase);
    return {
      success: true,
      case: updated
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: add_case_fact
 * ============================================================================
 *
 * WHAT IT DOES:
 * Appends a verified or client-stated factual point to the case timeline.
 *
 * INPUT IT ACCEPTS:
 * - caseId (string): Target case
 * - statement (string): Precise factual assertion
 * - date (optional string): When the event occurred
 * - sourceOrWitness (optional string): Supporting record, receipt, or witness
 * - category (string): 'timeline' | 'financial' | 'communication' | 'condition' | 'general'
 * - verified (boolean): Whether corroborated by physical/digital evidence
 *
 * WHAT IT RETURNS:
 * The created CaseFact item with its unique ID and timestamp.
 */
export const addCaseFactTool: WebMCPToolDefinition = {
  name: 'add_case_fact',
  description: 'Add an organized factual statement or chronological event to a case file.',
  category: 'case_management',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Records a discrete factual point with corroborating source.',
    inputs: 'Case ID, statement, date, source/witness, category, and verification status.',
    outputs: 'Created CaseFact object.',
    whyAgentUsesIt: 'To organize the chronological narrative and distinguish verified facts from unconfirmed claims.',
    humanApprovalNote: 'Human can edit or delete facts at any time.'
  },
  parameters: {
    type: 'object',
    properties: {
      caseId: {
        type: 'string',
        description: 'The unique ID of the target case.'
      },
      statement: {
        type: 'string',
        description: 'Clear, concise factual statement.'
      },
      date: {
        type: 'string',
        description: 'Date or timeframe when the fact took place (e.g. "2026-08-01").'
      },
      sourceOrWitness: {
        type: 'string',
        description: 'Supporting source, document, or witness name.'
      },
      category: {
        type: 'string',
        enum: ['timeline', 'financial', 'communication', 'condition', 'general'],
        description: 'Category of the fact.'
      },
      verified: {
        type: 'boolean',
        description: 'True if supported by documentary proof, false if based on recollection.'
      }
    },
    required: ['caseId', 'statement']
  },
  handler: (args: {
    caseId: string;
    statement: string;
    date?: string;
    sourceOrWitness?: string;
    category?: 'timeline' | 'financial' | 'communication' | 'condition' | 'general';
    verified?: boolean;
  }) => {
    const fact = caseStorage.addFact(args.caseId, {
      statement: args.statement,
      date: args.date,
      sourceOrWitness: args.sourceOrWitness || 'Client statement',
      category: args.category || 'general',
      verified: args.verified !== undefined ? args.verified : false,
      addedBy: 'agent_webmcp'
    });

    if (!fact) {
      throw new Error(`Failed to add fact. Case not found: ${args.caseId}`);
    }

    return {
      success: true,
      factId: fact.id,
      fact
    };
  }
};
