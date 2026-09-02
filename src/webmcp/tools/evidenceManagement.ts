import { WebMCPToolDefinition, CaseEvidence } from '../../types';
import { caseStorage } from '../../services/caseStorage';

/**
 * ============================================================================
 * WebMCP Tool: add_evidence
 * ============================================================================
 *
 * WHAT IT DOES:
 * Registers a piece of tangible evidence (receipt, lease, medical chart, photo, message log)
 * to a case workspace and notes its evidentiary significance.
 *
 * INPUT IT ACCEPTS:
 * - caseId (string): Target case ID
 * - title (string): Evidence label (e.g. "Security Deposit Payment Receipt")
 * - evidenceType (string): 'receipt' | 'lease_contract' | 'medical_record' | 'letter_email' | 'photo' | 'message_log' | 'other'
 * - description (string): Detailed description of the evidence
 * - significance (string): Why this matters to the case
 * - date (optional string): Date on the evidence
 * - fileReference (optional string): Mock filename or reference
 * - status (optional string): 'available' | 'requested' | 'missing'
 *
 * WHAT IT RETURNS:
 * The newly registered CaseEvidence record.
 */
export const addEvidenceTool: WebMCPToolDefinition = {
  name: 'add_evidence',
  description: 'Attach a piece of tangible or digital evidence (receipt, agreement, medical record, photo, message) to a case.',
  category: 'evidence',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Catalogues evidence items and articulates their relevance to case facts.',
    inputs: 'Case ID, evidence title, type, description, significance, date, file reference, status.',
    outputs: 'The newly created CaseEvidence object.',
    whyAgentUsesIt: 'To connect factual assertions directly to supporting documentation.',
    humanApprovalNote: 'Catalogues records in local state.'
  },
  parameters: {
    type: 'object',
    properties: {
      caseId: {
        type: 'string',
        description: 'The unique ID of the target case.'
      },
      title: {
        type: 'string',
        description: 'Title of the evidence item (e.g., "Mobile Money 800,000 UGX Receipt").'
      },
      evidenceType: {
        type: 'string',
        enum: ['receipt', 'lease_contract', 'medical_record', 'letter_email', 'photo', 'message_log', 'other'],
        description: 'Category of evidence.'
      },
      description: {
        type: 'string',
        description: 'What the evidence contains.'
      },
      significance: {
        type: 'string',
        description: 'Why this evidence supports the case.'
      },
      date: {
        type: 'string',
        description: 'Date corresponding to the evidence (e.g. "2026-08-01").'
      },
      fileReference: {
        type: 'string',
        description: 'Document filename or tracking reference (e.g. "deposit_receipt.pdf").'
      },
      status: {
        type: 'string',
        enum: ['available', 'requested', 'missing'],
        description: 'Current status of the evidence.'
      }
    },
    required: ['caseId', 'title', 'evidenceType', 'description', 'significance']
  },
  handler: (args: {
    caseId: string;
    title: string;
    evidenceType: 'receipt' | 'lease_contract' | 'medical_record' | 'letter_email' | 'photo' | 'message_log' | 'other';
    description: string;
    significance: string;
    date?: string;
    fileReference?: string;
    status?: 'available' | 'requested' | 'missing';
  }) => {
    const evidence = caseStorage.addEvidence(args.caseId, {
      title: args.title,
      evidenceType: args.evidenceType,
      description: args.description,
      significance: args.significance,
      date: args.date,
      fileReference: args.fileReference || `${args.evidenceType}_${Date.now()}.pdf`,
      status: args.status || 'available',
      addedBy: 'agent_webmcp'
    });

    if (!evidence) {
      throw new Error(`Failed to add evidence. Case not found: ${args.caseId}`);
    }

    return {
      success: true,
      evidenceId: evidence.id,
      evidence
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: get_case_evidence
 * ============================================================================
 */
export const getCaseEvidenceTool: WebMCPToolDefinition = {
  name: 'get_case_evidence',
  description: 'List all evidence items registered to a case with their availability status and significance.',
  category: 'evidence',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Retrieves all evidence associated with a case.',
    inputs: 'Case ID.',
    outputs: 'Array of evidence items.',
    whyAgentUsesIt: 'To check what evidence is in hand before drafting legal notices or claims.',
    humanApprovalNote: 'Read-only query.'
  },
  parameters: {
    type: 'object',
    properties: {
      caseId: {
        type: 'string',
        description: 'The unique ID of the target case.'
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
      caseId: args.caseId,
      totalEvidenceCount: targetCase.evidence.length,
      evidence: targetCase.evidence
    };
  }
};
