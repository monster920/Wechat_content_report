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
      className={`bg-[#161616] border rounded-2xl p-5 cursor-pointer transition-all ${
        isActive 
          ? 'border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
          : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
      }`}
      onClick={onClick}
    >
      {/* 卡片头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-xl">📊</span>
          <h3 className="font-semibold text-[#ffffff]">{dimension.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          dimension.status === '优秀' ? 'bg-[#d4af37] text-[#0a0a0a]' :
          dimension.status === '良好' ? 'bg-[#2a2a2a] text-[#d4af37]' :
          'bg-[#3a3a3a] text-[#a0a0a0]'
        }`}>
          {getStatusIcon(dimension.status)} {dimension.status}
        </span>
      </div>

      {/* 权重和分数 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#6b6b6b]">权重：{dimension.weight}</span>
        <span className="text-sm font-medium text-[#d4af37]">
          {dimension.score.toFixed(1)} / 10
        </span>
      </div>

      {/* 分数进度条 */}
      <div className="w-full bg-[#1f1f1f] rounded-full h-2 mb-4">
        <div 
          className="h-2 rounded-full bg-gradient-to-r from-[#f4d03f] to-[#d4af37]"
          style={{ width: getScoreBarWidth(dimension.score) }}
        />
      </div>

      {/* 分析依据预览 */}
      {dimension.analysis && (
        <div className="text-sm text-[#a0a0a0] mb-3 line-clamp-2">
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
          className="text-[#d4af37] text-sm hover:text-[#f4d03f] transition-colors"
        >
          {isExpanded ? '收起详情 ↑' : '查看详情 ↓'}
        </button>
      </div>

      {/* 详情表格（展开时显示） */}
      {isExpanded && dimension.subItems && dimension.subItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#6b6b6b]">
                <th className="pb-2 text-[#d4af37]">子项</th>
                <th className="pb-2 text-[#d4af37]">分数</th>
                <th className="pb-2 text-[#d4af37]">分析依据</th>
              </tr>
            </thead>
            <tbody>
              {dimension.subItems.map((item, index) => (
                <tr key={index} className="border-t border-[#2a2a2a]">
                  <td className="py-3 text-[#c0c0c0]">{item.name}</td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-[#1f1f1f] rounded-full h-1.5 mr-2">
                        <div 
                          className="h-1.5 rounded-full bg-gradient-to-r from-[#f4d03f] to-[#d4af37]"
                          style={{ width: `${(item.score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-[#d4af37]">{item.score.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-3 text-[#808080]">{item.analysis}</td>
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