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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* 核心优势 */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <span className="text-green-600 mr-2">💪</span>
          <h3 className="text-lg font-semibold text-gray-900">核心优势</h3>
        </div>
        <div className="space-y-2">
          {suggestions.strengths.map((strength, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={strength.completed}
                onChange={() => onToggleAction(`strength-${index}`)}
                className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="text-sm text-green-800">{strength.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关键短板 */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <span className="text-orange-600 mr-2">⚠️</span>
          <h3 className="text-lg font-semibold text-gray-900">关键短板</h3>
        </div>
        <div className="space-y-2">
          {suggestions.weaknesses.map((weakness, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={weakness.completed}
                onChange={() => onToggleAction(`weakness-${index}`)}
                className="mt-1 h-4 w-4 text-orange-600 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="text-sm text-orange-800">{weakness.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 可执行建议清单 */}
      <div>
        <div className="flex items-center mb-3">
          <span className="text-blue-600 mr-2">🎯</span>
          <h3 className="text-lg font-semibold text-gray-900">立即优化建议</h3>
        </div>
        <div className="space-y-4">
          {suggestions.actions.map((action, index) => {
            const actionId = getActionId(action.category, index);
            const isCompleted = completedActions.includes(actionId);
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600 text-sm">
                      {action.category === 'structure' ? '📅' : 
                       action.category === 'title' ? '📝' : '🔄'}
                    </span>
                    <span className="text-sm text-gray-500">
                      预计耗时：{action.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      onClick={() => navigator.clipboard.writeText(action.text)}
                    >
                      复制建议
                    </button>
                    {action.category === 'title' && (
                      <button className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                        一键应用
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{action.text}</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleAction(actionId)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-500">
                    {isCompleted ? '已完成' : '标记为完成'}
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