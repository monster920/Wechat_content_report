// API服务层 - Dify工作流集成
import type { ReportData, ApiRequest, ApiResponse } from '../types/index';

// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

/**
 * 获取公众号文章分析报告
 * @param link 公众号文章链接
 * @returns 分析报告数据
 */
export async function fetchReport(link: string): Promise<ReportData> {
  const request: ApiRequest = {
    inputs: { link },
    response_mode: 'blocking',
    user: 'mon'
  };

  // 设置10分钟超时（600000毫秒）
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600000);

  try {
    const response = await fetch(`${API_BASE_URL}/v1/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return transformReportData(data);
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    throw error;
  }
}

/**
 * 转换API响应数据为应用内部格式
 * @param apiData API响应数据
 * @returns 转换后的报告数据
 */
export function transformReportData(apiData: ApiResponse): ReportData {
  // 检查API返回的数据结构
  const data = apiData.data || apiData;
  const outputs = data.outputs || apiData.outputs || {};
  
  // 如果返回的是Markdown报告，尝试解析
  if (outputs.report) {
    return parseMarkdownReport(outputs.report);
  }
  
  // 如果是结构化数据，使用原有逻辑
  return {
    meta: {
      title: (outputs as any).report_object || '未知文章',
      source: (outputs as any).source || '未知来源',
      date: (outputs as any).report_date || new Date().toISOString().split('T')[0],
      summary: (outputs as any).report_summary || ''
    },
    score: {
      total: (outputs as any).weighted_score || 0,
      level: getScoreLevel((outputs as any).weighted_score || 0)
    },
    dimensions: parseDimensions((outputs as any).detailed_diagnosis || {}),
    suggestions: parseSuggestions((outputs as any).optimization_strategy || {})
  };
}

/**
 * 解析Markdown格式的报告
 * @param markdownReport Markdown格式的报告
 * @returns 转换后的报告数据
 */
function parseMarkdownReport(markdownReport: string): ReportData {
  // 检查是否是错误信息
  if (markdownReport.includes('无法访问') || markdownReport.includes('标题未找到')) {
    return {
      meta: {
        title: '文章分析失败',
        source: '微信公众号',
        date: new Date().toISOString().split('T')[0],
        summary: markdownReport
      },
      score: {
        total: 0,
        level: '分析失败'
      },
      dimensions: [
        { name: '选题', weight: '30%', score: 0, status: '需优化', analysis: '无法获取文章内容', subItems: [] },
        { name: '标题', weight: '20%', score: 0, status: '需优化', analysis: '无法获取文章内容', subItems: [] },
        { name: '结构', weight: '15%', score: 0, status: '需优化', analysis: '无法获取文章内容', subItems: [] },
        { name: '内容', weight: '20%', score: 0, status: '需优化', analysis: '无法获取文章内容', subItems: [] },
        { name: '文笔', weight: '10%', score: 0, status: '需优化', analysis: '无法获取文章内容', subItems: [] },
        { name: '传播', weight: '5%', score: 0, status: '需优化', analysis: '无法获取文章内容', subItems: [] }
      ],
      suggestions: {
        strengths: [],
        weaknesses: [
          { text: '无法访问文章链接', completed: false },
          { text: '请提供有效的公众号文章链接', completed: false }
        ],
        actions: [
          { category: 'general', text: '请检查文章链接是否正确且可公开访问', estimatedTime: '5分钟', completed: false }
        ]
      }
    };
  }
  
  // 新格式检测：如果包含"公众号内容量化诊断与优化策略报告"，使用新解析逻辑
  if (markdownReport.includes('公众号内容量化诊断与优化策略报告')) {
    return parseNewFinalFormatReport(markdownReport);
  }
  
  // 旧新格式检测：如果包含"公众号内容量化诊断报告"，使用旧新解析逻辑
  if (markdownReport.includes('公众号内容量化诊断报告')) {
    return parsePreviousNewFormatReport(markdownReport);
  }
  
  // 解析实际的API响应格式 - 支持多种格式
  // 尝试提取标题
  let title = '未知文章';
  const titleMatch1 = markdownReport.match(/^###?\s*\*\*(.+?)\*\*/m);
  const titleMatch2 = markdownReport.match(/\*\*分析对象\*\*：(.+?)\n/);
  const titleMatch3 = markdownReport.match(/\*\*报告生成对象\*\*：(.+?)\n/);
  if (titleMatch1) {
    title = titleMatch1[1].trim();
  } else if (titleMatch2) {
    title = titleMatch2[1].trim();
  } else if (titleMatch3) {
    title = titleMatch3[1].trim();
  }
  
  // 尝试提取日期
  let date = new Date().toISOString().split('T')[0];
  const dateMatch1 = markdownReport.match(/\*\*报告生成时间\*\*：(.+?)\n/);
  const dateMatch2 = markdownReport.match(/报告生成时间：(.+?)\n/);
  if (dateMatch1) {
    date = dateMatch1[1].trim();
  } else if (dateMatch2) {
    date = dateMatch2[1].trim();
  }
  
  // 尝试提取摘要
  let summary = '';
  const summaryMatch1 = markdownReport.match(/\*\*核心主题：\*\*(.+?)(?=\n\n)/);
  const summaryMatch2 = markdownReport.match(/## 报告摘要\n([\s\S]*?)(?=\n##)/);
  const summaryMatch3 = markdownReport.match(/\*\*核心诊断结论\*\*：(.+?)\n/);
  if (summaryMatch1) {
    summary = summaryMatch1[1].trim();
  } else if (summaryMatch2) {
    summary = summaryMatch2[1].trim();
  } else if (summaryMatch3) {
    summary = summaryMatch3[1].trim();
  }
  
  // 尝试提取综合得分
  let score = 0;
  const scoreMatch1 = markdownReport.match(/量化评估总分\*\*(\d+(?:\.\d+)?)分\*\*/);
  const scoreMatch2 = markdownReport.match(/加权总分.*?(\d+(?:\.\d+)?)分/);
  const scoreMatch3 = markdownReport.match(/\*\*加权综合得分\*\*：\*\*(\d+(?:\.\d+)?)\s*\/\s*10\*\*/);
  const scoreMatch4 = markdownReport.match(/综合加权评分：(\d+(?:\.\d+)?)\//);
  if (scoreMatch1) {
    score = parseFloat(scoreMatch1[1]);
  } else if (scoreMatch2) {
    score = parseFloat(scoreMatch2[1]);
  } else if (scoreMatch3) {
    score = parseFloat(scoreMatch3[1]);
  } else if (scoreMatch4) {
    score = parseFloat(scoreMatch4[1]);
  }
  
  // 提取各个维度的得分
  const dimensions = [
    { name: '选题', weight: '30%', score: extractDimensionScore(markdownReport, '选题'), status: getDimensionStatus(extractDimensionScore(markdownReport, '选题')), analysis: '选题洞察深刻，精准定位目标受众', subItems: [] },
    { name: '标题', weight: '20%', score: extractDimensionScore(markdownReport, '标题'), status: getDimensionStatus(extractDimensionScore(markdownReport, '标题')), analysis: '标题吸引力强，情绪调动有效', subItems: [] },
    { name: '结构', weight: '15%', score: extractDimensionScore(markdownReport, '结构'), status: getDimensionStatus(extractDimensionScore(markdownReport, '结构')), analysis: '逻辑清晰，节奏把控良好', subItems: [] },
    { name: '内容', weight: '20%', score: extractDimensionScore(markdownReport, '内容'), status: getDimensionStatus(extractDimensionScore(markdownReport, '内容')), analysis: '观点深度够，案例支撑有力', subItems: [] },
    { name: '文笔', weight: '10%', score: extractDimensionScore(markdownReport, '文笔'), status: getDimensionStatus(extractDimensionScore(markdownReport, '文笔')), analysis: '语言流畅，表达感染力强', subItems: [] },
    { name: '传播', weight: '5%', score: extractDimensionScore(markdownReport, '传播'), status: getDimensionStatus(extractDimensionScore(markdownReport, '传播')), analysis: '互动引导可加强', subItems: [] }
  ];
  
  return {
    meta: {
      title: title,
      source: '微信公众号',
      date: date,
      summary: summary
    },
    score: {
      total: score,
      level: getScoreLevel(score)
    },
    dimensions: dimensions,
    suggestions: {
      strengths: [
        { text: '深刻的选题升维', completed: false },
        { text: '标题悬念+共鸣双驱动', completed: false },
        { text: '立体化的内容支撑', completed: false }
      ],
      weaknesses: [
        { text: '信息密度不均，尾部冗余', completed: false },
        { text: '互动引导薄弱', completed: false },
        { text: '解决方案可操作性可加强', completed: false }
      ],
      actions: [
        { category: 'structure', text: '精简重复信息，强化结尾节奏', estimatedTime: '10分钟', completed: false },
        { category: 'spread', text: '设计情感化行动召唤，升级留言区话题', estimatedTime: '5分钟', completed: false },
        { category: 'content', text: '方法论工具化，增加具体小技巧', estimatedTime: '5分钟', completed: false }
      ]
    }
  };
}

/**
 * 解析最新格式的报告（公众号内容量化诊断与优化策略报告）
 */
function parseNewFinalFormatReport(markdownReport: string): ReportData {
  // 提取标题 - 新格式使用H1标题
  let title = '公众号内容量化诊断与优化策略报告';
  const titleMatch = markdownReport.match(/^# (.+)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  // 提取文章标题
  let articleTitle = '未知文章';
  const articleTitleMatch = markdownReport.match(/\*\*文章标题：\*\* (.+)$/m);
  if (articleTitleMatch) {
    articleTitle = articleTitleMatch[1].trim();
  }
  
  // 提取日期
  let date = new Date().toISOString().split('T')[0];
  const dateMatch = markdownReport.match(/\*\*分析日期：\*\* (.+)$/m);
  if (dateMatch) {
    date = dateMatch[1].trim();
  }
  
  // 提取摘要
  let summary = '';
  const summaryMatch = markdownReport.match(/\*\*报告摘要：\*\* (.+)$/m);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }
  
  // 提取综合得分
  let score = 0;
  const scoreMatch = markdownReport.match(/\*\*加权总分计算\*\*.*?=\s*\*\*(\d+(?:\.\d+)?)\*\*/);
  if (scoreMatch) {
    score = parseFloat(scoreMatch[1]);
  }
  
  // 提取各个维度的得分
  const dimensionMatches = [...markdownReport.matchAll(/### \d+\. ([\u4e00-\u9fa5]+维度) \(平均分：(\d+(?:\.\d+)?)\s*\|\s*权重：(\d+)%\)/g)];
  const dimensions = dimensionMatches.map(match => {
    const name = match[1].replace('维度', '');
    const dimensionScore = parseFloat(match[2]);
    const weight = match[3] + '%';
    
    // 获取维度分析
    const analysis = extractNewFormatDimensionAnalysis(markdownReport, name);
    
    // 获取子项
    const subItems = extractNewFormatSubItems(markdownReport, name);
    
    return {
      name: name,
      weight: weight,
      score: dimensionScore,
      status: getDimensionStatus(dimensionScore),
      analysis: analysis,
      subItems: subItems
    };
  });
  
  // 提取优化策略
  const suggestions = extractOptimizationSuggestions(markdownReport);
  
  return {
    meta: {
      title: articleTitle,
      source: '微信公众号',
      date: date,
      summary: summary
    },
    score: {
      total: score,
      level: getScoreLevel(score)
    },
    dimensions: dimensions,
    suggestions: suggestions
  };
}

/**
 * 解析上一版新格式的报告（公众号内容量化诊断报告）
 */
function parsePreviousNewFormatReport(markdownReport: string): ReportData {
  // 提取标题 - 新格式使用通用标题，尝试从摘要中提取文章名称
  let title = '公众号内容量化诊断报告';
  
  // 尝试从摘要中提取文章标题（格式：聚焦于XXX）
  const articleTitleMatch = markdownReport.match(/聚焦于([^，。]+)[，。]/);
  if (articleTitleMatch) {
    title = articleTitleMatch[1].trim();
  }
  
  // 提取日期 - 使用当前日期
  const date = new Date().toISOString().split('T')[0];
  
  // 提取摘要
  let summary = '';
  const summaryMatch = markdownReport.match(/#### \*\*报告摘要\*\*\n([\s\S]*?)(?=\n\n\*)/);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }
  
  // 提取综合得分
  let score = 0;
  const scoreMatch = markdownReport.match(/\*\*综合加权得分：(\d+(?:\.\d+)?)\s*\/\s*10\*\*/);
  if (scoreMatch) {
    score = parseFloat(scoreMatch[1]);
  }
  
  // 提取各个维度的得分和子项
  const dimensions = [
    { name: '选题', weight: '30%', score: extractPreviousFormatDimensionScore(markdownReport, '选题'), status: getDimensionStatus(extractPreviousFormatDimensionScore(markdownReport, '选题')), analysis: extractPreviousFormatDimensionAnalysis(markdownReport, '选题'), subItems: [] },
    { name: '标题', weight: '20%', score: extractPreviousFormatDimensionScore(markdownReport, '标题'), status: getDimensionStatus(extractPreviousFormatDimensionScore(markdownReport, '标题')), analysis: extractPreviousFormatDimensionAnalysis(markdownReport, '标题'), subItems: [] },
    { name: '结构', weight: '15%', score: extractPreviousFormatDimensionScore(markdownReport, '结构'), status: getDimensionStatus(extractPreviousFormatDimensionScore(markdownReport, '结构')), analysis: extractPreviousFormatDimensionAnalysis(markdownReport, '结构'), subItems: [] },
    { name: '内容', weight: '15%', score: extractPreviousFormatDimensionScore(markdownReport, '内容'), status: getDimensionStatus(extractPreviousFormatDimensionScore(markdownReport, '内容')), analysis: extractPreviousFormatDimensionAnalysis(markdownReport, '内容'), subItems: [] },
    { name: '文笔', weight: '10%', score: extractPreviousFormatDimensionScore(markdownReport, '文笔'), status: getDimensionStatus(extractPreviousFormatDimensionScore(markdownReport, '文笔')), analysis: extractPreviousFormatDimensionAnalysis(markdownReport, '文笔'), subItems: [] },
    { name: '传播', weight: '10%', score: extractPreviousFormatDimensionScore(markdownReport, '传播'), status: getDimensionStatus(extractPreviousFormatDimensionScore(markdownReport, '传播')), analysis: extractPreviousFormatDimensionAnalysis(markdownReport, '传播'), subItems: [] }
  ];
  
  return {
    meta: {
      title: title,
      source: '微信公众号',
      date: date,
      summary: summary
    },
    score: {
      total: score,
      level: getScoreLevel(score)
    },
    dimensions: dimensions,
    suggestions: {
      strengths: [
        { text: '选题精准，贴近受众痛点', completed: false },
        { text: '观点新颖，提供差异化视角', completed: false },
        { text: '案例详实，支撑力强', completed: false }
      ],
      weaknesses: [
        { text: '结构可进一步优化', completed: false },
        { text: '传播钩子可加强', completed: false }
      ],
      actions: [
        { category: 'structure', text: '优化文章结构，提升阅读体验', estimatedTime: '10分钟', completed: false },
        { category: 'spread', text: '设计更具吸引力的传播钩子', estimatedTime: '5分钟', completed: false }
      ]
    }
  };
}

/**
 * 从上一版新格式Markdown中提取维度得分
 */
function extractPreviousFormatDimensionScore(markdown: string, dimensionName: string): number {
  // 上一版格式: #### **1. 选题维度 (平均分: 7.5 / 10)**
  const pattern = new RegExp(`#### \\*\\*\\d+\\. ${dimensionName}维度 \\(平均分: (\\d+(?:\\.\\d+)?)\\s*\\/\\s*10\\)\\*\\*`);
  const match = markdown.match(pattern);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return 0;
}

/**
 * 从新格式Markdown中提取维度得分
 */
function extractNewFormatDimensionScore(markdown: string, dimensionName: string): number {
  // 新格式: ### 1. 选题维度 (平均分：8.5 | 权重：30%)
  const pattern = new RegExp(`### \\d+\\. ${dimensionName}维度 \\(平均分：(\\d+(?:\\.\\d+)?)\\s*\\|\\s*权重：\\d+%\\)`);
  const match = markdown.match(pattern);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return 0;
}

/**
 * 从上一版新格式Markdown中提取维度分析
 */
function extractPreviousFormatDimensionAnalysis(markdown: string, dimensionName: string): string {
  // 尝试从表格中提取分析文本
  const tablePattern = new RegExp(`\\| \\*\\*${dimensionName}.*?\\*\\* \\| \\d+ \\| \\*\\*证据\\*\\*: ([^|]+)`);
  const match = markdown.match(tablePattern);
  if (match) {
    return match[1].trim();
  }
  
  return '';
}

/**
 * 从新格式Markdown中提取维度分析
 */
function extractNewFormatDimensionAnalysis(markdown: string, dimensionName: string): string {
  // 尝试从表格中提取分析文本
  // 新格式表格没有"证据"标记，直接提取表格内容
  const tablePattern = new RegExp(`### \\d+\\. ${dimensionName}维度[\\s\\S]*?\\n\\n`);
  const sectionMatch = markdown.match(tablePattern);
  if (sectionMatch) {
    // 提取第一个子项的分析作为维度分析
    const firstItemMatch = sectionMatch[0].match(/\| \*\*(\w+)\*\* \| (\d+) \| ([^|]+)/);
    if (firstItemMatch) {
      return firstItemMatch[3].trim();
    }
  }
  
  return '';
}

/**
 * 从新格式Markdown中提取子项
 */
function extractNewFormatSubItems(markdown: string, dimensionName: string): any[] {
  // 提取表格中的子项
  const subItems: any[] = [];
  
  // 找到维度部分
  const dimensionPattern = new RegExp(`### \\d+\\. ${dimensionName}维度[\\s\\S]*?(?=\\n### |\\n## |$)`);
  const dimensionMatch = markdown.match(dimensionPattern);
  
  if (dimensionMatch) {
    // 提取表格中的子项
    // 匹配表格行格式: | **子项名** | 分数 | 分析内容 |
    const tablePattern = /\| \*\*(.+?)\*\* \| (\d+) \| ([^|\n]+?)(?=\s*\|?\s*$)/gm;
    let match;
    
    while ((match = tablePattern.exec(dimensionMatch[0])) !== null) {
      const analysis = match[3].trim();
      // 过滤掉表头和分隔行
      if (match[1] !== '子项' && match[1] !== '评估子项' && analysis !== '分析') {
        subItems.push({
          name: match[1].trim(),
          score: parseInt(match[2]),
          analysis: analysis
        });
      }
    }
  }
  
  return subItems;
}

/**
 * 从新格式Markdown中提取优化建议
 */
function extractOptimizationSuggestions(markdown: string): ReportData['suggestions'] {
  const suggestions: ReportData['suggestions'] = {
    strengths: [],
    weaknesses: [],
    actions: []
  };
  
  // 找到优化策略表格部分
  const strategyPattern = /## 二、综合诊断与优化策略[\s\S]*?(?=\n\*\*加权总分计算\*\*)/;
  const strategyMatch = markdown.match(strategyPattern);
  
  if (strategyMatch) {
    const strategyText = strategyMatch[0];
    
    // 提取核心优势（杠杆点）
    const strengthsMatch = strategyText.match(/\| 核心优势（杠杆点）[\s\S]*?\|/);
    if (strengthsMatch) {
      // 提取每个优势项
      const strengthPattern = /\*\*1\.\s*(.+?)\*\*[:：]/g;
      let match;
      while ((match = strengthPattern.exec(strengthsMatch[0])) !== null) {
        suggestions.strengths.push({
          text: match[1].trim(),
          completed: false
        });
      }
    }
    
    // 提取关键短板（瓶颈点）
    const weaknessesMatch = strategyText.match(/\| 关键短板（瓶颈点）[\s\S]*?\|/);
    if (weaknessesMatch) {
      // 提取每个短板项
      const weaknessPattern = /\*\*1\.\s*(.+?)\*\*[:：]/g;
      let match;
      while ((match = weaknessPattern.exec(weaknessesMatch[0])) !== null) {
        suggestions.weaknesses.push({
          text: match[1].trim(),
          completed: false
        });
      }
    }
    
    // 提取具体优化建议作为行动项
    const actionPattern = /\*\*(.+?)\*\*[:：]\s*(.+?)(?=\n\|)/g;
    let match;
    while ((match = actionPattern.exec(strategyText)) !== null) {
      const actionText = match[2].trim();
      if (actionText.length > 5) { // 过滤太短的文本
        suggestions.actions.push({
          category: 'general',
          text: actionText,
          estimatedTime: '10分钟',
          completed: false
        });
      }
    }
  }
  
  // 如果没有提取到建议，使用默认建议
  if (suggestions.strengths.length === 0) {
    suggestions.strengths = [
      { text: '观点洞察深刻，具有差异化', completed: false },
      { text: '情感共鸣强烈，案例支撑有力', completed: false },
      { text: '解决方案具体可操作', completed: false }
    ];
  }
  
  if (suggestions.weaknesses.length === 0) {
    suggestions.weaknesses = [
      { text: '标题悬念闭环设计可优化', completed: false },
      { text: '搜索可见度可进一步提升', completed: false }
    ];
  }
  
  if (suggestions.actions.length === 0) {
    suggestions.actions = [
      { category: 'structure', text: '优化文章结构，提升阅读体验', estimatedTime: '10分钟', completed: false },
      { category: 'title', text: '优化标题悬念闭环设计', estimatedTime: '5分钟', completed: false },
      { category: 'spread', text: '强化搜索关键词布局', estimatedTime: '5分钟', completed: false }
    ];
  }
  
  return suggestions;
}

/**
 * 从Markdown中提取维度得分
 */
function extractDimensionScore(markdown: string, dimensionName: string): number {
  // 尝试多种可能的格式
  const patterns = [
    // 格式1: **选题 (30%权重):** 8.4分
    new RegExp(`\\*\\*${dimensionName} \\(\\d+%权重\\):\\*\\*\\s*(\\d+(?:\\.\\d+)?)分`),
    // 格式2: 选题 (30%权重): 8.4分
    new RegExp(`${dimensionName} \\(\\d+%权重\\):\\s*(\\d+(?:\\.\\d+)?)分`),
    // 格式3: ### 1. 选题维度 (权重30%， 平均分：7.8)
    new RegExp(`${dimensionName}维度 \\(权重\\d+%， 平均分：(\\d+(?:\\.\\d+)?)\\)`),
    // 格式4: 选题维度 (权重30%， 得分8.6)
    new RegExp(`${dimensionName}维度 \\(权重\\d+%， 得分(\\d+(?:\\.\\d+)?)\\)`),
  ];
  
  for (const pattern of patterns) {
    const match = markdown.match(pattern);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  
  return 0;
}

/**
 * 根据分数获取评级
 * @param score 分数
 * @returns 评级字符串
 */
function getScoreLevel(score: number): string {
  if (score >= 9.0) return '优秀';
  if (score >= 8.0) return '良好';
  if (score >= 7.0) return '优质';
  if (score >= 6.0) return '合格';
  return '需改进';
}

/**
 * 解析维度数据
 * @param diagnosis 诊断数据
 * @returns 维度数组
 */
function parseDimensions(diagnosis: any): ReportData['dimensions'] {
  const dimensionMap: Record<string, string> = {
    topic_dimension: '选题',
    title_dimension: '标题',
    structure_dimension: '结构',
    content_dimension: '内容',
    style_dimension: '文笔',
    spread_dimension: '传播'
  };

  return Object.entries(diagnosis).map(([key, value]: [string, any]) => ({
    name: dimensionMap[key] || key,
    weight: value?.weight || '0%',
    score: value?.score || 0,
    status: getDimensionStatus(value?.score || 0),
    analysis: value?.analysis || '',
    subItems: value?.subItems || []
  }));
}

/**
 * 获取维度状态
 * @param score 分数
 * @returns 状态字符串
 */
function getDimensionStatus(score: number): string {
  if (score >= 8.0) return '优秀';
  if (score >= 7.0) return '良好';
  return '需优化';
}

/**
 * 解析建议数据
 * @param strategy 优化策略数据
 * @returns 建议数组
 */
function parseSuggestions(strategy: any): ReportData['suggestions'] {
  const suggestions: ReportData['suggestions'] = {
    strengths: [],
    weaknesses: [],
    actions: []
  };

  if (strategy?.strengths) {
    suggestions.strengths = strategy.strengths.map((s: string) => ({
      text: s,
      completed: false
    }));
  }

  if (strategy?.weaknesses) {
    suggestions.weaknesses = strategy.weaknesses.map((w: string) => ({
      text: w,
      completed: false
    }));
  }

  if (strategy?.actionable_suggestions) {
    suggestions.actions = strategy.actionable_suggestions.map((a: any) => ({
      category: a?.category || 'general',
      text: a?.text || '',
      estimatedTime: a?.estimatedTime || '5分钟',
      completed: false
    }));
  }

  return suggestions;
}

// Mock数据用于开发测试 - 最终新格式
export const mockReportData: ReportData = {
  meta: {
    title: '瘦不下来，是身体在提醒你：6个字',
    source: '微信公众号',
    date: '2024年5月22日',
    summary: '本文是一篇深度探讨减肥与心理健康关系的长文。文章以权威数据切入，通过素人及明星案例，深入剖析了"情绪化进食"的心理学根源，并提供了从"认知转变"到"行为微调"的具体方法。其核心优势在于深刻的观点洞察、强烈的情感共鸣与扎实的案例支撑。主要短板在于标题悬念的闭环设计、关键词的搜索优化以及结尾互动的深度可提升空间。'
  },
  score: {
    total: 8.24,
    level: '优秀'
  },
  dimensions: [
    { name: '选题', weight: '30%', score: 8.5, status: '优秀', analysis: '选题精准命中"健康管理"、"情绪内耗"、"自我提升"等持续性社会热点与大众痛点。"减肥"是永不过时的高关注话题，结合心理健康视角，具备话题延展性。', subItems: [
      { name: '热点匹配度', score: 8, analysis: '选题精准命中"健康管理"、"情绪内耗"、"自我提升"等持续性社会热点与大众痛点。"减肥"是永不过时的高关注话题，结合心理健康视角，具备话题延展性。' },
      { name: '目标受众精准度', score: 9, analysis: '受众画像清晰：有减肥困扰、屡战屡败的人群；工作生活压力大、存在情绪性进食倾向的上班族；追求身心健康而非单纯"变美"的理性读者。' },
      { name: '选题新颖性', score: 9, analysis: '避开了"少吃多动"的陈词滥调，创造性提出"瘦不下来是心理和情绪问题"的核心观点，将减肥升维至"自我关系修复"。' },
      { name: '社会价值', score: 8, analysis: '超越身材焦虑，引导读者关注深层心理健康，提倡自我接纳与诚实面对需求。' }
    ] },
    { name: '标题', weight: '20%', score: 7.7, status: '良好', analysis: '"瘦不下来"直击痛点，"身体在提醒你"赋予生理现象以拟人化智慧，引发好奇。"6个字"制造强烈悬念，驱动点击欲。', subItems: [
      { name: '吸引力强度', score: 9, analysis: '"瘦不下来"直击痛点，"身体在提醒你"赋予生理现象以拟人化智慧，引发好奇。"6个字"制造强烈悬念，驱动点击欲。' },
      { name: '关键词优化', score: 6, analysis: '标题包含核心关键词"瘦不下来"、"身体"，利于初步识别。但悬念词"6个字"并非可搜索的具体问题或关键词。' },
      { name: '情绪调动', score: 8, analysis: '成功调动了读者的"困惑"（为什么瘦不下）、"好奇"（哪六个字）以及潜在的"被理解感"（身体在提醒）。' }
    ] },
    { name: '结构', weight: '15%', score: 8.3, status: '优秀', analysis: '结构脉络清晰：提出问题->分析案例->揭示根源->深化认知->提供方法->价值升华。逻辑层层递进。', subItems: [
      { name: '逻辑清晰度', score: 8, analysis: '结构脉络清晰：提出问题->分析案例->揭示根源->深化认知->提供方法->价值升华。逻辑层层递进。' },
      { name: '节奏把控', score: 9, analysis: '张弛有度。开头用数据和金句快速建立认知，中间用详细故事引发共鸣，后半部分提供科学方法和实操建议。' },
      { name: '信息密度', score: 8, analysis: '信息丰富且集中。融合了医学、心理学、案例、方法论等多维度信息，围绕核心观点展开，无冗余岔题。' }
    ] },
    { name: '内容', weight: '15%', score: 8.7, status: '优秀', analysis: '核心观点"减肥的起点是看见并善待自己"极具洞察力。成功将表层行为与深层需求关联，提供了超越传统减肥文案的认知深度。', subItems: [
      { name: '观点洞察', score: 9, analysis: '核心观点"减肥的起点是看见并善待自己"极具洞察力。成功将表层行为与深层需求关联，提供了超越传统减肥文案的认知深度。' },
      { name: '案例支撑', score: 9, analysis: '案例使用非常出色：无名素人案例具普遍代表性；@Momo的情绪日记案例强化了"进食与抑郁"的关联；马思纯明星案例增加可信度与话题性。' },
      { name: '信息权威性', score: 8, analysis: '引用了国家卫健委数据、斯坦福大学研究、医学概念、心理学家观点等，有效提升了内容的可信度与专业感。' },
      { name: '解决方案', score: 9, analysis: '解决方案具体、可操作且层次丰富：从即刻可用的"生理性叹息法"到行为层面的4条具体建议，再到认知层面的"练习诚实"。' }
    ] },
    { name: '文笔', weight: '10%', score: 8.7, status: '优秀', analysis: '语言流畅自然，从理性论述到感性呼唤过渡平滑。句子长短结合，富有节奏感，金句频出。', subItems: [
      { name: '语言流畅度', score: 9, analysis: '语言流畅自然，从理性论述到感性呼唤过渡平滑。句子长短结合，富有节奏感，如"管好腰围，管好体重，就是管好人生的风水"等金句频出。' },
      { name: '风格感染力', score: 9, analysis: '文字充满共情与温度。如"把自己当回事"、"你太委屈了"、"修复一段关系"等表述，能有效触动读者情绪。' },
      { name: '可读性', score: 8, analysis: '段落划分清晰，重点句子加粗突出，关键建议分点列出，排版友好，利于快速浏览与重点捕捉。' }
    ] },
    { name: '传播', weight: '10%', score: 7.3, status: '良好', analysis: '文末有明确的互动引导，内容本身具有高社交货币属性，容易引发共鸣和分享。', subItems: [
      { name: '互动引导', score: 8, analysis: '文末有明确的互动引导："点个吧"引导点赞，"留言福利"激励评论，并设置了赠书活动的截止时间，设计完整。' },
      { name: '社交属性', score: 8, analysis: '内容本身具有高社交货币属性。关于"情绪与体重"的深刻洞察，容易引发读者"这就是我"的共鸣。' },
      { name: '转发驱动', score: 6, analysis: '情感共鸣和实用价值是主要转发动力。但缺乏一个更具象、更易于直接引用的"转发金句"。' }
    ] }
  ],
  suggestions: {
    strengths: [
      { text: '深刻的选题洞察：将减肥失败归因于心理情绪，提供认知升维，差异化显著', completed: false },
      { text: '强烈的情感共鸣：通过高共鸣案例和充满共情的文笔，精准触达目标读者的情绪痛点', completed: false },
      { text: '扎实的案例与方案支撑：素人、博主、明星多层级案例+具体可操作方法', completed: false }
    ],
    weaknesses: [
      { text: '标题关键词与悬念闭环：标题悬念"6个字"在文中未明确点出并强化', completed: false },
      { text: '结尾互动深度：留言福利与文章核心主题的关联度可以更强', completed: false },
      { text: '搜索可见度优化：标题和文章前部对具体搜索关键词的覆盖可以更显性', completed: false }
    ],
    actions: [
      { category: 'title', text: '优化悬念闭环：在文章结尾总结部分，可以明确点出并加粗："这"6个字"，就是"把自己当回事"。"', estimatedTime: '10分钟', completed: false },
      { category: 'spread', text: '强化主题关联互动：将留言引导语具体化，引导读者产出与文章主题强相关的优质内容', estimatedTime: '5分钟', completed: false },
      { category: 'structure', text: '植入核心搜索关键词：在摘要/导语优化，添加加粗的摘要，包含"情绪化进食"、"压力肥"等关键词', estimatedTime: '5分钟', completed: false }
    ]
  }
};