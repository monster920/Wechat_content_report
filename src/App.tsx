import { useState, useEffect } from 'react';
import ReportHeader from './components/ReportHeader';
import ScoreGauge from './components/ScoreGauge';
import DimensionCard from './components/DimensionCard';
import RadarChart from './components/RadarChart';
import ActionList from './components/ActionList';
import ExportToolbar from './components/ExportToolbar';
import { fetchReport, mockReportData } from './api/service';
import { exportReport } from './api/export';
import type { ReportData } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [articleLink, setArticleLink] = useState('');

  // 加载报告数据
  const loadReport = async (link: string) => {
    if (!link) {
      setError('请输入公众号文章链接');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 调用真实API
      console.log('开始调用API，链接:', link);
      const data = await fetchReport(link);
      console.log('API返回数据:', data);
      setReportData(data);
    } catch (err) {
      console.error('API调用错误:', err);
      setError(err instanceof Error ? err.message : '加载报告失败');
    } finally {
      setLoading(false);
    }
  };

  // 切换维度展开状态
  const toggleDimension = (dimensionName: string) => {
    setActiveDimension(activeDimension === dimensionName ? null : dimensionName);
  };

  // 切换行动项完成状态
  const toggleAction = (actionId: string) => {
    setCompletedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  // 导出功能
  const handleExport = async (format: string) => {
    if (!reportData) {
      alert('请先生成报告后再导出');
      return;
    }
    
    try {
      await exportReport(reportData, format);
      console.log(`成功导出为 ${format} 格式`);
    } catch (error) {
      console.error('导出失败:', error);
      alert(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 一键改稿
  const handleEdit = () => {
    alert('一键改稿功能（功能开发中）');
  };

  // 分享报告
  const handleShare = () => {
    alert('分享报告功能（功能开发中）');
  };

  // 创建新诊断
  const handleCreateNew = () => {
    setReportData(null);
    setArticleLink('');
    setActiveDimension(null);
    setCompletedActions([]);
  };

  return (
    <div className="min-h-screen pb-20 bg-secondary">
      {/* 页面头部 */}
      <header className="sticky top-0 z-40 bg-primary border-b border-light">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shadow-sm">
              <span className="text-base">📊</span>
            </div>
            <h1 className="text-base font-semibold text-primary">公众号文章分析报告</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setReportData(mockReportData)}
              className="px-4 py-2 text-sm font-medium bg-accent text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              ✨ 使用模拟数据
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* 输入区域 */}
        {!reportData && (
          <div className="card-primary p-6 mb-6 fade-in">
            <h2 className="text-lg font-semibold text-primary mb-5 flex items-center">
              <span className="mr-2">🔗</span> 输入文章链接
            </h2>
            <div className="flex space-x-3">
              <input
                type="url"
                value={articleLink}
                onChange={(e) => setArticleLink(e.target.value)}
                placeholder="请输入公众号文章链接"
                className="flex-1 px-4 py-3 bg-tertiary border border-light rounded-lg text-primary placeholder-text-placeholder focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                onClick={() => loadReport(articleLink)}
                disabled={loading}
                className="px-6 py-3 bg-accent text-primary font-medium rounded-lg hover:bg-primary hover:text-white disabled:opacity-50 transition-all flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>分析中...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>开始分析</span>
                  </>
                )}
              </button>
            </div>
            
            {/* 快速测试链接 */}
            <div className="mt-5">
              <p className="text-sm text-muted mb-2">快速测试：</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setArticleLink('https://mp.weixin.qq.com/s/JiudwzgP77S3Kmr9BNBA0w');
                    loadReport('https://mp.weixin.qq.com/s/JiudwzgP77S3Kmr9BNBA0w');
                  }}
                  className="text-sm text-secondary hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <span>📄</span>
                  <span>使用示例文章链接</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 加载状态提示 */}
        {loading && (
          <div className="card-primary px-6 py-5 mb-6 fade-in flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <p className="text-primary font-medium text-sm">正在分析文章...</p>
              <p className="text-muted text-xs">预计需要5-10分钟，请耐心等待</p>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="card-primary px-6 py-5 mb-6 fade-in border-l-4 border-error">
            <div className="flex items-center space-x-3">
              <span className="text-error text-lg">⚠️</span>
              <p className="text-error text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 报告内容 */}
        {reportData && (
          <>
            {/* 报告头部概览区 */}
            <ReportHeader meta={reportData.meta} />
            
            {/* 总分仪表盘 */}
            <div className="card-primary p-6 mb-6 fade-in">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-primary mb-2 flex items-center">
                    <span className="mr-2">⭐</span> 综合评分
                  </h2>
                  <p className="text-secondary text-xs">
                    基于选题、标题、结构、内容、文笔、传播六个维度的加权计算
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <ScoreGauge 
                    score={reportData.score.total} 
                    level={reportData.score.level} 
                  />
                </div>
              </div>
            </div>

            {/* 维度诊断详情区 - 支持放大覆盖 */}
            <div className="mb-6 fade-in relative min-h-[400px]">
              <h2 className="text-lg font-semibold text-primary mb-5 flex items-center">
                <span className="mr-2">📊</span> 维度诊断详情
              </h2>
              <div className={`grid gap-5 ${
                activeDimension 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {reportData.dimensions.map((dimension) => (
                  <DimensionCard
                    key={dimension.name}
                    dimension={dimension}
                    isActive={activeDimension === dimension.name}
                    onClick={() => toggleDimension(dimension.name)}
                    isExpanded={activeDimension === dimension.name}
                    onExpandedChange={(expanded) => {
                      if (!expanded) {
                        setActiveDimension(null);
                      }
                    }}
                  />
                ))}
              </div>
              
              {/* 遮罩层 - 点击关闭放大卡片 */}
              {activeDimension && (
                <div 
                  className="absolute inset-0 bg-gray-300/50 z-10"
                  onClick={() => setActiveDimension(null)}
                />
              )}
            </div>

            {/* 雷达图和优化建议并排显示（桌面端） */}
            <div className={`grid gap-6 mb-6 fade-in relative ${
              expandedSection ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {/* 雷达图 */}
              <div 
                className={`cursor-pointer transition-all duration-200 ${
                  expandedSection === 'radar' 
                    ? 'fixed inset-4 z-50 overflow-auto' 
                    : ''
                }`}
                onClick={() => expandedSection === 'radar' ? setExpandedSection(null) : setExpandedSection('radar')}
              >
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <span className="mr-2">📈</span> 能力雷达图
                  {expandedSection === 'radar' && (
                    <button 
                      className="ml-auto text-xs text-secondary hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSection(null);
                      }}
                    >
                      ✕ 关闭
                    </button>
                  )}
                </h2>
                <RadarChart dimensions={reportData.dimensions} />
              </div>

              {/* 综合建议与行动区 */}
              <div 
                className={`cursor-pointer transition-all duration-200 ${
                  expandedSection === 'suggestions' 
                    ? 'fixed inset-4 z-50 overflow-auto' 
                    : ''
                }`}
                onClick={() => expandedSection === 'suggestions' ? setExpandedSection(null) : setExpandedSection('suggestions')}
              >
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <span className="mr-2">💡</span> 优化建议
                  {expandedSection === 'suggestions' && (
                    <button 
                      className="ml-auto text-sm text-secondary hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSection(null);
                      }}
                    >
                      ✕ 关闭
                    </button>
                  )}
                </h2>
                <ActionList
                  suggestions={reportData.suggestions}
                  completedActions={completedActions}
                  onToggleAction={toggleAction}
                />
              </div>
              
              {/* 遮罩层 - 点击关闭放大卡片 */}
              {expandedSection && (
                <div 
                  className="absolute inset-0 bg-gray-300/50 z-10"
                  onClick={() => setExpandedSection(null)}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* 操作工具栏 - 增加底部padding避免遮挡 */}
      {reportData && (
        <div className="pb-24">
          <ExportToolbar
            onExport={handleExport}
            onEdit={handleEdit}
            onShare={handleShare}
            onCreateNew={handleCreateNew}
          />
        </div>
      )}
    </div>
  );
}

export default App;