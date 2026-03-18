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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">公众号文章分析报告</h1>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 输入区域 */}
        {!reportData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">输入文章链接</h2>
            <div className="flex space-x-3">
              <input
                type="url"
                value={articleLink}
                onChange={(e) => setArticleLink(e.target.value)}
                placeholder="请输入公众号文章链接"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => loadReport(articleLink)}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '分析中...' : '开始分析'}
              </button>
            </div>
            
            {/* 快速测试链接 */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">快速测试：</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setArticleLink('https://mp.weixin.qq.com/s/JiudwzgP77S3Kmr9BNBA0w');
                    loadReport('https://mp.weixin.qq.com/s/JiudwzgP77S3Kmr9BNBA0w');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  使用示例文章链接
                </button>
                <button
                  onClick={() => {
                    setReportData(mockReportData);
                  }}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  使用模拟数据
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 加载状态提示 */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>正在分析文章，请稍候...（预计需要5-10分钟）</span>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 报告内容 */}
        {reportData && (
          <>
            {/* 报告头部概览区 */}
            <ReportHeader meta={reportData.meta} />
            
            {/* 总分仪表盘 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">综合评分</h2>
                  <p className="text-gray-600">
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
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">维度诊断详情</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <RadarChart dimensions={reportData.dimensions} />

            {/* 综合建议与行动区 */}
            <ActionList
              suggestions={reportData.suggestions}
              completedActions={completedActions}
              onToggleAction={toggleAction}
            />
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