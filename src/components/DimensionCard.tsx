import React, { useState } from 'react';
import type { DimensionData } from '../types';

interface DimensionCardProps {
  dimension: DimensionData;
  isActive: boolean;
  onClick: () => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ 
  dimension, 
  isActive, 
  onClick,
  isExpanded: propsIsExpanded,
  onExpandedChange
}) => {
  const [localIsExpanded, setIsExpanded] = useState(false);
  const isExpanded = propsIsExpanded !== undefined ? propsIsExpanded : localIsExpanded;

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
      className={`card-primary p-4 cursor-pointer transition-all duration-200 ${
        isExpanded 
          ? 'fixed inset-4 z-50 overflow-auto' 
          : isActive 
            ? 'border-accent ring-2 ring-accent/20' 
            : ''
      }`}
      onClick={onClick}
    >
      {/* 卡片头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-tertiary flex items-center justify-center border border-light">
            <span className="text-xs">📊</span>
          </div>
          <h4 className="font-medium text-primary">{dimension.name}</h4>
        </div>
        <div className="flex items-center space-x-2">
          {isExpanded && (
            <button 
              className="text-xs text-secondary hover:text-primary px-2 py-1"
              onClick={(e) => {
                e.stopPropagation();
                if (onExpandedChange) {
                  onExpandedChange(false);
                }
              }}
            >
              ✕ 关闭
            </button>
          )}
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
            dimension.status === '优秀' 
              ? 'bg-success-bg text-success border border-success/20' :
            dimension.status === '良好' 
              ? 'bg-accent-bg text-accent-primary border border-accent/20' :
            'bg-warning-bg text-warning border border-warning/20'
          }`}>
            {getStatusIcon(dimension.status)} {dimension.status}
          </span>
        </div>
      </div>

      {/* 权重和分数 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted">权重：{dimension.weight}</span>
        <span className="text-xs font-medium text-primary">
          {dimension.score.toFixed(1)} / 10
        </span>
      </div>

      {/* 分数进度条 */}
      <div className="w-full bg-tertiary rounded-full h-1.5 mb-3">
        <div 
          className="h-1.5 rounded-full bg-accent"
          style={{ width: getScoreBarWidth(dimension.score) }}
        />
      </div>

      {/* 分析依据预览 */}
      {dimension.analysis && (
        <div className="text-xs text-secondary mb-3 line-clamp-2">
          {dimension.analysis}
        </div>
      )}

      {/* 展开/收起按钮 */}
      <div className="flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newExpanded = !isExpanded;
            if (propsIsExpanded === undefined) {
              setIsExpanded(newExpanded);
            }
            if (onExpandedChange) {
              onExpandedChange(newExpanded);
            }
          }}
          className="text-secondary text-xs hover:text-primary transition-colors flex items-center space-x-1"
        >
          <span>{isExpanded ? '收起详情' : '查看详情'}</span>
          <span>{isExpanded ? '↑' : '↓'}</span>
        </button>
      </div>

      {/* 详情表格（展开时显示） */}
      {isExpanded && dimension.subItems && dimension.subItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-primary">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#64748b]">
                <th className="pb-2 gradient-text">子项</th>
                <th className="pb-2 gradient-text">分数</th>
                <th className="pb-2 gradient-text">分析依据</th>
              </tr>
            </thead>
            <tbody>
              {dimension.subItems.map((item, index) => (
                <tr key={index} className="border-t border-purple-500/10">
                  <td className="py-3 text-[#cbd5e1]">{item.name}</td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-black/30 rounded-full h-1.5 mr-2">
                        <div 
                          className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/30"
                          style={{ width: `${(item.score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="gradient-text">{item.score.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-3 text-[#64748b]">{item.analysis}</td>
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