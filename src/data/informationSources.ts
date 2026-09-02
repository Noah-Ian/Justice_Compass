import { InformationSource } from '../types';

export const INFORMATION_SOURCES: InformationSource[] = [
  // --- LANDLORD & TENANT DISPUTE GUIDELINES ---
  {
    id: 'src-housing-001',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Security Deposit Refunds & Deductions',
    title: 'Security Deposit Deductions, Itemized Receipts & 30-Day Return Rules',
    summary:
      'Under Section 29 of the Landlord and Tenant Act (2022), a security deposit must not exceed one month of rent for residential tenancies and remains the property of the tenant held in trust. Upon vacant possession, the landlord must refund the full deposit within statutory timelines (typically 30 days) or deliver an itemized written statement of deductions supported by genuine contractor receipts for actual damage beyond normal wear and tear. Landlords are strictly prohibited from retaining deposits for pre-existing defects or routine repainting.',
    source: 'Uganda Landlord and Tenant Act, 2022 (Act No. 3 of 2022), Section 29 & Housing Regulations',
    sourceType: 'statutory-reference',
    keywords: ['deposit', 'security deposit', 'refund', 'deductions', 'wear and tear', 'handover', 'receipts', 'ugx', 'inspection'],
    recommendedSteps: [
      'Document move-out inspection condition with timestamped photographs and a signed key handover slip.',
      'Send a formal, written demand letter specifying the 30-day statutory timeline and preferred refund method.',
      'Compile proof of zero rental arrears through bank deposit receipts or mobile money statements.',
      'If the landlord fails to respond within 14 days of notice, lodge a petition with the Local Council I (LC1) or Chief Magistrates Court.'
    ],
    authorityOrContact: {
      name: 'Local Council I (LC1) Court / Chief Magistrates Court (Civil Division)',
      contact: 'Local LC1 Secretariat / Magistrates Court Registry',
      role: 'Tenancy dispute mediation, debt recovery orders, and security deposit enforcement'
    }
  },
  {
    id: 'src-housing-002',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Protection Against Unlawful Eviction',
    title: 'Statutory Notice Periods & Protection Against Arbitrary Eviction',
    summary:
      'Under Sections 38 and 39 of the Landlord and Tenant Act (2022), a landlord may not evict a tenant without a valid court order and due statutory notice. For monthly tenancies, a minimum of thirty (30) calendar days written notice of termination is legally mandatory. Verbal notices, abrupt 24-hour/7-day ultimatums, and forceful removals without a magistrate court eviction order are unlawful and constitute actionable civil trespass.',
    source: 'Uganda Landlord and Tenant Act, 2022, Sections 38-41 & Judicial Guidelines on Evictions',
    sourceType: 'statutory-reference',
    keywords: ['eviction', 'notice to vacate', '30-day notice', 'unlawful eviction', 'court order', 'tenancy termination'],
    recommendedSteps: [
      'Demand written justification citing the specific statutory grounds for proposed lease termination.',
      'Serve a formal rejection of any notice that fails to provide the statutory 30-day advance period.',
      'Report threats of forceful eviction or trespass to the local LC1 Chairperson and Community Police Post for an injunction.'
    ],
    authorityOrContact: {
      name: 'Area LC1 Executive Committee & Uganda Police Community Liaison Office',
      contact: 'Local LC1 Office / Police Post',
      role: 'Emergency peace preservation and stoppage of extrajudicial evictions'
    }
  },
  {
    id: 'src-housing-003',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Habitability & Landlord Repair Obligations',
    title: 'Landlord Statutory Duty to Repair Structural Leaks, Sanitation & Roofs',
    summary:
      'Under Sections 11 through 13 of the Landlord and Tenant Act (2022), landlords have an immutable statutory duty to maintain the premises in a tenantable and habitable condition. This includes structural foundations, roof integrity, exterior walls, plumbing, and main drainage. While tenants maintain internal consumable fixtures, structural water seepage and sewage failures require the landlord to effect repairs within reasonable notice (14 to 21 days). Failure allows tenants to seek repair orders or reimbursement.',
    source: 'Ministry of Lands, Housing and Urban Development Habitability Regulations & Tenancy Act 2022',
    sourceType: 'official-guidance',
    keywords: ['repairs', 'habitability', 'roof leak', 'plumbing', 'structural damage', 'maintenance', 'water damage'],
    recommendedSteps: [
      'Issue a formal written notice of defect detailing the exact structural fault and date first observed.',
      'Attach clear date-stamped photographic evidence showing the affected rooms or fixtures.',
      'Provide a 14-day notice to cure before engaging professional contractors or escalating to arbitration.'
    ],
    authorityOrContact: {
      name: 'Municipal Public Health Inspection Division / LC1 Council',
      contact: 'Municipal Health & Works Department',
      role: 'Habitability assessment, sanitary inspection notices, and structural repair directives'
    }
  },
  {
    id: 'src-housing-004',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Prohibition of Illegal Lockouts & Utility Shutoffs',
    title: 'Illegal Lockouts, Padlocking & Utility Disconnection Bans',
    summary:
      'Section 49 of the Landlord and Tenant Act (2022) explicitly criminalizes the disconnection of essential utilities (water, electricity, access pathways) and the unlawful changing or padlocking of premises doors by a landlord or caretaker. Disconnecting utilities to coerce rent payment or force a move-out constitutes unlawful harassment and criminal interference with the tenant\'s quiet enjoyment, carrying statutory fines and damages.',
    source: 'Uganda Landlord and Tenant Act, 2022, Section 49 & Penal Code Provisions on Criminal Trespass',
    sourceType: 'statutory-reference',
    keywords: ['lockout', 'padlock', 'utilities', 'electricity cutoff', 'water disconnection', 'quiet enjoyment', 'harassment'],
    recommendedSteps: [
      'Document utility disconnect meters, padlocks, or blocked entry with video and timestamped photos.',
      'Issue an urgent notice warning the landlord of liability under Section 49.',
      'Lodge an immediate complaint with the local Police station and LC1 Court to compel immediate restoration of utilities.'
    ],
    authorityOrContact: {
      name: 'Uganda Police Force & Area Local Council I (LC1)',
      contact: 'Emergency Police Dispatch 999/112 & LC1 Chairperson',
      role: 'Enforcement against illegal lockouts and criminal disconnection of essential utilities'
    }
  },
  {
    id: 'src-housing-005',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Unlawful Rent Increases & Currency Rules',
    title: 'Statutory Limits and 90-Day Advance Notice for Rent Hikes',
    summary:
      'Under the Landlord and Tenant Act (2022), landlords must provide at least ninety (90) days written notice before implementing any rent increment. Rent increments cannot exceed statutory ceilings (typically capped at 10% per annum or as mutually contracted) without substantial verified capital improvements to the premises. Rent must be denominated and paid in Uganda Shillings unless explicitly contracted in foreign currency by mutual written consent.',
    source: 'Landlord and Tenant Act, 2022, Sections 26-28 (Rent Determinations and Currency Restrictions)',
    sourceType: 'statutory-reference',
    keywords: ['rent increase', 'rent hike', '90-day notice', 'currency', 'ugx', 'tenancy agreement', 'unlawful increment'],
    recommendedSteps: [
      'Check the date on the rent increase circular to verify if 90 calendar days advance notice was granted.',
      'Calculate the percentage increase against historical rent to identify unlawful over-escalation.',
      'Respond in writing rejecting arbitrary increases that do not comply with statutory notice periods.'
    ],
    authorityOrContact: {
      name: 'Rent Restriction Advisory Desk / LC1 Mediation Committee',
      contact: 'District Commercial Officer & LC1 Registry',
      role: 'Rent disputes conciliation and validation of statutory notice timelines'
    }
  },
  {
    id: 'src-housing-006',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Tenancy Dispute Mediation & Tribunal Escalation',
    title: 'Local Council I (LC1) & Magistrates Court Tenancy Dispute Procedures',
    summary:
      'Under the Local Council Courts Act (2006) and the Landlord and Tenant Act (2022), tenancy disputes under civil limits are primarily mediated at the village (LC1) level to preserve peaceful neighborhood relations. If mediation fails or the opposing party acts contumaciously, the case file may be escalated to the Chief Magistrates Court for formal civil orders, recovery of unpaid deposits, or injunctions.',
    source: 'Local Council Courts Act, 2006 & Magistrates Court Civil Procedure Rules',
    sourceType: 'public-service',
    keywords: ['mediation', 'lc1', 'tribunal', 'magistrate court', 'dispute resolution', 'summons', 'settlement agreement'],
    recommendedSteps: [
      'Assemble a complete case docket: signed tenancy agreement, payment receipts, written notices, and exit photos.',
      'Submit a formal written petition to the LC1 Village Chairman for a scheduled mediation hearing.',
      'Ensure that any mutual agreement reached is recorded in formal minutes signed by both parties and the LC1 Secretary.'
    ],
    authorityOrContact: {
      name: 'Village Local Council I (LC1) Executive Committee',
      contact: 'LC1 Village Secretariat',
      role: 'First-instance neighborhood mediation, dispute hearing, and documented amicable settlements'
    }
  },
  {
    id: 'src-housing-007',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Move-Out Joint Inspections & Fair Wear and Tear',
    title: 'Standardized Move-Out Joint Inspection & Fair Wear-and-Tear Standards',
    summary:
      'Fair wear and tear refers to the inevitable natural deterioration of a property resulting from ordinary, normal residential occupancy over time (e.g. minor paint fading, small nail holes from hanging pictures, standard carpet wear). Landlords cannot lawfully deduct costs for fair wear and tear from a security deposit. A joint walk-through inspection with an acknowledged exit condition checklist is standard best practice to establish baseline property condition.',
    source: 'National Housing Policy Best Practice Standards & Uganda Landlord-Tenant Case Law',
    sourceType: 'official-guidance',
    keywords: ['wear and tear', 'inspection report', 'move-out inspection', 'walkthrough', 'check-in inventory', 'damages'],
    recommendedSteps: [
      'Conduct a joint walk-through inspection with the landlord or authorized caretaker prior to returning keys.',
      'Sign a duplicate copy of the condition checklist noting all clean and intact fixtures.',
      'Retain timestamped high-resolution photos of every room on the day of surrender.'
    ]
  },
  {
    id: 'src-housing-008',
    area: 'housing',
    jurisdiction: 'Uganda',
    topic: 'Protection Against Distress for Rent',
    title: 'Restrictions on Seizure of Tenant Property (Distress for Rent)',
    summary:
      'Under the Distress for Rent (Bailiffs) framework and Section 47 of the Landlord and Tenant Act (2022), landlords are strictly prohibited from taking the law into their own hands by confiscating tenant furniture, appliances, or personal belongings without a lawful court warrant issued by a competent magistrate. Unwarranted confiscation of tenant goods constitutes civil conversion and theft.',
    source: 'Distress for Rent (Bailiffs) Act (Cap 76) & Landlord and Tenant Act (2022), Section 47',
    sourceType: 'statutory-reference',
    keywords: ['distress for rent', 'confiscation', 'seizure', 'property theft', 'bailiff', 'warrant'],
    recommendedSteps: [
      'Never allow unauthorized third parties to remove goods without inspecting a certified court order signed by a Magistrate.',
      'Record names, vehicle numbers, and badges of any individuals attempting property seizure.',
      'Immediately alert the LC1 Chairman and the nearest Police station to record a complaint of unlawful seizure.'
    ],
    authorityOrContact: {
      name: 'High Court / Chief Magistrates Court Registry (Execution & Bailiffs Division)',
      contact: 'Judicial Complaints Registry',
      role: 'Supervision of court bailiffs and prosecution of illegal property distraint'
    }
  }
];
