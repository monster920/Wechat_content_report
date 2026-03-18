import React from 'react';
import type { SuggestionsData } from '../types';

interface ActionListProps {
  suggestions: SuggestionsData;
  completedActions: string[];
  onToggleAction: (actionId: string) => void;
}

const ActionList: React.FC<ActionListProps> = ({ suggestions, completedActions, onToggleAction }) => {
  // 生成唯一的action ID
  const getActionId = (category: string, index: number) => `${category}-${index}`;

  return (
    <div className="glass-card p-8 fade-in">
      {/* 核心优势 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="mr-3">💪</span>
          <h3 className="text-lg font-semibold gradient-text">核心优势</h3>
        </div>
        <div className="space-y-3">
          {suggestions.strengths.map((strength, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl border border-purple-500/20"
            >
              <input
                type="checkbox"
                checked={strength.completed}
                onChange={() => onToggleAction(`strength-${index}`)}
                className="mt-1 h-5 w-5 text-purple-500 rounded border-purple-500/30 bg-black/20"
              />
              <div className="flex-1">
                <p className="text-sm text-[#cbd5e1]">{strength.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关键短板 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="mr-3">⚠️</span>
          <h3 className="text-lg font-semibold gradient-text">关键短板</h3>
        </div>
        <div className="space-y-3">
          {suggestions.weaknesses.map((weakness, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl border border-orange-500/20"
            >
              <input
                type="checkbox"
                checked={weakness.completed}
                onChange={() => onToggleAction(`weakness-${index}`)}
                className="mt-1 h-5 w-5 text-orange-500 rounded border-orange-500/30 bg-black/20"
              />
              <div className="flex-1">
                <p className="text-sm text-[#cbd5e1]">{weakness.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 可执行建议清单 */}
      <div>
        <div className="flex items-center mb-4">
          <span className="mr-3">🎯</span>
          <h3 className="text-lg font-semibold gradient-text">立即优化建议</h3>
        </div>
        <div className="space-y-4">
          {suggestions.actions.map((action, index) => {
            const actionId = getActionId(action.category, index);
            const isCompleted = completedActions.includes(actionId);
            
            return (
              <div 
                key={index}
                className={`p-5 rounded-xl border ${
                  isCompleted 
                    ? 'bg-black/20 border-purple-500/30' 
                    : 'bg-black/30 border-purple-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-400">
                      {action.category === 'structure' ? '📅' : 
                       action.category === 'title' ? '📝' : '🔄'}
                    </span>
                    <span className="text-sm text-[#64748b]">
                      预计耗时：{action.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                      onClick={() => navigator.clipboard.writeText(action.text)}
                    >
                      复制建议
                    </button>
                    {action.category === 'title' && (
                      <button className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors border border-purple-500/30">
                        一键应用
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#94a3b8] mb-3">{action.text}</p>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleAction(actionId)}
                    className="h-5 w-5 text-purple-500 rounded border-purple-500/30 bg-black/20"
                  />
                  <span className="text-xs text-[#64748b]">
                    {isCompleted ? '✅ 已完成' : '⬜ 标记为完成'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActionList;