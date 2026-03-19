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
    <div className="card-primary p-5 fade-in">
      {/* 核心优势 */}
      <div className="mb-5">
        <div className="flex items-center mb-3">
          <span className="mr-2">💪</span>
          <h3 className="text-sm font-semibold text-primary">核心优势</h3>
        </div>
        <div className="space-y-2">
          {suggestions.strengths.map((strength, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-tertiary rounded-lg border border-light"
            >
              <input
                type="checkbox"
                checked={strength.completed}
                onChange={() => onToggleAction(`strength-${index}`)}
                className="mt-0.5 h-4 w-4 text-primary rounded border-primary"
              />
              <div className="flex-1">
                <p className="text-xs text-secondary">{strength.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关键短板 */}
      <div className="mb-5">
        <div className="flex items-center mb-3">
          <span className="mr-2">⚠️</span>
          <h3 className="text-sm font-semibold text-primary">关键短板</h3>
        </div>
        <div className="space-y-2">
          {suggestions.weaknesses.map((weakness, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-tertiary rounded-lg border border-light"
            >
              <input
                type="checkbox"
                checked={weakness.completed}
                onChange={() => onToggleAction(`weakness-${index}`)}
                className="mt-0.5 h-4 w-4 text-primary rounded border-primary"
              />
              <div className="flex-1">
                <p className="text-xs text-secondary">{weakness.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 可执行建议清单 */}
      <div>
        <div className="flex items-center mb-3">
          <span className="mr-2">🎯</span>
          <h3 className="text-sm font-semibold text-primary">立即优化建议</h3>
        </div>
        <div className="space-y-3">
          {suggestions.actions.map((action, index) => {
            const actionId = getActionId(action.category, index);
            const isCompleted = completedActions.includes(actionId);
            
            return (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  isCompleted 
                    ? 'bg-secondary border-primary' 
                    : 'bg-tertiary border-light'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-primary text-sm">
                      {action.category === 'structure' ? '📅' : 
                       action.category === 'title' ? '📝' : '🔄'}
                    </span>
                    <span className="text-xs text-muted">
                      预计耗时：{action.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-[10px] px-2 py-1 bg-tertiary text-primary rounded hover:bg-secondary transition-colors border border-light"
                      onClick={() => navigator.clipboard.writeText(action.text)}
                    >
                      复制
                    </button>
                    {action.category === 'title' && (
                      <button className="text-[10px] px-2 py-1 bg-tertiary text-primary rounded hover:bg-secondary transition-colors border border-light">
                        应用
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-secondary mb-2">{action.text}</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleAction(actionId)}
                    className="h-4 w-4 text-primary rounded border-primary"
                  />
                  <span className="text-[10px] text-muted">
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