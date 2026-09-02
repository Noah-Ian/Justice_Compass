import { DomainArea } from '../types';

export interface SamplePrompt {
  id: string;
  title: string;
  area: DomainArea;
  category: 'security_deposit' | 'eviction_defense' | 'repairs_habitability';
  problemText: string;
  clientName: string;
  opposingParty: string;
  expectedWorkflow: string[];
  suggestedJurisdiction: string;
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'prompt-housing-001',
    title: 'Security Deposit Withholding (800,000 UGX) — Challenge Benchmark',
    area: 'housing',
    category: 'security_deposit',
    clientName: 'Faith Nakato',
    opposingParty: 'Mr. Patrick Byaruhanga (Landlord)',
    problemText:
      'My landlord hasn\'t returned my security deposit. I moved out on August 1st after giving 30-day notice, paid 800,000 UGX as a deposit, and the landlord refuses to explain why. Help me understand what I should do and prepare a letter I can send to the landlord.',
    expectedWorkflow: [
      'classify_problem_area() -> housing / security deposit recovery',
      'search_information() -> Section 29 Landlord and Tenant Act (2022) rules',
      'create_case() -> Security Deposit Refund Workspace',
      'add_case_fact() -> Add move-out date, deposit receipt, and zero-arrears status',
      'add_evidence() -> Attach mobile money receipt, lease contract, and exit photos',
      'find_relevant_sources() -> Match LC1 mediation & Section 29 statutory guidance',
      'generate_case_summary() -> Synthesize tenancy facts & missing receipts',
      'generate_action_plan() -> Prioritized checklist with human review gates',
      'generate_letter() -> Draft formal demand letter for human review and sign-off'
    ],
    suggestedJurisdiction: 'Uganda'
  },
  {
    id: 'prompt-housing-002',
    title: 'Unlawful 7-Day Eviction Notice & Padlock Lockout Threat',
    area: 'housing',
    category: 'eviction_defense',
    clientName: 'Ronald Kato',
    opposingParty: 'Hajji Musa Ssemwogerere (Landlord)',
    problemText:
      'My landlord sent me an angry WhatsApp message and voice note giving me only 7 days to vacate my apartment because someone offered higher rent, even though my monthly rent is paid in full. He threatened to padlock the security gate next week if I don\'t leave. What are my rights against illegal eviction and lockout?',
    expectedWorkflow: [
      'classify_problem_area() -> housing / unlawful eviction defense',
      'search_information() -> Sections 38 & 49 (30-day notice & criminal lockout bans)',
      'create_case() -> Unlawful Eviction Defense Workspace',
      'add_case_fact() -> Periodic monthly tenancy, zero arrears, sudden 7-day notice',
      'add_evidence() -> Attach rent receipt, WhatsApp voice threats, and lease records',
      'generate_case_summary() -> Document breach of Section 38 statutory protections',
      'generate_action_plan() -> Formal rejection notice followed by LC1 emergency injunction',
      'generate_letter() -> Draft formal notice of statutory non-compliance and Section 49 warning'
    ],
    suggestedJurisdiction: 'Uganda'
  },
  {
    id: 'prompt-housing-003',
    title: 'Severe Roof Leak & Habitability Repair Demand',
    area: 'housing',
    category: 'repairs_habitability',
    clientName: 'Amina Nassolo',
    opposingParty: 'Crested Properties & Estate Management',
    problemText:
      'Heavy rain is leaking through our apartment ceiling into the living room and kitchen. It\'s dripping near electrical wiring and creating a safety hazard. I reported it to the property manager three times over the past month, but they keep stalling and no repairs have been done. How do I formally demand emergency repairs under tenancy laws?',
    expectedWorkflow: [
      'classify_problem_area() -> housing / habitability & structural repairs',
      'search_information() -> Sections 11-13 (Landlord duty of repair & habitability)',
      'create_case() -> Habitability & Structural Repair Workspace',
      'add_case_fact() -> Timeline of water penetration, electrician inspection, and ignored notices',
      'add_evidence() -> Attach damage photos, electrician safety report, and contractor estimate',
      'generate_action_plan() -> 14-day statutory notice to cure before repair-and-deduct',
      'generate_letter() -> Formal demand for urgent structural repair under Section 11'
    ],
    suggestedJurisdiction: 'Uganda'
  }
];
