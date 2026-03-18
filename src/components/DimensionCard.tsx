import React, { useState } from 'react';
import type { DimensionData } from '../types';

interface DimensionCardProps {
  dimension: DimensionData;
  isActive: boolean;
  onClick: () => void;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ dimension, isActive, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '优秀':
        return 'bg-green-100 text-green-800';
      case '良好':
        return 'bg-blue-100 text-blue-800';
      case '需优化':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '优秀':
        return '✓';
      case '良好':
        return '○';
      case '需优化':
        return '⚠️';
      default:
        return '?';
    }
  };

  const getScoreBarWidth = (score: number) => {
    return `${(score / 10) * 100}%`;
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 border cursor-pointer transition-all ${
        isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      {/* 卡片头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📊</span>
          <h3 className="font-semibold text-gray-900">{dimension.name}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(dimension.status)}`}>
          {getStatusIcon(dimension.status)} {dimension.status}
        </span>
      </div>

      {/* 权重和分数 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">权重：{dimension.weight}</span>
        <span className="text-sm font-medium text-gray-900">
          得分：{dimension.score.toFixed(1)} / 10
        </span>
      </div>

      {/* 分数进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full ${
            dimension.score >= 8.0 ? 'bg-green-500' :
            dimension.score >= 7.0 ? 'bg-blue-500' :
            'bg-orange-500'
          }`}
          style={{ width: getScoreBarWidth(dimension.score) }}
        />
      </div>

      {/* 分析依据预览 */}
      {dimension.analysis && (
        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
          {dimension.analysis}
        </div>
      )}

      {/* 展开/收起按钮 */}
      <div className="flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          {isExpanded ? '收起详情' : '查看详情 ↓'}
        </button>
      </div>

      {/* 详情表格（展开时显示） */}
      {isExpanded && dimension.subItems && dimension.subItems.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2">子项</th>
                <th className="pb-2">分数</th>
                <th className="pb-2">分析依据</th>
              </tr>
            </thead>
            <tbody>
              {dimension.subItems.map((item, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(item.score / 10) * 100}%` }}
                        />
                      </div>
                      <span>{item.score.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-2 text-gray-600">{item.analysis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DimensionCard;