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
    <div className="min-h-screen pb-20">
      {/* 动态背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-2xl"></div>
      </div>

      {/* 页面头部 */}
      <header className="sticky top-0 z-40 glass-card border-t-0 border-l-0 border-r-0 rounded-none">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-xl">📊</span>
            </div>
            <h1 className="text-xl font-bold gradient-text">公众号文章分析报告</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setReportData(mockReportData)}
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/30"
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
          <div className="glass-card p-8 mb-8 fade-in">
            <h2 className="text-xl font-semibold gradient-text mb-6 flex items-center">
              <span className="mr-3">🔗</span> 输入文章链接
            </h2>
            <div className="flex space-x-4">
              <input
                type="url"
                value={articleLink}
                onChange={(e) => setArticleLink(e.target.value)}
                placeholder="请输入公众号文章链接"
                className="flex-1 px-6 py-4 bg-black/30 border border-purple-500/30 rounded-2xl text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
              />
              <button
                onClick={() => loadReport(articleLink)}
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg hover:shadow-purple-500/30 flex items-center space-x-2"
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
            <div className="mt-6">
              <p className="text-sm text-[#64748b] mb-3">快速测试：</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setArticleLink('https://mp.weixin.qq.com/s/JiudwzgP77S3Kmr9BNBA0w');
                    loadReport('https://mp.weixin.qq.com/s/JiudwzgP77S3Kmr9BNBA0w');
                  }}
                  className="text-sm text-[#a78bfa] hover:text-[#c4b5fd] transition-colors flex items-center space-x-2"
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
          <div className="glass-card px-8 py-6 mb-8 fade-in flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center pulse-glow">
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <p className="text-[#f8fafc] font-medium">正在分析文章...</p>
              <p className="text-[#64748b] text-sm">预计需要5-10分钟，请耐心等待</p>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="glass-card px-8 py-6 mb-8 fade-in border-red-500/50">
            <div className="flex items-center space-x-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* 报告内容 */}
        {reportData && (
          <>
            {/* 报告头部概览区 */}
            <ReportHeader meta={reportData.meta} />
            
            {/* 总分仪表盘 */}
            <div className="glass-card p-8 mb-8 fade-in">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold gradient-text mb-3 flex items-center">
                    <span className="mr-3">⭐</span> 综合评分
                  </h2>
                  <p className="text-[#94a3b8]">
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

            {/* 维度诊断详情区 */}
            <div className="mb-8 fade-in">
              <h2 className="text-xl font-semibold gradient-text mb-6 flex items-center">
                <span className="mr-3">📊</span> 维度诊断详情
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reportData.dimensions.map((dimension) => (
                  <DimensionCard
                    key={dimension.name}
                    dimension={dimension}
                    isActive={activeDimension === dimension.name}
                    onClick={() => toggleDimension(dimension.name)}
                  />
                ))}
              </div>
            </div>

            {/* 雷达图 */}
            <div className="mb-8 fade-in">
              <h2 className="text-xl font-semibold gradient-text mb-6 flex items-center">
                <span className="mr-3">📈</span> 能力雷达图
              </h2>
              <RadarChart dimensions={reportData.dimensions} />
            </div>

            {/* 综合建议与行动区 */}
            <div className="fade-in">
              <h2 className="text-xl font-semibold gradient-text mb-6 flex items-center">
                <span className="mr-3">💡</span> 优化建议
              </h2>
              <ActionList
                suggestions={reportData.suggestions}
                completedActions={completedActions}
                onToggleAction={toggleAction}
              />
            </div>
          </>
        )}
      </main>

      {/* 操作工具栏 */}
      {reportData && (
        <ExportToolbar
          onExport={handleExport}
          onEdit={handleEdit}
          onShare={handleShare}
          onCreateNew={handleCreateNew}
        />
      )}
    </div>
  );
}

export default App;