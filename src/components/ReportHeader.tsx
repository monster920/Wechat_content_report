import { useState } from 'react';
import type { MetaData } from '../types';

interface ReportHeaderProps {
  meta: MetaData;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ meta }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const toggleSummary = () => {
    setIsSummaryExpanded(!isSummaryExpanded);
  };

  const getSummaryPreview = () => {
    if (meta.summary.length <= 100) return meta.summary;
    return meta.summary.substring(0, 100) + '...';
  };

  return (
    <div className="glass-card p-8 mb-8 fade-in">
      {/* 文章标题 */}
      <h1 className="text-3xl font-bold gradient-text mb-4 leading-tight">
        {meta.title}
      </h1>

      {/* 来源和时间标签 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-[#a78bfa] rounded-full text-sm font-medium backdrop-blur-sm">
          📰 {meta.source}
        </span>
        <span className="px-4 py-1.5 bg-black/30 border border-cyan-500/30 text-[#67e8f9] rounded-full text-sm backdrop-blur-sm">
          📅 {meta.date}
        </span>
      </div>

      {/* 报告摘要 */}
      <div className="text-[#94a3b8]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium gradient-text">📋 报告摘要</span>
          <button
            onClick={toggleSummary}
            className="text-[#a78bfa] text-sm hover:text-[#c4b5fd] transition-colors flex items-center space-x-1"
          >
            <span>{isSummaryExpanded ? '收起' : '展开'}</span>
            <span>{isSummaryExpanded ? '↑' : '↓'}</span>
          </button>
        </div>
        <p className="text-sm leading-relaxed text-[#cbd5e1]">
          {isSummaryExpanded ? meta.summary : getSummaryPreview()}
        </p>
      </div>
    </div>
  );
};

export default ReportHeader;