import React from 'react';
import { Compass, Terminal, BookOpen, Plus, Play, Home, Info } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'cases' | 'inspector' | 'knowledge' | 'about';
  onSelectTab: (tab: 'dashboard' | 'cases' | 'inspector' | 'knowledge' | 'about') => void;
  onOpenNewCase: () => void;
  onOpenAgentDemo: () => void;
  casesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewCase,
  onOpenAgentDemo,
  casesCount
}) => {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-6 lg:gap-8">
        {/* Logo & Product identity */}
        <button
          id="nav-logo"
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
            <div className="w-3.5 h-3.5 border-2 border-white transform rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-800">Justice Compass</span>
            </div>
          </div>
        </button>

        {/* Navigation Tabs - Clean Utility Minimal */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <button
            id="nav-tab-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`transition-colors py-1 ${
              currentTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>

          <button
            id="nav-tab-cases"
            onClick={() => onSelectTab('cases')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'cases'
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <span>Cases</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {casesCount}
            </span>
          </button>

          <button
            id="nav-tab-inspector"
            onClick={() => onSelectTab('inspector')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'inspector'
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>WebMCP Inspector</span>
          </button>

          <button
            id="nav-tab-knowledge"
            onClick={() => onSelectTab('knowledge')}
            className={`transition-colors py-1 ${
              currentTab === 'knowledge'
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Information Library
          </button>

          <button
            id="nav-tab-about"
            onClick={() => onSelectTab('about')}
            className={`transition-colors py-1 ${
              currentTab === 'about'
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            About & Safety
          </button>
        </div>
      </div>

      {/* Right controls: WebMCP status badge & Action buttons */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onSelectTab('inspector')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
          title="WebMCP Protocol Active in Browser"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>WebMCP Active</span>
        </div>

        <button
          id="btn-run-agent-demo"
          onClick={onOpenAgentDemo}
          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Play className="w-3.5 h-3.5 text-blue-600 fill-current" />
          <span className="hidden sm:inline">Run Benchmark</span>
          <span className="sm:hidden">Run</span>
        </button>

        <button
          id="btn-start-new-case"
          onClick={onOpenNewCase}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Case</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>
    </nav>
  );
};
