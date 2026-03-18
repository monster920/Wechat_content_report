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
      className={`glass-card p-6 cursor-pointer transition-all ${
        isActive 
          ? 'border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.4)]' 
          : ''
      }`}
      onClick={onClick}
    >
      {/* 卡片头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/50 to-cyan-500/50 flex items-center justify-center">
            <span className="text-sm">📊</span>
          </div>
          <h3 className="font-semibold text-[#f8fafc]">{dimension.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          dimension.status === '优秀' 
            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' :
          dimension.status === '良好' 
            ? 'bg-black/30 text-[#a78bfa] border border-purple-500/30' :
          'bg-black/30 text-[#94a3b8] border border-gray-500/30'
        }`}>
          {getStatusIcon(dimension.status)} {dimension.status}
        </span>
      </div>

      {/* 权重和分数 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#64748b]">权重：{dimension.weight}</span>
        <span className="text-sm font-medium gradient-text">
          {dimension.score.toFixed(1)} / 10
        </span>
      </div>

      {/* 分数进度条 */}
      <div className="w-full bg-black/30 rounded-full h-2 mb-4">
        <div 
          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/30"
          style={{ width: getScoreBarWidth(dimension.score) }}
        />
      </div>

      {/* 分析依据预览 */}
      {dimension.analysis && (
        <div className="text-sm text-[#94a3b8] mb-3 line-clamp-2">
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
          className="text-[#a78bfa] text-sm hover:text-[#c4b5fd] transition-colors flex items-center space-x-1"
        >
          <span>{isExpanded ? '收起详情' : '查看详情'}</span>
          <span>{isExpanded ? '↑' : '↓'}</span>
        </button>
      </div>

      {/* 详情表格（展开时显示） */}
      {isExpanded && dimension.subItems && dimension.subItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-500/20">
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