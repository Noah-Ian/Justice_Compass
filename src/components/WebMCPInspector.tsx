import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Play, RefreshCw, Trash2, Shield, Code, ChevronRight } from 'lucide-react';
import { webMCP, ALL_WEBMCP_TOOLS } from '../webmcp';
import { WebMCPToolDefinition, WebMCPExecutionLog } from '../types';

export const WebMCPInspector: React.FC = () => {
  const [tools] = useState<WebMCPToolDefinition[]>(ALL_WEBMCP_TOOLS);
  const [selectedTool, setSelectedTool] = useState<WebMCPToolDefinition>(ALL_WEBMCP_TOOLS[0]);
  const [toolInputJson, setToolInputJson] = useState('{\n  "text": "My landlord refuses to return my 800,000 UGX deposit."\n}');
  const [toolOutput, setToolOutput] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<WebMCPExecutionLog[]>(webMCP.getLogs());
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'runner' | 'logs'>('tools');

  useEffect(() => {
    const unsubscribe = webMCP.subscribeLogs((newLogs) => {
      setLogs(newLogs);
    });
    return unsubscribe;
  }, []);

  const handleSelectTool = (tool: WebMCPToolDefinition) => {
    setSelectedTool(tool);
    setToolOutput(null);

    // Generate sample input from parameters
    const sample: Record<string, any> = {};
    if (tool.parameters.properties) {
      Object.keys(tool.parameters.properties).forEach((k) => {
        const prop = tool.parameters.properties[k];
        if (k === 'caseId') sample[k] = 'case-housing-001';
        else if (k === 'text') sample[k] = 'My landlord hasn\'t returned my security deposit of 800,000 UGX.';
        else if (k === 'query') sample[k] = 'security deposit refund';
        else if (k === 'area') sample[k] = 'housing';
        else if (k === 'title') sample[k] = 'Security Deposit Recovery Claim';
        else if (k === 'documentType') sample[k] = 'demand_letter';
        else if (k === 'recipient') sample[k] = 'Mr. Patrick Byaruhanga (Landlord)';
        else if (prop.type === 'string') sample[k] = 'sample string';
        else if (prop.type === 'boolean') sample[k] = true;
        else if (prop.type === 'number') sample[k] = 100;
        else sample[k] = null;
      });
    }
    setToolInputJson(JSON.stringify(sample, null, 2));
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    try {
      let parsedArgs = {};
      if (toolInputJson.trim()) {
        parsedArgs = JSON.parse(toolInputJson);
      }
      const res = await webMCP.callTool(selectedTool.name, parsedArgs);
      setToolOutput(res);
    } catch (err: any) {
      setToolOutput({ error: err?.message || String(err) });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyManifest = () => {
    const manifest = {
      name: 'justice-compass-webmcp',
      version: '2026.1.0',
      protocol: 'webmcp/1.0',
      tools: webMCP.listTools()
    };
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white text-slate-900 rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">WebMCP Protocol Inspector</h1>
              <span className="text-xs text-blue-700 font-mono">
                window.webmcp • {tools.length} Registered Tools • JSON-RPC Draft 2026
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Inspect the tools registered in the browser for AI agents to query legal/health guidelines, structure case records, manage evidence, and draft documents while preserving human review.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-copy-webmcp-manifest"
            onClick={handleCopyManifest}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
          >
            {copiedManifest ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedManifest ? 'Manifest Copied!' : 'Copy Tool Manifest'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          id="tab-inspect-tools"
          onClick={() => setActiveTab('tools')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            activeTab === 'tools'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Tools Catalog ({tools.length})
        </button>

        <button
          id="tab-inspect-runner"
          onClick={() => setActiveTab('runner')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            activeTab === 'runner'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Interactive Tool Runner
        </button>

        <button
          id="tab-inspect-logs"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Live Protocol Logs</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
            activeTab === 'logs' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {logs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: TOOLS CATALOG */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tool List Column */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Registered Tools
            </h3>
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {tools.map((t) => {
                const isSelected = selectedTool.name === t.name;
                return (
                  <button
                    key={t.name}
                    id={`tool-item-${t.name}`}
                    onClick={() => handleSelectTool(t)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 text-slate-900 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-blue-700 font-semibold">{t.name}</code>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                        {t.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tool Documentation Details Column */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-lg font-bold font-mono text-slate-900">{selectedTool.name}</h2>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200">
                    {selectedTool.category}
                  </span>
                  {selectedTool.requiresHumanReview && (
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                      Requires Human Sign-off
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{selectedTool.description}</p>
              </div>

              <button
                id="btn-switch-to-runner"
                onClick={() => setActiveTab('runner')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test in Runner</span>
              </button>
            </div>

            {/* Structured WebMCP Architectural Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">Purpose & Capability:</span>
                <p className="text-slate-600 leading-relaxed">{selectedTool.explanation.purpose}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">Why an Agent Uses It:</span>
                <p className="text-slate-600 leading-relaxed">{selectedTool.explanation.whyAgentUsesIt}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">Accepted Inputs:</span>
                <p className="text-slate-600 leading-relaxed">{selectedTool.explanation.inputs}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">Returned Outputs:</span>
                <p className="text-slate-600 leading-relaxed">{selectedTool.explanation.outputs}</p>
              </div>
            </div>

            {/* Human In The Loop Boundary Note */}
            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-950">Human Sovereignty & Approval:</strong>{' '}
                {selectedTool.explanation.humanApprovalNote}
              </div>
            </div>

            {/* JSON Schema */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  JSON Schema Parameters
                </span>
                <span className="text-[11px] font-mono text-slate-400">Draft 7</span>
              </div>
              <pre className="p-3.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-52">
                {JSON.stringify(selectedTool.parameters, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE TOOL RUNNER */}
      {activeTab === 'runner' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900">Interactive Tool Execution Sandbox</h2>
              <p className="text-xs text-slate-500">
                Directly execute tool calls through <code>window.webmcp.callTool()</code> and view live responses
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Select Tool:</label>
              <select
                id="select-active-tool"
                value={selectedTool.name}
                onChange={(e) => {
                  const t = tools.find((tool) => tool.name === e.target.value);
                  if (t) handleSelectTool(t);
                }}
                className="text-xs font-mono p-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {tools.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input Payload Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Input Arguments (JSON)
                </span>
                <button
                  onClick={() => handleSelectTool(selectedTool)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset Template
                </button>
              </div>
              <textarea
                id="textarea-tool-input-json"
                value={toolInputJson}
                onChange={(e) => setToolInputJson(e.target.value)}
                rows={12}
                className="w-full p-3 font-mono text-xs rounded-lg border border-slate-300 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                id="btn-run-tool-call"
                onClick={handleExecuteTool}
                disabled={isExecuting}
                className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing via WebMCP...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute {selectedTool.name}()</span>
                  </>
                )}
              </button>
            </div>

            {/* Output Result Viewer */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Tool Response
                </span>
                {toolOutput && (
                  <span className="text-[11px] font-mono text-blue-700 font-semibold">
                    Execution Successful
                  </span>
                )}
              </div>
              <pre className="w-full h-72 p-3 font-mono text-xs rounded-lg border border-slate-300 bg-slate-900 text-emerald-400 overflow-auto">
                {toolOutput ? JSON.stringify(toolOutput, null, 2) : '// Response will appear here after execution...'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900">WebMCP Protocol Execution Trace</h2>
              <p className="text-xs text-slate-500">
                Chronological record of every tool invoked during current browser session
              </p>
            </div>
            {logs.length > 0 && (
              <button
                id="btn-clear-logs"
                onClick={() => webMCP.clearLogs()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No tool calls logged yet. Run an agent workflow or use the tool runner to view live JSON-RPC telemetry.
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2 font-mono"
                >
                  <div className="flex items-center justify-between font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold font-mono text-blue-700 text-xs">
                        {log.toolName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${
                          log.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>{log.durationMs}ms</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Input:</span>
                      <pre className="p-2 bg-white rounded border border-slate-200 overflow-x-auto max-h-32 text-slate-800">
                        {JSON.stringify(log.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Output:</span>
                      <pre className="p-2 bg-white rounded border border-slate-200 overflow-x-auto max-h-32 text-slate-800">
                        {JSON.stringify(log.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
