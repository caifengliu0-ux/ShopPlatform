

export interface MenuItem {
  id: string;
  name: string;
  type: 'module' | 'function';
  parentId: string | null;
  children?: MenuItem[];
  path?: string;
  startLine?: number;
  endLine?: number;
}

export interface MermaidData {
  [key: string]: string;
}

export interface SourceCode {
  [key: string]: string;
}

export interface LLMAnalysis {
  [key: string]: string;
}

