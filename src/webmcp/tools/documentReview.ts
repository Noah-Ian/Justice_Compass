import { WebMCPToolDefinition } from '../../types';
import { caseStorage } from '../../services/caseStorage';

/**
 * ============================================================================
 * WebMCP Tool: get_case_documents
 * ============================================================================
 */
export const getCaseDocumentsTool: WebMCPToolDefinition = {
  name: 'get_case_documents',
  description: 'Retrieve all drafted documents, letters, and notices for a case along with their human review status.',
  category: 'review',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Inspects generated documents and their current review status (pending_review, approved, rejected, edited).',
    inputs: 'Case ID.',
    outputs: 'List of documents attached to the case.',
    whyAgentUsesIt: 'To check if a drafted letter has been approved by the human before advising next steps.',
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
      documentsCount: targetCase.documents.length,
      documents: targetCase.documents
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: review_document
 * ============================================================================
 *
 * WHAT IT DOES:
 * Records human judgment (Approve, Edit, Reject) on a generated document.
 * Crucial to ensure consequential actions remain in human hands!
 */
export const reviewDocumentTool: WebMCPToolDefinition = {
  name: 'review_document',
  description: 'Record human review decision (approve, reject, edit) on a generated document draft.',
  category: 'review',
  supportedAreas: 'all',
  requiresHumanReview: true,
  consequential: true,
  explanation: {
    purpose: 'Explicitly records the human approval or rejection of a generated document.',
    inputs: 'Case ID, document ID, decision (approved, rejected, edited), notes, and edited content.',
    outputs: 'The updated GeneratedDocument record with timestamped review status.',
    whyAgentUsesIt: 'To confirm that the human has taken ownership of the letter before advancing the case.',
    humanApprovalNote: 'CORE HUMAN-IN-THE-LOOP MECHANISM: Enforces human sovereignty over drafted actions.'
  },
  parameters: {
    type: 'object',
    properties: {
      caseId: {
        type: 'string',
        description: 'The unique ID of the target case.'
      },
      documentId: {
        type: 'string',
        description: 'The unique ID of the document being reviewed.'
      },
      decision: {
        type: 'string',
        enum: ['approved', 'rejected', 'edited'],
        description: 'The human review decision.'
      },
      humanNotes: {
        type: 'string',
        description: 'Optional reviewer remarks or rationale.'
      },
      editedContent: {
        type: 'string',
        description: 'Optional modified text if editing the document directly.'
      }
    },
    required: ['caseId', 'documentId', 'decision']
  },
  handler: (args: {
    caseId: string;
    documentId: string;
    decision: 'approved' | 'rejected' | 'edited';
    humanNotes?: string;
    editedContent?: string;
  }) => {
    const updated = caseStorage.reviewDocument(
      args.caseId,
      args.documentId,
      args.decision,
      args.humanNotes,
      args.editedContent
    );

    if (!updated) {
      throw new Error(`Failed to review document. Case or document not found.`);
    }

    return {
      success: true,
      documentId: updated.id,
      reviewStatus: updated.reviewStatus,
      reviewedAt: updated.reviewedAt,
      message: `Document has been marked as '${args.decision}' by human reviewer.`
    };
  }
};
