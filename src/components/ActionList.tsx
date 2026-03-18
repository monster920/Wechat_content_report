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
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-8 fade-in">
      {/* 核心优势 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="mr-3">💪</span>
          <h3 className="text-lg font-semibold text-[#d4af37]">核心优势</h3>
        </div>
        <div className="space-y-3">
          {suggestions.strengths.map((strength, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-4 bg-[#1f1f1f] rounded-xl border border-[#2a2a2a]"
            >
              <input
                type="checkbox"
                checked={strength.completed}
                onChange={() => onToggleAction(`strength-${index}`)}
                className="mt-1 h-5 w-5 text-[#d4af37] rounded border-[#3a3a3a] bg-[#1f1f1f]"
              />
              <div className="flex-1">
                <p className="text-sm text-[#c0c0c0]">{strength.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关键短板 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="mr-3">⚠️</span>
          <h3 className="text-lg font-semibold text-[#d4af37]">关键短板</h3>
        </div>
        <div className="space-y-3">
          {suggestions.weaknesses.map((weakness, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-4 bg-[#1f1f1f] rounded-xl border border-[#2a2a2a]"
            >
              <input
                type="checkbox"
                checked={weakness.completed}
                onChange={() => onToggleAction(`weakness-${index}`)}
                className="mt-1 h-5 w-5 text-[#d4af37] rounded border-[#3a3a3a] bg-[#1f1f1f]"
              />
              <div className="flex-1">
                <p className="text-sm text-[#c0c0c0]">{weakness.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 可执行建议清单 */}
      <div>
        <div className="flex items-center mb-4">
          <span className="mr-3">🎯</span>
          <h3 className="text-lg font-semibold text-[#d4af37]">立即优化建议</h3>
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
                    ? 'bg-[#1f1f1f] border-[#3a3a3a]' 
                    : 'bg-[#1a1a1a] border-[#2a2a2a]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#d4af37]">
                      {action.category === 'structure' ? '📅' : 
                       action.category === 'title' ? '📝' : '🔄'}
                    </span>
                    <span className="text-sm text-[#6b6b6b]">
                      预计耗时：{action.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-xs px-3 py-1.5 bg-[#2a2a2a] text-[#d4af37] rounded-lg hover:bg-[#3a3a3a] transition-colors"
                      onClick={() => navigator.clipboard.writeText(action.text)}
                    >
                      复制建议
                    </button>
                    {action.category === 'title' && (
                      <button className="text-xs px-3 py-1.5 bg-[#2a2a2a] text-[#d4af37] rounded-lg hover:bg-[#3a3a3a] transition-colors">
                        一键应用
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#a0a0a0] mb-3">{action.text}</p>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleAction(actionId)}
                    className="h-5 w-5 text-[#d4af37] rounded border-[#3a3a3a] bg-[#1f1f1f]"
                  />
                  <span className="text-xs text-[#6b6b6b]">
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