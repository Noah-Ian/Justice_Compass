import React, { useState } from 'react';
import { Terminal, Plus, Play, Menu, X, Home, Briefcase, BookOpen, Info } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'cases' | 'inspector' | 'knowledge' | 'about';
  onSelectTab: (tab: 'dashboard' | 'cases' | 'inspector' | 'knowledge' | 'about') => void;
  onOpenNewCase: () => void;
  onOpenAgentDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewCase,
  onOpenAgentDemo
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectTab = (tab: NavbarProps['currentTab']) => {
    onSelectTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex items-center px-4 sm:px-8 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative">
          <button
            id="nav-menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Open navigation menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-40">
              {[
                { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
                { id: 'cases' as const, label: 'Case Workspaces', icon: Briefcase },
                { id: 'knowledge' as const, label: 'Information Library', icon: BookOpen },
                { id: 'about' as const, label: 'About & Safety', icon: Info }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectTab(item.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      currentTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Logo & Product identity */}
        <button
          id="nav-logo"
          onClick={() => selectTab('dashboard')}
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

      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          id="nav-tab-inspector"
          onClick={() => selectTab('inspector')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            currentTab === 'inspector' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span>WebMCP Inspector</span>
        </button>

        <button
          id="btn-run-agent-demo"
          onClick={onOpenAgentDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Play className="w-3.5 h-3.5 text-blue-600 fill-current" />
          <span>Benchmark</span>
        </button>

        <div
          onClick={() => onSelectTab('inspector')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
          title="WebMCP Protocol Active in Browser"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>WebMCP Active</span>
        </div>

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
