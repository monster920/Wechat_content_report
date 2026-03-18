// 类型定义文件

// API请求类型
export interface ApiRequest {
  inputs: {
    link: string;
  };
  response_mode: 'blocking' | 'streaming';
  user: string;
}

// API响应类型
export interface ApiResponse {
  workflow_run_id?: string;
  task_id?: string;
  status?: string;
  outputs?: {
    report_object?: string;
    source?: string;
    report_date?: string;
    report_summary?: string;
    weighted_score?: number;
    detailed_diagnosis?: any;
    optimization_strategy?: any;
    report?: string; // Markdown格式的报告
  };
  data?: {
    id?: string;
    workflow_id?: string;
    status?: string;
    outputs?: {
      report?: string;
    };
    error?: any;
    elapsed_time?: number;
    total_tokens?: number;
    total_steps?: number;
    created_at?: number;
    finished_at?: number;
  };
  elapsed_time?: number;
  created_at?: number;
}

// 元数据类型
export interface MetaData {
  title: string;
  source: string;
  date: string;
  summary: string;
}

// 分数类型
export interface ScoreData {
  total: number;
  level: string;
}

// 维度类型
export interface DimensionData {
  name: string;
  weight: string;
  score: number;
  status: string;
  analysis: string;
  subItems: any[];
}

// 建议类型
export interface Suggestion {
  text: string;
  completed: boolean;
}

export interface ActionSuggestion {
  category: string;
  text: string;
  estimatedTime: string;
  completed: boolean;
}

export interface SuggestionsData {
  strengths: Suggestion[];
  weaknesses: Suggestion[];
  actions: ActionSuggestion[];
}

// 报告数据类型
export interface ReportData {
  meta: MetaData;
  score: ScoreData;
  dimensions: DimensionData[];
  suggestions: SuggestionsData;
}

// 应用状态类型
export interface AppState {
  loading: boolean;
  data: ReportData | null;
  error: string | null;
  activeDimension: string | null;
  completedActions: string[];
}