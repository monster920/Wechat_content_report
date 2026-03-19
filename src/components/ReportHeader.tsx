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
    <div className="card-primary p-5 mb-6 fade-in">
      {/* 文章标题 */}
      <h1 className="text-xl font-bold mb-3 leading-tight text-primary">
        {meta.title}
      </h1>

      {/* 来源和时间标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-tertiary border border-light text-secondary rounded-md text-xs font-medium">
          📰 {meta.source}
        </span>
        <span className="px-3 py-1 bg-tertiary border border-light text-secondary rounded-md text-xs">
          📅 {meta.date}
        </span>
      </div>

      {/* 报告摘要 */}
      <div className="text-secondary">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium accent-text">📋 报告摘要</span>
          <button
            onClick={toggleSummary}
            className="text-xs text-secondary hover:text-primary transition-colors flex items-center space-x-1"
          >
            <span>{isSummaryExpanded ? '收起' : '展开'}</span>
            <span>{isSummaryExpanded ? '↑' : '↓'}</span>
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          {isSummaryExpanded ? meta.summary : getSummaryPreview()}
        </p>
      </div>
    </div>
  );
};

export default ReportHeader;