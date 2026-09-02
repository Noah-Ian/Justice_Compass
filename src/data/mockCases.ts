import { Case } from '../types';

export const INITIAL_MOCK_CASES: Case[] = [
  {
    id: 'case-housing-001',
    title: 'Security Deposit Refund (800,000 UGX)',
    area: 'housing',
    disputeCategory: 'security_deposit',
    issueType: 'Security Deposit Dispute',
    description:
      'I moved out of my rental apartment on August 1st after giving proper 30-day notice. I paid a security deposit of 800,000 UGX upon moving in. The landlord has refused to refund my deposit and refuses to provide any explanation, repair estimate, or deduction breakdown.',
    jurisdiction: 'Uganda',
    status: 'pending_human_review',
    partiesInvolved: {
      clientName: 'Faith Nakato',
      opposingPartyOrEntity: 'Mr. Patrick Byaruhanga (Landlord)',
      relationship: 'Former Residential Tenant and Landlord'
    },
    desiredOutcome:
      'Full refund of the 800,000 UGX security deposit or an official, itemized justification for any lawful deductions with original receipts within 14 days.',
    facts: [
      {
        id: 'fact-101',
        statement: 'Paid 800,000 UGX security deposit upon signing the tenancy agreement on August 1st of the prior year.',
        date: '2025-08-01',
        sourceOrWitness: 'Mobile Money Confirmation & Tenancy Clause 4',
        category: 'financial',
        verified: true,
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-02T10:00:00Z'
      },
      {
        id: 'fact-102',
        statement: 'Tenant served written 30-day notice of termination on June 28th via signed letter and acknowledged WhatsApp message.',
        date: '2026-06-28',
        sourceOrWitness: 'Letter copy & WhatsApp chat logs',
        category: 'communication',
        verified: true,
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-02T10:05:00Z'
      },
      {
        id: 'fact-103',
        statement: 'Tenant vacated the premises on August 1st, 2026, and handed keys to the building caretaker Mr. Joseph Mukasa.',
        date: '2026-08-01',
        sourceOrWitness: 'Caretaker Key Handover Acknowledgment Sheet',
        category: 'timeline',
        verified: true,
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-02T10:07:00Z'
      },
      {
        id: 'fact-104',
        statement: 'All monthly rental obligations were paid in full with zero arrears at the date of exit.',
        date: '2026-08-01',
        sourceOrWitness: 'Bank statement ledger showing 12 monthly rent transfers',
        category: 'financial',
        verified: true,
        addedBy: 'human',
        createdAt: '2026-08-02T10:10:00Z'
      },
      {
        id: 'fact-105',
        statement: 'Landlord has not provided an inspection checklist, deduction itemization, or refund after repeated verbal inquiries.',
        date: '2026-08-15',
        sourceOrWitness: 'Phone call records & unanswered text reminders',
        category: 'communication',
        verified: false,
        addedBy: 'human',
        createdAt: '2026-08-16T14:30:00Z'
      }
    ],
    evidence: [
      {
        id: 'evi-101',
        title: 'Initial Security Deposit Mobile Money Receipt',
        evidenceType: 'receipt',
        description: 'MTN Mobile Money transaction receipt for 800,000 UGX to Patrick Byaruhanga.',
        date: '2025-08-01',
        fileReference: 'MM_TxID_9812450.pdf',
        status: 'available',
        significance: 'Irrefutable proof that the deposit was paid and received by the landlord.',
        addedBy: 'human',
        createdAt: '2026-08-02T10:15:00Z'
      },
      {
        id: 'evi-102',
        title: 'Executed Residential Tenancy Agreement',
        evidenceType: 'lease_contract',
        description: 'Signed agreement specifying 800,000 UGX deposit refundable upon vacant possession subject to inspection.',
        date: '2025-08-01',
        fileReference: 'Residential_Tenancy_Agreement_Signed.pdf',
        status: 'available',
        significance: 'Defines contractual obligation to return deposit upon peaceful vacation.',
        addedBy: 'human',
        createdAt: '2026-08-02T10:18:00Z'
      },
      {
        id: 'evi-103',
        title: 'Move-out Inspection Photographs',
        evidenceType: 'photo',
        description: 'Set of 8 timestamped high-resolution photos showing clean walls, functional fixtures, and broom-swept floors on exit day.',
        date: '2026-08-01',
        fileReference: 'Apartment_Exit_Inspection_8Photos.zip',
        status: 'available',
        significance: 'Disproves any prospective claims of gross damage beyond normal wear and tear.',
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-02T10:20:00Z'
      },
      {
        id: 'evi-104',
        title: 'Caretaker Key Handover Note',
        evidenceType: 'message_log',
        description: 'Physical receipt slip signed by Caretaker Mr. Joseph Mukasa verifying keys returned.',
        date: '2026-08-01',
        fileReference: 'Key_Handover_Signed_Slip.jpg',
        status: 'available',
        significance: 'Confirms tenant completely relinquished possession on August 1st, 2026.',
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-02T10:22:00Z'
      }
    ],
    relevantSourceIds: ['src-housing-001', 'src-housing-003'],
    missingInformation: [
      'Written confirmation from landlord if any specific repairs or utility balance is claimed',
      'Exact registered postal or physical address for formal process delivery if WhatsApp is ignored'
    ],
    summary:
      'Former tenant Faith Nakato vacated residential premises on August 1st, 2026, having paid 800,000 UGX security deposit and all rent in full. Documented evidence confirms broom-clean condition and key handover to caretaker. Under Section 29 of the Landlord and Tenant Act (2022) guidelines, the landlord has exceeded statutory timelines without providing either a refund or an itemized breakdown of deductions. A formal demand notice is prepared for human review prior to service.',
    actionPlan: [
      {
        id: 'step-101',
        stepNumber: 1,
        title: 'Review and Personalize Demand Letter',
        description: 'Carefully review the draft letter to verify your contact information, exact dates, and preferred payment mode. You can edit the text directly before approving.',
        requiresHumanAction: true,
        isConsequential: false,
        completed: true,
        deadline: 'Immediate'
      },
      {
        id: 'step-102',
        stepNumber: 2,
        title: 'Formally Serve Notice to Landlord',
        description: 'Deliver the approved letter via a traceable method (hand delivery with signed duplicate receiving copy or registered messaging). Justice Compass will NOT send this automatically.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Within 3 business days',
        warningOrDisclaimer: 'Consequential step: Only send after your personal verification of facts.'
      },
      {
        id: 'step-103',
        stepNumber: 3,
        title: 'Observe 14-Day Statutory Grace Period',
        description: 'Give the landlord 14 calendar days from documented receipt to either refund 800,000 UGX or provide certified receipts for disputed deductions.',
        requiresHumanAction: false,
        isConsequential: false,
        completed: false,
        deadline: '14 days post-delivery'
      },
      {
        id: 'step-104',
        stepNumber: 4,
        title: 'Lodge LC1 Mediation Request if Unresolved',
        description: 'If no response is received, present the case file (demand letter, handover slip, payment receipts) to the Village LC1 Chairperson for amicable local council arbitration.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Day 15 onwards'
      }
    ],
    documents: [
      {
        id: 'doc-101',
        caseId: 'case-housing-001',
        title: 'Formal Demand for Return of Security Deposit',
        documentType: 'demand_letter',
        recipient: 'Mr. Patrick Byaruhanga (Landlord)',
        content: `Date: August 20, 2026

To: Mr. Patrick Byaruhanga
Landlord / Property Manager
Plot 14, Kira Road, Kampala

From: Faith Nakato
Former Tenant, Apartment 3B

SUBJECT: FORMAL DEMAND FOR REFUND OF RESIDENTIAL SECURITY DEPOSIT (UGX 800,000)

Dear Mr. Byaruhanga,

I am writing to formally request the immediate refund of my residential security deposit amounting to Eight Hundred Thousand Uganda Shillings (UGX 800,000), paid upon the commencement of my tenancy on August 1, 2025.

As documented in our records:
1. On June 28, 2026, I provided you with full 30-day written notice of my intention to vacate Apartment 3B effective August 1, 2026.
2. On August 1, 2026, I surrendered vacant possession and handed over all keys to the building caretaker, Mr. Joseph Mukasa, who completed a joint walk-through and acknowledged the broom-swept, orderly condition of the premises.
3. All monthly rent through August 1, 2026, has been paid in full, and no rental arrears exist.

Under Section 29 of the Landlord and Tenant Act (2022) guidelines, a landlord holding a security deposit must, upon vacation, either return the full sum or provide an itemized written statement of lawful deductions accompanied by genuine receipts for repair of damage beyond normal wear and tear.

To date, over nineteen (19) days have elapsed without receipt of either the refund or any written justification.

Please arrange for the full remittance of UGX 800,000 to my registered Mobile Money number (077X-XXX-XXX) within fourteen (14) calendar days of receipt of this notice (on or before September 3, 2026).

Should you have any documented deductions for damage beyond reasonable wear and tear, please provide the itemized invoice and corresponding contractor receipts within this same period.

In the event of no response or continued withholding without cause, I reserve the right to seek conciliation through the Local Council (LC1) Executive Committee and explore available remedies under the civil law of Uganda.

Yours sincerely,

Faith Nakato
Former Tenant, Apartment 3B
Tel: +256 770 000 000`,
        originalContent: `Date: August 20, 2026...`,
        assumptions: [
          'Assumes the tenant caused no structural damage beyond ordinary fair wear and tear.',
          'Assumes rent was paid up to date as demonstrated in bank ledger records.',
          'Assumes keys were officially received by caretaker on August 1, 2026.'
        ],
        reviewStatus: 'pending_review',
        createdAt: '2026-08-20T11:00:00Z'
      }
    ],
    createdAt: '2026-08-02T09:30:00Z',
    updatedAt: '2026-08-20T11:30:00Z'
  },
  {
    id: 'case-housing-002',
    title: 'Unlawful 7-Day Eviction Notice & Padlock Lockout Threat',
    area: 'housing',
    disputeCategory: 'eviction_defense',
    issueType: 'Unlawful Eviction Defense & Lockout Injunction',
    description:
      'Landlord served an abrupt 7-day verbal and WhatsApp ultimatum demanding immediate vacation of residential unit without the mandatory 30-day statutory notice or a court eviction order, threatening to padlock doors and disconnect electricity.',
    jurisdiction: 'Uganda',
    status: 'action_ready',
    partiesInvolved: {
      clientName: 'Ronald Kato',
      opposingPartyOrEntity: 'Hajji Musa Ssemwogerere (Landlord)',
      relationship: 'Residential Monthly Tenant and Landlord'
    },
    desiredOutcome:
      'Immediate retraction of invalid 7-day notice, cessation of illegal lockout threats, and enforcement of statutory 30-day notice rights under Section 38 of the Landlord and Tenant Act (2022).',
    facts: [
      {
        id: 'fact-201',
        statement: 'Tenant has resided continuously in Unit 4 since January 2024 under a periodic monthly tenancy.',
        date: '2024-01-15',
        sourceOrWitness: 'Tenancy agreement and initial deposit receipt',
        category: 'timeline',
        verified: true,
        addedBy: 'human',
        createdAt: '2026-08-11T09:00:00Z'
      },
      {
        id: 'fact-202',
        statement: 'Rent is paid in full up to the current calendar month with zero rent arrears.',
        date: '2026-08-01',
        sourceOrWitness: 'Airtel Money payment confirmations to Landlord wallet',
        category: 'financial',
        verified: true,
        addedBy: 'human',
        createdAt: '2026-08-11T09:05:00Z'
      },
      {
        id: 'fact-203',
        statement: 'Landlord sent WhatsApp audio and text on August 10th demanding vacation within 7 days because he found a higher bidder.',
        date: '2026-08-10',
        sourceOrWitness: 'WhatsApp text and audio export with timestamp',
        category: 'communication',
        verified: true,
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-11T09:10:00Z'
      },
      {
        id: 'fact-204',
        statement: 'Landlord threatened in person to place master padlocks on the outer security grill on August 18th.',
        date: '2026-08-12',
        sourceOrWitness: 'Neighbor witness statement by Mr. Brian Otim (Unit 5)',
        category: 'communication',
        verified: true,
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-12T09:12:00Z'
      }
    ],
    evidence: [
      {
        id: 'evi-201',
        title: 'Current Month Rent Payment Confirmation (650,000 UGX)',
        evidenceType: 'receipt',
        description: 'Electronic payment receipt proving rent for August 2026 was received in full.',
        date: '2026-08-01',
        fileReference: 'Airtel_Money_Rent_Aug2026.pdf',
        status: 'available',
        significance: 'Confirms tenant is in lawful possession with no lease default or non-payment.',
        addedBy: 'human',
        createdAt: '2026-08-11T09:20:00Z'
      },
      {
        id: 'evi-202',
        title: 'Exported WhatsApp Messages and Voice Threats',
        evidenceType: 'message_log',
        description: 'Screenshots and audio recordings of landlord giving 7 days notice and lockout threats.',
        date: '2026-08-10',
        fileReference: 'WhatsApp_Landlord_Threats_Aug10.zip',
        status: 'available',
        significance: 'Direct evidence of failure to observe statutory 30-day notice and intent to execute illegal lockout.',
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-11T09:25:00Z'
      }
    ],
    relevantSourceIds: ['src-housing-002', 'src-housing-004'],
    missingInformation: [
      'Written tenancy agreement copy (tenant possesses electronic receipt records; copy requested from landlord)'
    ],
    summary:
      'Tenant Ronald Kato is in lawful occupation of Unit 4 with rent fully paid. Landlord Hajji Musa served an invalid 7-day verbal/WhatsApp notice and threatened unlawful lockout. Under Section 38 and Section 49 of the Landlord and Tenant Act (2022), a 30-day written notice is mandatory and padlocking/utility shutoffs are criminal offenses. Notice of statutory non-compliance and LC1 injunction alert prepared and approved by human.',
    actionPlan: [
      {
        id: 'step-201',
        stepNumber: 1,
        title: 'Deliver Formal Notice of Non-Compliance & Protection Under Section 38',
        description: 'Serve formal letter citing Section 38 statutory 30-day notice requirements and Section 49 penalties for unlawful lockout. Keep signed receiving copy.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Immediate (within 24 hours)',
        warningOrDisclaimer: 'Personal safety caution: If landlord behaves aggressively, do not engage physically; seek LC1 mediation.'
      },
      {
        id: 'step-202',
        stepNumber: 2,
        title: 'Alert Local Council 1 (LC1) Chairperson for Preventive Injunction',
        description: 'Present the case file and notice to the LC1 Village Chairman to forestall any unauthorized padlock attempt on August 18th.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Before August 17, 2026'
      }
    ],
    documents: [
      {
        id: 'doc-201',
        caseId: 'case-housing-002',
        title: 'Formal Notice of Rejection of Invalid Notice & Warning Under Section 49',
        documentType: 'formal_complaint',
        recipient: 'Hajji Musa Ssemwogerere (Landlord)',
        content: `Date: August 13, 2026

To: Hajji Musa Ssemwogerere
Landlord, Residential Units Plot 22, Ntinda, Kampala

From: Ronald Kato
Tenant, Unit 4

SUBJECT: FORMAL REJECTION OF INVALID 7-DAY NOTICE TO VACATE AND NOTICE OF STATUTORY RIGHTS UNDER SECTIONS 38 & 49 OF THE LANDLORD AND TENANT ACT (2022)

Dear Hajji Musa,

I refer to your communication dated August 10, 2026, requesting that I vacate Unit 4 within seven (7) days, and your verbal notification regarding padlocking the security grill.

I write to formally advise you of the following facts and governing statutory provisions:

1. Lawful Possession and Zero Rent Arrears:
As confirmed by electronic payment transfer on August 1, 2026 (Receipt Ref: AM-992140), my rent of UGX 650,000 for the full month of August 2026 was accepted and is paid in full. I am not in default of any tenancy covenant.

2. Statutory Notice Requirements (Section 38):
Under Section 38 of the Landlord and Tenant Act (2022), the termination of a monthly tenancy requires a minimum of thirty (30) calendar days written notice. A 7-day verbal or messaging ultimatum is invalid and of no legal effect.

3. Criminalization of Lockouts and Disconnections (Section 49):
Section 49 of the Landlord and Tenant Act (2022) explicitly provides that no landlord or agent shall disconnect utilities or change, padlock, or obstruct access to a tenant's rented premises without a valid eviction order from a competent court. Violations constitute a criminal offense punishable by fine, imprisonment, and civil damages.

I remain a peaceful and compliant tenant. Should you genuinely require vacant possession upon lawful grounds, you must issue a proper written notice in accordance with statutory thirty-day timelines.

In the meantime, I have submitted a copy of this notice and payment confirmation to the LC1 Executive Committee for peace preservation.

Yours respectfully,

Ronald Kato
Tenant, Unit 4
Tel: +256 752 000 000`,
        originalContent: `Date: August 13, 2026...`,
        assumptions: [
          'Assumes August rent was paid and received as indicated in Airtel Money ledger.',
          'Assumes no prior written statutory 30-day notice was served.'
        ],
        reviewStatus: 'approved',
        humanNotes: 'Reviewed and confirmed accurate with neighbor witness. Ready for delivery.',
        reviewedAt: '2026-08-13T14:00:00Z',
        createdAt: '2026-08-13T10:00:00Z'
      }
    ],
    createdAt: '2026-08-11T08:30:00Z',
    updatedAt: '2026-08-13T14:00:00Z'
  },
  {
    id: 'case-housing-003',
    title: 'Urgent Roof Leak & Habitability Repair Demand',
    area: 'housing',
    disputeCategory: 'repairs_habitability',
    issueType: 'Habitability & Structural Repair Obligation',
    description:
      'Severe roof leak in living room and kitchen causing ceiling damage and electrical hazard during rainy season. Landlord and property manager have ignored three consecutive repair requests across four weeks.',
    jurisdiction: 'Uganda',
    status: 'gathering_facts',
    partiesInvolved: {
      clientName: 'Amina Nassolo',
      opposingPartyOrEntity: 'Crested Properties & Estate Management',
      relationship: 'Residential Tenant and Property Management Agency'
    },
    desiredOutcome:
      'Immediate contractor inspection and repair of compromised roof flashing and damaged ceiling within 14 days under Sections 11-13 of the Landlord and Tenant Act (2022).',
    facts: [
      {
        id: 'fact-301',
        statement: 'Severe rain penetration started on July 14th after torrential storm, damaging ceiling boards in living room.',
        date: '2026-07-14',
        sourceOrWitness: 'Timestamped video of active water dripping',
        category: 'condition',
        verified: true,
        addedBy: 'human',
        createdAt: '2026-08-06T11:00:00Z'
      },
      {
        id: 'fact-302',
        statement: 'Tenant reported problem via WhatsApp to Property Manager Mr. Douglas Kasule on July 15th, July 25th, and August 2nd.',
        date: '2026-08-02',
        sourceOrWitness: 'WhatsApp chat history with acknowledged read receipts',
        category: 'communication',
        verified: true,
        addedBy: 'human',
        createdAt: '2026-08-06T11:05:00Z'
      },
      {
        id: 'fact-303',
        statement: 'Water seepage has reached the living room ceiling light fixture causing short-circuit risk.',
        date: '2026-08-05',
        sourceOrWitness: 'Electrician safety assessment note by Sparkline Electricals',
        category: 'condition',
        verified: true,
        addedBy: 'agent_webmcp',
        createdAt: '2026-08-06T11:10:00Z'
      }
    ],
    evidence: [
      {
        id: 'evi-301',
        title: 'Ceiling Water Damage & Mold Photos (6 photos)',
        evidenceType: 'photo',
        description: 'Photographic evidence showing water staining, sagging plasterboard, and buckets on living room floor.',
        date: '2026-07-28',
        fileReference: 'Roof_Leak_Damage_Photos.zip',
        status: 'available',
        significance: 'Proves substantial habitability defect and tenant distress.',
        addedBy: 'human',
        createdAt: '2026-08-06T11:15:00Z'
      },
      {
        id: 'evi-302',
        title: 'Independent Roofing Contractor Inspection Estimate (450,000 UGX)',
        evidenceType: 'receipt',
        description: 'Detailed quote from licensed builder for re-sealing roof valley flashing and replacing 2 iron sheets.',
        date: '2026-08-04',
        fileReference: 'Contractor_Roof_Quote_Kigozi.pdf',
        status: 'available',
        significance: 'Establishes precise cost to cure structural defect.',
        addedBy: 'human',
        createdAt: '2026-08-06T11:20:00Z'
      }
    ],
    relevantSourceIds: ['src-housing-003', 'src-housing-006'],
    missingInformation: [
      'Copy of formal lease agreement clause on repairs (clause 6 covers structural obligations)',
      'Written confirmation from landlord if they have an assigned preferred maintenance vendor'
    ],
    summary:
      'Tenant Amina Nassolo has experienced severe roof leaks since mid-July. Three informal notifications have been ignored by Crested Properties. Under Sections 11-13 of the Landlord and Tenant Act (2022), landlords have a mandatory obligation to maintain structural integrity, roofs, and drainage. Formal 14-day statutory demand to repair is being assembled with attached contractor quote.',
    actionPlan: [
      {
        id: 'step-301',
        stepNumber: 1,
        title: 'Compile Complete Photographic & Electrical Safety Dossier',
        description: 'Attach the electrician\'s hazard warning note and contractor estimate to the case file.',
        requiresHumanAction: true,
        isConsequential: false,
        completed: true,
        deadline: 'Completed'
      },
      {
        id: 'step-302',
        stepNumber: 2,
        title: 'Review and Serve 14-Day Statutory Notice of Repair',
        description: 'Deliver formal notice demanding repairs within 14 calendar days or seeking authorization to execute repairs and deduct costs from rent as provided under tenancy principles.',
        requiresHumanAction: true,
        isConsequential: true,
        completed: false,
        deadline: 'Within 2 business days'
      }
    ],
    documents: [],
    createdAt: '2026-08-06T10:00:00Z',
    updatedAt: '2026-08-09T14:30:00Z'
  }
];
