import { WebMCPToolDefinition, WebMCPExecutionLog, WebMCPToolSchema } from '../types';
import { classifyProblemAreaTool } from './tools/classification';
import { searchInformationTool, findRelevantSourcesTool } from './tools/knowledge';
import { createCaseTool, getCaseTool, updateCaseTool, addCaseFactTool } from './tools/caseManagement';
import { addEvidenceTool, getCaseEvidenceTool } from './tools/evidenceManagement';
import { generateCaseSummaryTool, generateActionPlanTool, generateLetterTool } from './tools/generation';
import { getCaseDocumentsTool, reviewDocumentTool } from './tools/documentReview';

export const ALL_WEBMCP_TOOLS: WebMCPToolDefinition[] = [
  classifyProblemAreaTool,
  searchInformationTool,
  createCaseTool,
  getCaseTool,
  updateCaseTool,
  addCaseFactTool,
  addEvidenceTool,
  getCaseEvidenceTool,
  findRelevantSourcesTool,
  generateCaseSummaryTool,
  generateActionPlanTool,
  generateLetterTool,
  getCaseDocumentsTool,
  reviewDocumentTool
];

// In-memory execution log store for WebMCP Inspector
const executionLogs: WebMCPExecutionLog[] = [];
type LogListener = (logs: WebMCPExecutionLog[]) => void;
const logListeners = new Set<LogListener>();

function notifyLogListeners() {
  logListeners.forEach((l) => {
    try {
      l([...executionLogs]);
    } catch (e) {
      console.error(e);
    }
  });
}

export class WebMCPRegistry {
  private tools: Map<string, WebMCPToolDefinition> = new Map();

  constructor(tools: WebMCPToolDefinition[] = ALL_WEBMCP_TOOLS) {
    tools.forEach((t) => this.tools.set(t.name, t));
  }

  /**
   * Return all registered tools in MCP standard format
   */
  public listTools(): Array<{
    name: string;
    description: string;
    inputSchema: any;
    category: string;
    requiresHumanReview: boolean;
    consequential: boolean;
  }> {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.parameters,
      category: tool.category,
      requiresHumanReview: tool.requiresHumanReview,
      consequential: tool.consequential
    }));
  }

  public getTool(name: string): WebMCPToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getAllToolDefinitions(): WebMCPToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Invokes a tool by name with arguments, adhering to standard WebMCP JSON-RPC semantics
   */
  public async callTool(name: string, args: any = {}): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      const errorMsg = `WebMCP Tool not found: "${name}"`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const startTime = performance.now();
    let result: any;
    let status: 'success' | 'error' = 'success';

    try {
      result = await tool.handler(args);
    } catch (err: any) {
      status = 'error';
      result = { error: err?.message || String(err) };
      throw err;
    } finally {
      const durationMs = Math.round(performance.now() - startTime);
      const logEntry: WebMCPExecutionLog = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        toolName: name,
        input: args,
        output: result,
        status,
        durationMs
      };

      executionLogs.unshift(logEntry);
      if (executionLogs.length > 50) {
        executionLogs.pop();
      }
      notifyLogListeners();

      // Dispatch standard browser event for WebMCP client extensions or listeners
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('webmcp:tool_called', {
          detail: logEntry
        });
        window.dispatchEvent(event);
      }
    }

    return result;
  }

  public getLogs(): WebMCPExecutionLog[] {
    return [...executionLogs];
  }

  public clearLogs(): void {
    executionLogs.length = 0;
    notifyLogListeners();
  }

  public subscribeLogs(listener: LogListener): () => void {
    logListeners.add(listener);
    listener([...executionLogs]);
    return () => {
      logListeners.delete(listener);
    };
  }
}

// Global Singleton Registry
export const webMCP = new WebMCPRegistry();

interface DocumentModelContextTool {
  name: string;
  description: string;
  inputSchema: WebMCPToolSchema;
  execute: (input: any) => Promise<any>;
}

interface DocumentModelContext {
  registerTool: (tool: DocumentModelContextTool) => void;
}

// Initialize on browser window for inspection and WebMCP compliance
declare global {
  interface Document {
    modelContext?: DocumentModelContext;
  }

  interface Window {
    webmcp?: {
      version: string;
      protocol: string;
      listTools: () => any[];
      callTool: (name: string, args?: any) => Promise<any>;
      getTool: (name: string) => WebMCPToolDefinition | undefined;
      getLogs: () => WebMCPExecutionLog[];
      registry: WebMCPRegistry;
    };
    modelContextProtocol?: any;
  }
}

let modelContextToolsRegistered = false;

function registerDocumentModelContextTools() {
  if (modelContextToolsRegistered || typeof document === 'undefined' || !document.modelContext) return;

  ALL_WEBMCP_TOOLS.forEach((tool) => {
    document.modelContext!.registerTool({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.parameters,
      execute: async (input) => webMCP.callTool(tool.name, input)
    });
  });

  modelContextToolsRegistered = true;
}

export function initGlobalWebMCP() {
  if (typeof window === 'undefined') return;

  registerDocumentModelContextTools();

  window.webmcp = {
    version: '2026.1.0',
    protocol: 'webmcp/1.0',
    listTools: () => webMCP.listTools(),
    callTool: (name: string, args?: any) => webMCP.callTool(name, args),
    getTool: (name: string) => webMCP.getTool(name),
    getLogs: () => webMCP.getLogs(),
    registry: webMCP
  };

  // Dispatch lifecycle ready event
  window.dispatchEvent(
    new CustomEvent('webmcp:ready', {
      detail: {
        toolsCount: ALL_WEBMCP_TOOLS.length,
        version: '2026.1.0'
      }
    })
  );

  console.info(
    `%c[Justice Compass WebMCP]%c Successfully registered ${ALL_WEBMCP_TOOLS.length} WebMCP tools to window.webmcp`,
    'background: #0f172a; color: #38bdf8; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'color: #0f172a; font-weight: normal;'
  );
}
