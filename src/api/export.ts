// 导出服务 - 处理报告导出功能
import type { ReportData } from '../types';

/**
 * 导出报告为不同格式
 */
export async function exportReport(reportData: ReportData, format: string): Promise<void> {
  switch (format) {
    case 'pdf':
      await exportToPDF(reportData);
      break;
    case 'word':
      await exportToWord(reportData);
      break;
    case 'markdown':
      await exportToMarkdown(reportData);
      break;
    default:
      throw new Error(`不支持的导出格式: ${format}`);
  }
}

/**
 * 导出为PDF格式
 */
async function exportToPDF(reportData: ReportData): Promise<void> {
  // 创建HTML内容
  const htmlContent = generateHTMLContent(reportData);
  
  // 使用浏览器打印功能创建PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('无法打开打印窗口');
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>公众号内容分析报告 - ${reportData.meta.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          .meta { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .score { font-size: 24px; color: #3b82f6; font-weight: bold; }
          .dimension { margin-bottom: 15px; padding: 10px; background: #f9fafb; border-radius: 5px; }
          .subitems { margin-top: 10px; }
          .subitem { margin-left: 20px; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // 等待内容加载完成
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 触发打印
  printWindow.print();
}

/**
 * 导出为Word格式
 */
async function exportToWord(reportData: ReportData): Promise<void> {
  const content = generateMarkdownContent(reportData);
  
  // 创建Blob并下载
  const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
  downloadBlob(blob, `公众号分析报告_${reportData.meta.title}.doc`);
}

/**
 * 导出为Markdown格式
 */
async function exportToMarkdown(reportData: ReportData): Promise<void> {
  const content = generateMarkdownContent(reportData);
  
  // 创建Blob并下载
  const blob = new Blob([content], { type: 'text/markdown' });
  downloadBlob(blob, `公众号分析报告_${reportData.meta.title}.md`);
}

/**
 * 生成HTML内容
 */
function generateHTMLContent(reportData: ReportData): string {
  let html = `
    <h1>公众号内容分析报告</h1>
    <div class="meta">
      <p><strong>文章标题：</strong>${reportData.meta.title}</p>
      <p><strong>分析日期：</strong>${reportData.meta.date}</p>
      <p><strong>报告摘要：</strong>${reportData.meta.summary}</p>
    </div>
    
    <h2>综合评分</h2>
    <div class="score">${reportData.score.total}分 - ${reportData.score.level}</div>
    
    <h2>维度诊断详情</h2>
  `;
  
  reportData.dimensions.forEach(dim => {
    html += `
      <div class="dimension">
        <h3>${dim.name} (${dim.weight}) - ${dim.score}分</h3>
        <p>${dim.analysis}</p>
    `;
    
    if (dim.subItems && dim.subItems.length > 0) {
      html += `<div class="subitems"><h4>子项分析：</h4>`;
      dim.subItems.forEach(item => {
        html += `<div class="subitem"><strong>${item.name}:</strong> ${item.score}分 - ${item.analysis}</div>`;
      });
      html += `</div>`;
    }
    
    html += `</div>`;
  });
  
  html += `
    <h2>优化建议</h2>
    <h3>核心优势：</h3>
    <ul>
      ${reportData.suggestions.strengths.map(s => `<li>${s.text}</li>`).join('')}
    </ul>
    <h3>关键短板：</h3>
    <ul>
      ${reportData.suggestions.weaknesses.map(w => `<li>${w.text}</li>`).join('')}
    </ul>
    <h3>优化行动：</h3>
    <ul>
      ${reportData.suggestions.actions.map(a => `<li>${a.text} (${a.estimatedTime})</li>`).join('')}
    </ul>
  `;
  
  return html;
}

/**
 * 生成Markdown内容
 */
function generateMarkdownContent(reportData: ReportData): string {
  let md = `# 公众号内容分析报告\n\n`;
  
  md += `**文章标题：** ${reportData.meta.title}\n`;
  md += `**分析日期：** ${reportData.meta.date}\n`;
  md += `**报告摘要：** ${reportData.meta.summary}\n\n`;
  
  md += `## 综合评分\n\n`;
  md += `**${reportData.score.total}分 - ${reportData.score.level}**\n\n`;
  
  md += `## 维度诊断详情\n\n`;
  
  reportData.dimensions.forEach(dim => {
    md += `### ${dim.name} (${dim.weight}) - ${dim.score}分\n\n`;
    md += `${dim.analysis}\n\n`;
    
    if (dim.subItems && dim.subItems.length > 0) {
      md += `**子项分析：**\n\n`;
      dim.subItems.forEach(item => {
        md += `- **${item.name}:** ${item.score}分 - ${item.analysis}\n`;
      });
      md += `\n`;
    }
  });
  
  md += `## 优化建议\n\n`;
  md += `### 核心优势\n\n`;
  reportData.suggestions.strengths.forEach(s => {
    md += `- ${s.text}\n`;
  });
  
  md += `\n### 关键短板\n\n`;
  reportData.suggestions.weaknesses.forEach(w => {
    md += `- ${w.text}\n`;
  });
  
  md += `\n### 优化行动\n\n`;
  reportData.suggestions.actions.forEach(a => {
    md += `- ${a.text} (${a.estimatedTime})\n`;
  });
  
  return md;
}

/**
 * 下载Blob文件
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}