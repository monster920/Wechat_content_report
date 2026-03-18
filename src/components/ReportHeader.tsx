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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* 文章标题 */}
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {meta.title}
      </h1>

      {/* 来源和时间标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {meta.source}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
          {meta.date} 生成
        </span>
      </div>

      {/* 报告摘要 */}
      <div className="text-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">报告摘要</span>
          <button
            onClick={toggleSummary}
            className="text-blue-600 text-sm hover:text-blue-800"
          >
            {isSummaryExpanded ? '收起' : '展开'}
          </button>
        </div>
        <p className="text-sm leading-relaxed">
          {isSummaryExpanded ? meta.summary : getSummaryPreview()}
        </p>
      </div>
    </div>
  );
};

export default ReportHeader;