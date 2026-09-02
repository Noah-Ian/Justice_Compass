import { WebMCPToolDefinition, DomainArea, InformationSource } from '../../types';
import { INFORMATION_SOURCES } from '../../data/informationSources';
import { caseStorage } from '../../services/caseStorage';

/**
 * ============================================================================
 * WebMCP Tool: search_information
 * ============================================================================
 *
 * WHAT IT DOES:
 * Searches verified legal, health, public-service, and community guidelines
 * across supported jurisdictions. It returns authoritative summaries, statutory
 * guidelines, recommended steps, and official bodies.
 *
 * INPUT IT ACCEPTS:
 * - query (string): The search terms or problem keywords.
 * - area (optional DomainArea): Filter by domain ('housing', 'health', etc.)
 * - jurisdiction (optional string): Jurisdiction filter (e.g. 'Uganda')
 *
 * WHAT IT RETURNS:
 * An array of matching verified InformationSource objects with source titles,
 * legal/procedural summaries, authentic statutory references, and recommended steps.
 *
 * WHY AN AGENT USES IT:
 * To ground its advice in actual guidelines and laws rather than hallucinating
 * statutes, legal sections, or medical advice.
 *
 * HUMAN APPROVAL NOTE:
 * Read-only knowledge retrieval.
 */
export const searchInformationTool: WebMCPToolDefinition = {
  name: 'search_information',
  description: 'Search verified domain information, official statutory guidelines, patient charters, and public-service regulations.',
  category: 'knowledge',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Queries verified multi-domain legal, healthcare, and community guidelines.',
    inputs: 'Search query string, optional domain area filter, optional jurisdiction.',
    outputs: 'List of matching InformationSource records with summaries, citations, and guidance steps.',
    whyAgentUsesIt: 'To ensure all synthesized advice is grounded in authentic, verified information.',
    humanApprovalNote: 'Read-only information retrieval.'
  },
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search terms (e.g., "security deposit deduction", "patient medical records", "child maintenance").'
      },
      area: {
        type: 'string',
        enum: ['housing', 'health', 'family', 'employment', 'consumer', 'society'],
        description: 'Optional domain area filter.'
      },
      jurisdiction: {
        type: 'string',
        description: 'Jurisdiction filter (e.g. "Uganda").'
      }
    },
    required: ['query']
  },
  handler: (args: { query: string; area?: DomainArea; jurisdiction?: string }) => {
    const q = (args.query || '').toLowerCase().trim();
    const queryTokens = q.split(/\s+/).filter(Boolean);

    const matches = INFORMATION_SOURCES.filter((source) => {
      // Area filter
      if (args.area && source.area !== args.area) {
        return false;
      }
      // Jurisdiction filter
      if (args.jurisdiction && source.jurisdiction.toLowerCase() !== args.jurisdiction.toLowerCase()) {
        return false;
      }
      if (!q) return true;

      // Check title, topic, summary, keywords
      const textToSearch = `${source.title} ${source.topic} ${source.summary} ${source.keywords.join(' ')}`.toLowerCase();
      return queryTokens.some((token) => textToSearch.includes(token));
    });

    return {
      query: args.query,
      resultsCount: matches.length,
      sources: matches
    };
  }
};

/**
 * ============================================================================
 * WebMCP Tool: find_relevant_sources
 * ============================================================================
 *
 * WHAT IT DOES:
 * Analyzes an existing case and links relevant statutory guidelines and support
 * organizations directly to the case file.
 *
 * INPUT IT ACCEPTS:
 * - caseId (string): The ID of the case to link sources for.
 *
 * WHAT IT RETURNS:
 * An array of matched InformationSource records that were linked to the case.
 *
 * WHY AN AGENT USES IT:
 * To enrich the case workspace with contextually accurate guidelines for the human to review.
 */
export const findRelevantSourcesTool: WebMCPToolDefinition = {
  name: 'find_relevant_sources',
  description: 'Automatically find and link relevant verified legal, healthcare, or public-service sources to a specific case.',
  category: 'knowledge',
  supportedAreas: 'all',
  requiresHumanReview: false,
  consequential: false,
  explanation: {
    purpose: 'Discovers verified sources matching the case narrative and binds them to the case file.',
    inputs: 'Target case ID.',
    outputs: 'Array of relevant information sources added to the case.',
    whyAgentUsesIt: 'To substantiate the case with authentic citations and official authority contacts.',
    humanApprovalNote: 'Read-only linking; human can view and cite these sources.'
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
      throw new Error(`Case not found with ID: ${args.caseId}`);
    }

    const matchedSources = INFORMATION_SOURCES.filter((s) => s.area === targetCase.area);
    const sourceIds = matchedSources.map((s) => s.id);

    // Update case with source IDs if not already present
    const combinedIds = Array.from(new Set([...targetCase.relevantSourceIds, ...sourceIds]));
    targetCase.relevantSourceIds = combinedIds;
    caseStorage.saveCase(targetCase);

    return {
      caseId: args.caseId,
      linkedSourceIds: combinedIds,
      sources: matchedSources
    };
  }
};
