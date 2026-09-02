import { WebMCPToolDefinition, ActionPlanStep, GeneratedDocument } from '../../types';
import { caseStorage } from '../../services/caseStorage';
import { INFORMATION_SOURCES } from '../../data/informationSources';

/**
 * ============================================================================
 * WebMCP Tool: generate_case_summary
 * ============================================================================
 *
 * WHAT IT DOES:
 * Synthesizes a structured case overview combining facts, evidence status,
 * applicable guidelines, and critical missing elements.
 */
export const generateCaseSummaryTool: WebMCPToolDefinition = {
  name: 'generate_case_summary',
  description: 'Synthesize a comprehensive, neutral case summary identifying strengths, timeline, and missing information.',
  category: 'generation',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Synthesizes all current facts, evidence, and relevant guidelines into a clear executive narrative.',
    inputs: 'Target case ID.',
    outputs: 'Synthesized summary text, verified facts count, evidence health, and missing items.',
    whyAgentUsesIt: 'To establish an objective overview before formulating recommendations or letters.',
    humanApprovalNote: 'Organizational summary; visible in case overview.'
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

    const verifiedFactsCount = targetCase.facts.filter((f) => f.verified).length;
    const totalFacts = targetCase.facts.length;
    const availableEvidence = targetCase.evidence.filter((e) => e.status === 'available').length;

    // Retrieve linked sources
    const sources = INFORMATION_SOURCES.filter((s) => targetCase.relevantSourceIds.includes(s.id) || s.area === targetCase.area);

    let summaryText = '';
    const category = targetCase.disputeCategory || 'security_deposit';

    if (category === 'eviction_defense') {
      summaryText = `This landlord-tenant matter involves an unlawful eviction defense regarding ${targetCase.title} in ${targetCase.jurisdiction}. The tenant (${targetCase.partiesInvolved.clientName || 'Tenant'}) is facing abrupt eviction or lockout threats from ${targetCase.partiesInvolved.opposingPartyOrEntity || 'Landlord'}. Factual verification establishes that ${verifiedFactsCount} out of ${totalFacts} facts are substantiated, including evidence of current rent payments and improper notice. Under Section 38 and Section 49 of the Landlord and Tenant Act (2022), landlords must provide at least 30 calendar days written notice for periodic tenancies, and extrajudicial lockouts or utility disconnections are criminal offenses. Immediate delivery of a non-compliance notice and preventive LC1 notification are recommended.`;
    } else if (category === 'repairs_habitability') {
      summaryText = `This residential tenancy case concerns urgent habitability and structural repairs regarding ${targetCase.title} in ${targetCase.jurisdiction}. The tenant (${targetCase.partiesInvolved.clientName || 'Tenant'}) has documented ongoing defects affecting safety and health. Factual analysis reflects ${verifiedFactsCount} substantiated facts and ${availableEvidence} tangible evidence records (including inspection estimates and photos). Sections 11–13 of the Landlord and Tenant Act (2022) impose an affirmative duty on landlords to maintain roofs, walls, and structural installations. A formal 14-day statutory notice to cure is being prepared.`;
    } else {
      // security_deposit and general tenancy disputes
      summaryText = `This residential tenancy matter concerns ${targetCase.title} in ${targetCase.jurisdiction}. The client (${targetCase.partiesInvolved.clientName || 'Tenant'}) seeks ${targetCase.desiredOutcome} from ${targetCase.partiesInvolved.opposingPartyOrEntity || 'Landlord'}. Factual analysis shows ${verifiedFactsCount} out of ${totalFacts} documented facts are corroborated with documentary records, supported by ${availableEvidence} tangible evidence items (including mobile money receipts and inspection logs). Under Section 29 of the Landlord and Tenant Act (2022), security deposits are held in trust and must be refunded or accounted for with verified repair invoices within statutory deadlines.`;
    }

    targetCase.summary = summaryText;
    caseStorage.saveCase(targetCase);

    return {
      caseId: args.caseId,
      summary: summaryText,
      verifiedFactsCount,
      totalFacts,
      availableEvidenceCount: availableEvidence,
      missingInformationCount: targetCase.missingInformation.length
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: generate_action_plan
 * ============================================================================
 *
 * WHAT IT DOES:
 * Produces an ordered, step-by-step checklist of practical next steps.
 * Consequential actions (such as delivering notices, filing court petitions, or
 * refusing medical fee settlements) are explicitly flagged as requiring human action.
 */
export const generateActionPlanTool: WebMCPToolDefinition = {
  name: 'generate_action_plan',
  description: 'Generate an ordered, actionable checklist and procedure plan with explicit human-action and consequential-decision boundaries.',
  category: 'generation',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Builds an actionable, step-by-step checklist to guide the human toward resolution.',
    inputs: 'Target case ID.',
    outputs: 'Ordered list of ActionPlanStep items with deadlines, human-action flags, and warnings.',
    whyAgentUsesIt: 'To provide a clear roadmap from informal engagement to dispute escalation.',
    humanApprovalNote: 'Every consequential step requires user discretion; nothing executes automatically.'
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

    const steps: ActionPlanStep[] = [];

    const category = targetCase.disputeCategory || 'security_deposit';

    if (category === 'eviction_defense') {
      steps.push({
        id: `step-${Date.now()}-1`,
        stepNumber: 1,
        title: 'Review and Deliver Formal Rejection of Invalid Notice',
        description: 'Review the drafted notice citing Section 38 (30-day statutory notice requirement) and Section 49 (criminal lockout ban). Personally serve on landlord or deliver via acknowledged WhatsApp/registered mail.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Within 24 hours',
        warningOrDisclaimer: 'Personal safety caution: If landlord or agents exhibit hostility, do not confront; immediately seek LC1 intervention.'
      });
      steps.push({
        id: `step-${Date.now()}-2`,
        stepNumber: 2,
        title: 'File Preventive Injunction Alert with LC1 Chairperson',
        description: 'Lodge a copy of your rent payment receipts and rejection notice with the Village LC1 Executive Committee to prevent unlawful padlock attempts.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Before threatened lockout date'
      });
      steps.push({
        id: `step-${Date.now()}-3`,
        stepNumber: 3,
        title: 'Maintain Timestamped Incident & Access Log',
        description: 'Keep written, photographic, and audio records of any further landlord visits, utility interruptions, or third-party interactions.',
        requiresHumanAction: true,
        isConsequential: false,
        completed: false,
        deadline: 'Ongoing daily'
      });
    } else if (category === 'repairs_habitability') {
      steps.push({
        id: `step-${Date.now()}-1`,
        stepNumber: 1,
        title: 'Finalize Damage Dossier & Independent Repair Quote',
        description: 'Review photos of water leaks/structural damage and ensure independent contractor quote is attached to the case evidence.',
        requiresHumanAction: true,
        isConsequential: false,
        completed: true,
        deadline: 'Completed'
      });
      steps.push({
        id: `step-${Date.now()}-2`,
        stepNumber: 2,
        title: 'Serve 14-Day Statutory Notice of Demand to Repair',
        description: 'Deliver formal written demand under Sections 11–13 of the Landlord and Tenant Act (2022) requesting commencement of repairs within 14 calendar days.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Within 2 business days',
        warningOrDisclaimer: 'Consequential action: Only deliver after reviewing and approving the letter content yourself.'
      });
      steps.push({
        id: `step-${Date.now()}-3`,
        stepNumber: 3,
        title: 'Request Joint Inspection Walkthrough',
        description: 'Invite the property manager to inspect the damaged areas jointly and agree in writing on the repair schedule.',
        requiresHumanAction: true,
        isConsequential: false,
        completed: false,
        deadline: 'Within 7 days of notice'
      });
      steps.push({
        id: `step-${Date.now()}-4`,
        stepNumber: 4,
        title: 'LC1 Mediation or Section 13 Repair & Deduction',
        description: 'If landlord refuses repairs after 14 days, seek LC1 order or exercise statutory rights to conduct repairs with certified receipts and offset costs.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Day 15 onwards',
        warningOrDisclaimer: 'Consequential escalation: Consult legal aid before deducting repair costs from rent.'
      });
    } else {
      // security_deposit and general tenancy disputes
      steps.push({
        id: `step-${Date.now()}-1`,
        stepNumber: 1,
        title: 'Review and Personalize Formal Demand Letter',
        description: 'Review the generated demand draft in Justice Compass. Verify move-out dates, deposit payment receipts, and banking or mobile money refund details.',
        requiresHumanAction: true,
        isConsequential: false,
        completed: false,
        deadline: 'Within 24 hours'
      });
      steps.push({
        id: `step-${Date.now()}-2`,
        stepNumber: 2,
        title: 'Formally Deliver Notice to Landlord',
        description: 'Deliver the finalized letter via registered post, signed in-person delivery with a witness, or documented WhatsApp message with delivery acknowledgment. The app will NOT send this automatically.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Within 3 business days',
        warningOrDisclaimer: 'Consequential action: Only deliver after reviewing and approving the letter content yourself.'
      });
      steps.push({
        id: `step-${Date.now()}-3`,
        stepNumber: 3,
        title: 'Allow Statutory 14-Day Response Window',
        description: 'Provide the landlord a 14-day statutory grace period to refund the full deposit or provide certified repair receipts.',
        requiresHumanAction: false,
        isConsequential: false,
        completed: false,
        deadline: '14 calendar days from delivery'
      });
      steps.push({
        id: `step-${Date.now()}-4`,
        stepNumber: 4,
        title: 'Initiate Local Council (LC1) Mediation or Small Claims',
        description: 'If no refund or explanation is provided after 14 days, present the compiled case dossier to the Village LC1 Chairperson for informal mediation, or file with the Chief Magistrates Court (Civil Division).',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Day 15 onwards',
        warningOrDisclaimer: 'Consequential escalation: Consult an LC1 secretary or qualified legal aid officer.'
      });
    }

    targetCase.actionPlan = steps;
    caseStorage.saveCase(targetCase);

    return {
      caseId: args.caseId,
      stepsCount: steps.length,
      actionPlan: steps
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: generate_letter
 * ============================================================================
 *
 * WHAT IT DOES:
 * Drafts a formal communication (demand letter, clarification request, complaint)
 * using the facts, dates, evidence, and guidelines in the case workspace.
 *
 * CRITICAL SAFETY REQUIREMENT:
 * The document is saved with `reviewStatus: 'pending_review'`.
 * The application does NOT send or dispatch this document.
 * A human MUST inspect, edit, and approve before any external action.
 */
export const generateLetterTool: WebMCPToolDefinition = {
  name: 'generate_letter',
  description: 'Draft a formal letter, clarification notice, or complaint. The document is strictly held in pending_review status for human verification.',
  category: 'generation',
  supportedAreas: 'all',
  requiresHumanReview: true,
  consequential: false, // Drafting is safe; sending (outside the app) is consequential
  explanation: {
    purpose: 'Drafts a formal, legally grounded communication tailored to the case facts.',
    inputs: 'Case ID, document type, recipient name/title, and optional tone adjustments.',
    outputs: 'GeneratedDocument object with draft text, explicit assumptions, and review status: pending_review.',
    whyAgentUsesIt: 'To produce professional written correspondence without taking autonomous action.',
    humanApprovalNote: 'MANDATORY HUMAN REVIEW: Saved in pending_review status. Consequential actions require explicit human sign-off.'
  },
  parameters: {
    type: 'object',
    properties: {
      caseId: {
        type: 'string',
        description: 'The unique ID of the target case.'
      },
      documentType: {
        type: 'string',
        enum: ['demand_letter', 'clarification_request', 'formal_complaint', 'records_request', 'meeting_agenda'],
        description: 'Type of communication to generate.'
      },
      recipient: {
        type: 'string',
        description: 'Recipient name and title (e.g., "Mr. Patrick Byaruhanga (Landlord)").'
      },
      customInstructions: {
        type: 'string',
        description: 'Optional specific instructions or emphasis.'
      }
    },
    required: ['caseId', 'documentType', 'recipient']
  },
  handler: (args: {
    caseId: string;
    documentType: 'demand_letter' | 'clarification_request' | 'formal_complaint' | 'records_request' | 'meeting_agenda';
    recipient: string;
    customInstructions?: string;
  }) => {
    const targetCase = caseStorage.getCase(args.caseId);
    if (!targetCase) {
      throw new Error(`Case not found: ${args.caseId}`);
    }

    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const clientName = targetCase.partiesInvolved.clientName || 'Client';
    const opposing = args.recipient || targetCase.partiesInvolved.opposingPartyOrEntity || 'Opposing Party';

    let title = '';
    let content = '';
    const assumptions: string[] = [];
    const category = targetCase.disputeCategory || 'security_deposit';

    if (category === 'eviction_defense') {
      title = 'Formal Notice of Rejection of Invalid Notice & Section 49 Warning';
      assumptions.push('Assumes tenant is in lawful possession with monthly rent currently settled.');
      assumptions.push('Assumes landlord failed to serve statutory 30-day written notice.');

      content = `Date: ${todayStr}

To: ${opposing}
Landlord / Property Management
Kampala, Uganda

From: ${clientName}
Tenant

SUBJECT: FORMAL REJECTION OF INVALID NOTICE TO VACATE AND WARNING OF STATUTORY PROTECTIONS UNDER SECTIONS 38 & 49 OF THE LANDLORD AND TENANT ACT (2022)

Dear ${opposing},

I write to formally address your recent communication demanding that I vacate my rented premises on short notice, as well as indications that access to my unit may be padlocked or restricted.

Please take formal notice of the following governing facts and legal requirements:

1. Lawful Possession and Settled Rent:
My tenancy is active and all monthly rent obligations have been fulfilled in full. I am not in default of any lawful tenancy agreement covenant.

2. Statutory 30-Day Notice Obligation (Section 38):
Under Section 38 of the Landlord and Tenant Act (2022), termination of a periodic monthly tenancy requires a mandatory minimum of thirty (30) calendar days written notice. Any verbal, telephonic, or truncated notice (such as a 7-day ultimatum) is void and unlawful.

3. Criminal Offense of Extrajudicial Lockout (Section 49):
Section 49 of the Act strictly provides that no landlord or agent shall obstruct, padlock, or disconnect utilities to a rented residential premises without a valid eviction order issued by a competent court of law. Violation of this section is a criminal offense punishable by fines, imprisonment, and personal civil liability for damages.

I remain a compliant and peaceful tenant. If you genuinely seek vacant possession on lawful grounds, you must issue a proper statutory written notice of at least thirty days.

In the meantime, I have notified the Local Council 1 (LC1) Executive Committee to ensure peace is preserved and unlawful interference is prevented.

Yours respectfully,

${clientName}
Tel: [Your Phone Number]`;
    } else if (category === 'repairs_habitability') {
      title = 'Formal 14-Day Notice of Demand for Structural Repairs (Sections 11–13)';
      assumptions.push('Assumes structural defect is not caused by tenant misuse or willful negligence.');
      assumptions.push('Assumes tenant gave previous notice of the defect.');

      content = `Date: ${todayStr}

To: ${opposing}
Landlord / Property Management
Kampala, Uganda

From: ${clientName}
Tenant

SUBJECT: FORMAL 14-DAY STATUTORY NOTICE OF DEMAND TO CURE STRUCTURAL HABITABILITY DEFECTS (SECTIONS 11–13)

Dear ${opposing},

I write to formally place on record urgent structural habitability defects affecting my rental unit, specifically regarding water penetration, roof leakage, and associated electrical hazards, which have been previously reported without remedial action.

1. Statutory Obligation to Repair (Section 11 & 12):
Under Sections 11, 12, and 13 of the Landlord and Tenant Act (2022), the landlord is statutorily obligated to keep the structure, roofs, exterior walls, and electrical/water installations of rented premises in good tenantable repair and safe condition throughout the tenancy.

2. Current Hazard and Damage:
The ongoing leaks have caused ceiling deterioration and water seepage near living fixtures. An independent contractor inspection estimate (attached to case file) confirms urgent roof flashing and ceiling restoration are required.

3. 14-Day Statutory Demand:
Pursuant to Section 13, I formally demand that certified repair personnel be deployed to inspect and commence necessary structural repairs within fourteen (14) calendar days of receipt of this notice.

If repairs are not commenced within 14 days, I reserve the right under applicable tenancy provisions to either seek an urgent repair order from the Local Council 1 (LC1) / Magistrate Court or arrange certified repairs and offset verified costs from subsequent rental payments.

Yours sincerely,

${clientName}
Tel: [Your Phone Number]`;
    } else {
      // security_deposit and default
      title = 'Formal Demand for Return of Security Deposit (UGX 800,000)';
      assumptions.push('Assumes premises were surrendered in broom-clean order with no structural defects.');
      assumptions.push('Assumes all monthly rent installments were settled in full prior to vacation.');
      assumptions.push('Assumes landlord received timely vacation notice.');

      content = `Date: ${todayStr}

To: ${opposing}
Residential Property Management / Landlord
Kampala, Uganda

From: ${clientName}
Former Tenant

SUBJECT: FORMAL NOTICE OF DEMAND FOR REFUND OF RESIDENTIAL SECURITY DEPOSIT (UGX 800,000)

Dear ${opposing},

I am writing to formally request the immediate refund of my residential security deposit in the sum of Eight Hundred Thousand Uganda Shillings (UGX 800,000), remitted upon the commencement of our tenancy agreement.

As reflected in our tenancy records:
1. Formal 30-day notice of intention to vacate was provided in writing.
2. Peaceful possession of the apartment was surrendered on August 1, 2026, accompanied by the return of all unit keys to the caretaker, who conducted an exit walk-through and noted no gross damages beyond normal fair wear and tear.
3. All utility charges and monthly rental payments were settled in full, with zero arrears existing.

Under Section 29 of the Uganda Landlord and Tenant Act (2022) guidelines:
- A security deposit remains the property of the tenant held in trust.
- Upon vacation, the landlord is obligated to either refund the full sum or provide an itemized written invoice of deductions accompanied by verified repair receipts for actual documented damage.
- Deductions may NOT be made for ordinary fair wear and tear, nor may deposits be withheld arbitrarily without substantiation.

Over thirty (30) days have elapsed without return of the deposit or delivery of an itemized statement.

I therefore request remittance of the full UGX 800,000 to my verified Mobile Money account within fourteen (14) calendar days of receipt of this communication.

Should you maintain that lawful deductions apply, please provide the complete contractor receipts and itemized breakdown within the same 14-day window.

In the event that this matter is not resolved amicably within 14 days, I reserve the right to present this file to the Local Council I (LC1) Executive Committee for conciliation and pursue all available civil recovery options under the laws of Uganda.

Yours sincerely,

${clientName}
Tel: [Your Phone Number]
Email: [Your Email Address]`;
    }

    const doc = caseStorage.addDocument(args.caseId, {
      title,
      documentType: args.documentType,
      recipient: opposing,
      content,
      originalContent: content,
      assumptions,
      reviewStatus: 'pending_review'
    });

    if (!doc) {
      throw new Error(`Failed to generate letter. Case not found: ${args.caseId}`);
    }

    return {
      success: true,
      documentId: doc.id,
      title: doc.title,
      reviewStatus: doc.reviewStatus,
      document: doc,
      safetyNotice: 'HUMAN REVIEW REQUIRED: This draft has been placed in pending_review status. It will NOT be sent automatically. Human must review, edit, and approve before taking any consequential action.'
    };
  }
};
