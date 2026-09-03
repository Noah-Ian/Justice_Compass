import { Case, CaseFact, CaseEvidence, GeneratedDocument, CaseStatus } from '../types';
import { INITIAL_MOCK_CASES } from '../data/mockCases';

const STORAGE_KEY = 'justice_compass_cases_v1';

function landCases(cases: Case[]): Case[] {
  return cases.filter((caseItem) => caseItem.area === 'housing');
}

type Listener = (cases: Case[]) => void;
const listeners = new Set<Listener>();

function notify(cases: Case[]) {
  listeners.forEach((listener) => {
    try {
      listener(cases);
    } catch (e) {
      console.error('Error in case storage listener', e);
    }
  });
}

export const caseStorage = {
  getCases(): Case[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CASES));
        return INITIAL_MOCK_CASES;
      }
      const storedCases = landCases(JSON.parse(raw));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCases));
      return storedCases;
    } catch (err) {
      console.warn('Failed to read from localStorage, using in-memory mock', err);
      return INITIAL_MOCK_CASES;
    }
  },

  getAllCases(): Case[] {
    return this.getCases();
  },

  getCase(id: string): Case | undefined {
    const cases = this.getCases();
    return cases.find((c) => c.id === id);
  },

  saveCase(caseData: Case): Case {
    const cases = this.getCases();
    const index = cases.findIndex((c) => c.id === caseData.id);
    const updated = { ...caseData, updatedAt: new Date().toISOString() };

    let newCases: Case[];
    if (index >= 0) {
      newCases = [...cases];
      newCases[index] = updated;
    } else {
      newCases = [updated, ...cases];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCases));
    } catch (err) {
      console.error('Failed to write to localStorage', err);
    }
    notify(newCases);
    return updated;
  },

  deleteCase(id: string): boolean {
    const cases = this.getCases();
    const filtered = cases.filter((c) => c.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      notify(filtered);
      return true;
    } catch (e) {
      return false;
    }
  },

  resetToDefaults(): Case[] {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CASES));
    } catch (e) {
      console.error(e);
    }
    const landOnlyCases = landCases(INITIAL_MOCK_CASES);
    notify(landOnlyCases);
    return landOnlyCases;
  },

  addFact(caseId: string, fact: Omit<CaseFact, 'id' | 'createdAt'>): CaseFact | null {
    const targetCase = this.getCase(caseId);
    if (!targetCase) return null;

    const newFact: CaseFact = {
      ...fact,
      id: `fact-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };

    targetCase.facts = [...targetCase.facts, newFact];
    this.saveCase(targetCase);
    return newFact;
  },

  addEvidence(caseId: string, evidence: Omit<CaseEvidence, 'id' | 'createdAt'>): CaseEvidence | null {
    const targetCase = this.getCase(caseId);
    if (!targetCase) return null;

    const newEvidence: CaseEvidence = {
      ...evidence,
      id: `evi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };

    targetCase.evidence = [...targetCase.evidence, newEvidence];
    this.saveCase(targetCase);
    return newEvidence;
  },

  updateStatus(caseId: string, status: CaseStatus): boolean {
    const targetCase = this.getCase(caseId);
    if (!targetCase) return false;

    targetCase.status = status;
    this.saveCase(targetCase);
    return true;
  },

  addDocument(caseId: string, doc: Omit<GeneratedDocument, 'id' | 'caseId' | 'createdAt'>): GeneratedDocument | null {
    const targetCase = this.getCase(caseId);
    if (!targetCase) return null;

    const newDoc: GeneratedDocument = {
      ...doc,
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      caseId,
      createdAt: new Date().toISOString()
    };

    targetCase.documents = [newDoc, ...targetCase.documents];
    if (targetCase.status === 'gathering_facts' || targetCase.status === 'intake') {
      targetCase.status = 'pending_human_review';
    }
    this.saveCase(targetCase);
    return newDoc;
  },

  reviewDocument(
    caseId: string,
    documentId: string,
    reviewStatus: 'approved' | 'rejected' | 'edited',
    humanNotes?: string,
    editedContent?: string
  ): GeneratedDocument | null {
    const targetCase = this.getCase(caseId);
    if (!targetCase) return null;

    const docIndex = targetCase.documents.findIndex((d) => d.id === documentId);
    if (docIndex < 0) return null;

    const doc = targetCase.documents[docIndex];
    const updatedDoc: GeneratedDocument = {
      ...doc,
      reviewStatus,
      humanNotes: humanNotes || doc.humanNotes,
      content: editedContent !== undefined ? editedContent : doc.content,
      reviewedAt: new Date().toISOString()
    };

    targetCase.documents[docIndex] = updatedDoc;

    // If approved, update case status to action_ready
    if (reviewStatus === 'approved') {
      targetCase.status = 'action_ready';
    }

    this.saveCase(targetCase);
    return updatedDoc;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};
