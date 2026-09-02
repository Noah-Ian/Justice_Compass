import { WebMCPToolDefinition, DomainArea } from '../../types';

/**
 * ============================================================================
 * WebMCP Tool: classify_problem_area
 * ============================================================================
 *
 * WHAT IT DOES:
 * Analyzes unstructured natural language problem descriptions from a human user
 * and classifies the situation into one of the supported domain areas:
 * (housing, health, family, employment, consumer, society).
 *
 * INPUT IT ACCEPTS:
 * - text (string): The raw problem narrative provided by the human.
 * - hints (optional string[]): Contextual keywords or locations.
 *
 * WHAT IT RETURNS:
 * - area: Primary classified domain ('housing' | 'health' | 'family' | etc.)
 * - confidence: Score between 0.0 and 1.0
 * - secondaryAreas: Any overlapping jurisdictions or domains
 * - detectedIssueType: Specific sub-category (e.g. 'Security Deposit Dispute')
 * - extractedEntities: Dates, money amounts, named parties, locations detected
 * - suggestedMissingQuestions: Critical follow-up questions to gather facts
 *
 * WHY AN AGENT USES IT:
 * Agents call this as the very first step in the triage pipeline to determine
 * which legal/health information corpus to query and what case schema to configure.
 *
 * HUMAN APPROVAL NOTE:
 * Read-only classification. No human approval required, but the human may
 * override the suggested area during case review.
 */
export const classifyProblemAreaTool: WebMCPToolDefinition = {
  name: 'classify_problem_area',
  description: 'Classify an everyday tenancy or rental problem description into specific landlord-tenant dispute categories (security deposit, unlawful eviction, habitability/repairs, rent hikes, lockouts/utilities, lease breaches) with tenancy entity extraction.',
  category: 'classification',
  supportedAreas: ['housing'],
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Classifies tenancy dispute descriptions and extracts key tenancy entities (amounts, dates, landlord/tenant parties, notice timelines) for case setup.',
    inputs: 'Unstructured problem text from tenant or landlord and optional jurisdiction hint.',
    outputs: 'Classified tenancy area (housing), dispute subcategory, confidence score, detected issue type, extracted entities, and recommended intake questions.',
    whyAgentUsesIt: 'To determine the correct tenancy statutory corpus, rights checklist, and preliminary case workspace setup.',
    humanApprovalNote: 'Read-only intake triage; human can adjust case parameters at any time.'
  },
  parameters: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'The natural language description of the landlord or tenant problem described by the user.'
      },
      jurisdictionHint: {
        type: 'string',
        description: 'Optional geographical jurisdiction hint (e.g., "Uganda", "Kampala").'
      }
    },
    required: ['text']
  },
  handler: (args: { text: string; jurisdictionHint?: string }) => {
    const text = (args.text || '').toLowerCase();

    // Determine specific landlord dispute category
    let disputeCategory: 'security_deposit' | 'eviction_defense' | 'repairs_habitability' | 'rent_increase' | 'lockouts_utilities' | 'lease_agreement' = 'security_deposit';
    let detectedIssueType = 'Security Deposit Recovery';

    if (text.includes('evict') || text.includes('vacate') || text.includes('kick out') || text.includes('notice to leave') || text.includes('throw out')) {
      disputeCategory = 'eviction_defense';
      detectedIssueType = 'Unlawful Eviction Defense';
    } else if (text.includes('leak') || text.includes('repair') || text.includes('fix') || text.includes('mold') || text.includes('broken') || text.includes('roof') || text.includes('plumbing') || text.includes('drainage') || text.includes('habitab')) {
      disputeCategory = 'repairs_habitability';
      detectedIssueType = 'Habitability & Repair Demand';
    } else if (text.includes('lockout') || text.includes('padlock') || text.includes('electricity') || text.includes('power cut') || text.includes('water cut') || text.includes('utility')) {
      disputeCategory = 'lockouts_utilities';
      detectedIssueType = 'Illegal Lockout & Utility Disconnection';
    } else if (text.includes('increase') || text.includes('hike') || text.includes('raise rent') || text.includes('higher rent')) {
      disputeCategory = 'rent_increase';
      detectedIssueType = 'Unlawful Rent Increase';
    } else if (text.includes('deposit') || text.includes('refund') || text.includes('deduct') || text.includes('withhold')) {
      disputeCategory = 'security_deposit';
      detectedIssueType = 'Security Deposit Dispute';
    } else {
      disputeCategory = 'lease_agreement';
      detectedIssueType = 'Tenancy Agreement & Quiet Enjoyment Issue';
    }

    // Extract money amounts (e.g. 800,000 UGX or UGX 800,000)
    const moneyMatch = args.text.match(/(\d[\d,.]*)\s*(ugx|shillings|\$|usd)|(ugx|shillings|\$)\s*(\d[\d,.]*)/i);
    const detectedAmount = moneyMatch ? moneyMatch[0] : undefined;

    // Extract dates
    const dateMatch = args.text.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?|\d{1,2}\/\d{1,2}\/\d{2,4}/i);
    const detectedDate = dateMatch ? dateMatch[0] : undefined;

    // Formulate suggested questions tailored to landlord disputes
    const suggestedQuestions: string[] = [];
    if (disputeCategory === 'security_deposit') {
      suggestedQuestions.push('Did the landlord provide a written statement of deductions or contractor repair receipts?');
      suggestedQuestions.push('Do you have timestamped photos or a signed key handover slip from the move-out date?');
      suggestedQuestions.push('Is rent paid up to date with zero outstanding arrears?');
    } else if (disputeCategory === 'eviction_defense') {
      suggestedQuestions.push('Did the landlord serve a formal written notice with at least 30 calendar days notice under Section 38?');
      suggestedQuestions.push('Has the landlord obtained a court eviction order or are they threatening extrajudicial action?');
      suggestedQuestions.push('Do you have written receipts showing rent is currently paid?');
    } else if (disputeCategory === 'repairs_habitability') {
      suggestedQuestions.push('When did you first notify the landlord or caretaker in writing regarding the repair?');
      suggestedQuestions.push('Do you have clear photos and an independent contractor estimate for the needed repairs?');
      suggestedQuestions.push('Does the defect pose an immediate electrical or health hazard?');
    } else {
      suggestedQuestions.push('Do you have a signed copy of the residential tenancy agreement?');
      suggestedQuestions.push('Have you engaged the local LC1 Chairperson for neighborhood mediation?');
    }

    return {
      area: 'housing' as const,
      disputeCategory,
      confidence: 0.95,
      detectedIssueType,
      jurisdiction: args.jurisdictionHint || 'Uganda',
      extractedEntities: {
        financialAmount: detectedAmount,
        keyDate: detectedDate,
        parties: ['Tenant (Client)', 'Landlord / Property Manager']
      },
      suggestedQuestions
    };
  }
};
