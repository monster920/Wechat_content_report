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
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-8 mb-8 fade-in">
      {/* 文章标题 */}
      <h1 className="text-3xl font-bold text-[#ffffff] mb-4 leading-tight">
        {meta.title}
      </h1>

      {/* 来源和时间标签 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="px-4 py-1.5 bg-[#d4af37] text-[#0a0a0a] rounded-full text-sm font-medium">
          📰 {meta.source}
        </span>
        <span className="px-4 py-1.5 bg-[#2a2a2a] text-[#a0a0a0] rounded-full text-sm">
          📅 {meta.date}
        </span>
      </div>

      {/* 报告摘要 */}
      <div className="text-[#a0a0a0]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#d4af37]">📋 报告摘要</span>
          <button
            onClick={toggleSummary}
            className="text-[#d4af37] text-sm hover:text-[#f4d03f] transition-colors"
          >
            {isSummaryExpanded ? '收起 ↑' : '展开 ↓'}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-[#c0c0c0]">
          {isSummaryExpanded ? meta.summary : getSummaryPreview()}
        </p>
      </div>
    </div>
  );
};

export default ReportHeader;