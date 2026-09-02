/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { CaseDetail } from './pages/CaseDetail';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { AboutPage } from './pages/AboutPage';
import { WebMCPInspector } from './components/WebMCPInspector';
import { NewCaseModal } from './components/NewCaseModal';
import { AgentDemoModal } from './components/AgentDemoModal';
import { caseStorage } from './services/caseStorage';
import { initGlobalWebMCP } from './webmcp';
import { Case, DomainArea } from './types';
import { CaseCard } from './components/CaseCard';
import { Plus, Search, Filter } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'cases' | 'inspector' | 'knowledge' | 'about'>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>(caseStorage.getAllCases());
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [newCasePreselectedArea, setNewCasePreselectedArea] = useState<DomainArea | undefined>(undefined);
  const [isAgentDemoOpen, setIsAgentDemoOpen] = useState(false);

  // Cases list view filters
  const [casesFilterCategory, setCasesFilterCategory] = useState<string>('all');
  const [casesSearch, setCasesSearch] = useState('');

  useEffect(() => {
    // Initialize WebMCP tools on window object for agent interop
    initGlobalWebMCP();

    // Subscribe to case storage updates
    const unsubscribe = caseStorage.subscribe((updatedCases) => {
      setCases(updatedCases);
    });

    return unsubscribe;
  }, []);

  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromCase = () => {
    setSelectedCaseId(null);
  };

  const handleOpenNewCaseModal = (area?: DomainArea) => {
    setNewCasePreselectedArea(area);
    setIsNewCaseModalOpen(true);
  };

  const handleCaseCreated = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Disclaimer Banner on top */}
      <DisclaimerBanner />

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedCaseId(null);
        }}
        onOpenNewCase={() => handleOpenNewCaseModal()}
        onOpenAgentDemo={() => setIsAgentDemoOpen(true)}
        casesCount={cases.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCaseId ? (
          <CaseDetail caseId={selectedCaseId} onBack={handleBackFromCase} />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                cases={cases}
                onOpenCase={handleOpenCase}
                onOpenNewCase={handleOpenNewCaseModal}
                onOpenAgentDemo={() => setIsAgentDemoOpen(true)}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'cases' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">All Case Workspaces</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage client records, fact timelines, evidence exhibits, and document review queues
                    </p>
                  </div>

                  <button
                    id="btn-cases-page-new-case"
                    onClick={() => handleOpenNewCaseModal()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Case</span>
                  </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Tenancy Cases' },
                      { id: 'security_deposit', label: 'Security Deposits' },
                      { id: 'eviction_defense', label: 'Eviction Defense' },
                      { id: 'repairs_habitability', label: 'Repairs & Habitability' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCasesFilterCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          casesFilterCategory === cat.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={casesSearch}
                      onChange={(e) => setCasesSearch(e.target.value)}
                      placeholder="Search cases..."
                      className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-56"
                    />
                  </div>
                </div>

                {/* Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cases
                    .filter((c) => {
                      const matchesCategory =
                        casesFilterCategory === 'all' ||
                        c.disputeCategory === casesFilterCategory ||
                        (casesFilterCategory === 'security_deposit' && c.issueType.toLowerCase().includes('deposit')) ||
                        (casesFilterCategory === 'eviction_defense' && c.issueType.toLowerCase().includes('eviction')) ||
                        (casesFilterCategory === 'repairs_habitability' && c.issueType.toLowerCase().includes('repair'));

                      const matchesSearch =
                        c.title.toLowerCase().includes(casesSearch.toLowerCase()) ||
                        c.description.toLowerCase().includes(casesSearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    })
                    .map((c) => (
                      <CaseCard key={c.id} caseItem={c} onOpen={() => handleOpenCase(c.id)} />
                    ))}
                </div>
              </div>
            )}

            {currentTab === 'inspector' && <WebMCPInspector />}

            {currentTab === 'knowledge' && (
              <KnowledgeBase
                onStartCaseInDomain={(dom) => {
                  handleOpenNewCaseModal(dom);
                }}
              />
            )}

            {currentTab === 'about' && <AboutPage />}
          </>
        )}
      </main>

      {/* Global Clean Utility Footer */}
      <footer className="px-6 sm:px-8 py-4 bg-slate-900 text-slate-400 text-[10px] mt-16 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span>&copy; 2026 Justice Compass — Built for WebMCP Challenge</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="uppercase tracking-tight text-slate-400 font-medium">
            Safety Warning: For urgent legal or medical emergencies, contact local authorities immediately.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <button onClick={() => { setCurrentTab('about'); setSelectedCaseId(null); }} className="hover:text-white transition-colors">
            Safety & Disclaimers
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => { setCurrentTab('inspector'); setSelectedCaseId(null); }} className="hover:text-white transition-colors">
            WebMCP Inspector
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => { setCurrentTab('knowledge'); setSelectedCaseId(null); }} className="hover:text-white transition-colors">
            Statutory Knowledge
          </button>
        </div>
      </footer>

      {/* Modals */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCaseCreated={handleCaseCreated}
        preselectedArea={newCasePreselectedArea}
      />

      <AgentDemoModal
        isOpen={isAgentDemoOpen}
        onClose={() => setIsAgentDemoOpen(false)}
        onOpenCase={handleOpenCase}
      />
    </div>
  );
}
