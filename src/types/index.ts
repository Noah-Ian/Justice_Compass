export type DomainArea = 'housing';

export type LandlordDisputeCategory =
  | 'security_deposit'
  | 'eviction_defense'
  | 'repairs_habitability'
  | 'rent_increase'
  | 'lockouts_utilities'
  | 'lease_agreement';

export type CaseStatus =
  | 'intake'
  | 'gathering_facts'
  | 'evidence_review'
  | 'drafting'
  | 'pending_human_review'
  | 'action_ready'
  | 'closed';

export interface CaseFact {
  id: string;
  statement: string;
  date?: string;
  sourceOrWitness?: string;
  category: 'timeline' | 'financial' | 'communication' | 'condition' | 'general';
  verified: boolean;
  addedBy: 'human' | 'agent_webmcp';
  createdAt: string;
}

export interface CaseEvidence {
  id: string;
  title: string;
  evidenceType: 'receipt' | 'lease_contract' | 'medical_record' | 'letter_email' | 'photo' | 'message_log' | 'other';
  description: string;
  date?: string;
  fileReference?: string;
  status: 'available' | 'requested' | 'missing';
  significance: string;
  addedBy: 'human' | 'agent_webmcp';
  createdAt: string;
}

export interface InformationSource {
  id: string;
  area: DomainArea;
  jurisdiction: string;
  topic: string;
  title: string;
  summary: string;
  source: string;
  sourceType: 'official-guidance' | 'statutory-reference' | 'public-service' | 'patient-charter' | 'advisory-guideline';
  keywords: string[];
  recommendedSteps?: string[];
  authorityOrContact?: {
    name: string;
    contact?: string;
    role: string;
  };
}

export interface ActionPlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  requiresHumanAction: boolean;
  isConsequential: boolean;
  completed: boolean;
  deadline?: string;
  warningOrDisclaimer?: string;
}

export interface GeneratedDocument {
  id: string;
  caseId: string;
  title: string;
  documentType: 'demand_letter' | 'clarification_request' | 'formal_complaint' | 'records_request' | 'meeting_agenda';
  recipient: string;
  content: string;
  originalContent: string;
  assumptions: string[];
  reviewStatus: 'pending_review' | 'approved' | 'rejected' | 'edited';
  humanNotes?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  area: DomainArea;
  disputeCategory?: LandlordDisputeCategory;
  issueType: string;
  description: string;
  jurisdiction: string;
  status: CaseStatus;
  partiesInvolved: {
    clientName?: string;
    opposingPartyOrEntity?: string;
    relationship?: string;
  };
  desiredOutcome: string;
  facts: CaseFact[];
  evidence: CaseEvidence[];
  relevantSourceIds: string[];
  missingInformation: string[];
  summary?: string;
  actionPlan: ActionPlanStep[];
  documents: GeneratedDocument[];
  createdAt: string;
  updatedAt: string;
}

// WebMCP Protocol Types
export interface WebMCPToolParameterProperty {
  type: string;
  description: string;
  enum?: string[];
  items?: {
    type: string;
    description?: string;
  };
}

export interface WebMCPToolSchema {
  type: 'object';
  properties: Record<string, WebMCPToolParameterProperty>;
  required?: string[];
}

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  category: 'classification' | 'knowledge' | 'case_management' | 'evidence' | 'generation' | 'review';
  supportedAreas: DomainArea[] | 'all';
  parameters: WebMCPToolSchema;
  handler: (args: any) => Promise<any> | any;
  requiresHumanReview: boolean;
  consequential: boolean;
  explanation: {
    purpose: string;
    inputs: string;
    outputs: string;
    whyAgentUsesIt: string;
    humanApprovalNote: string;
  };
}

export interface WebMCPExecutionLog {
  id: string;
  timestamp: string;
  toolName: string;
  input: any;
  output: any;
  status: 'success' | 'error';
  durationMs: number;
}
