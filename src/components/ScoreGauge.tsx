import React from 'react';

interface ScoreGaugeProps {
  score: number;
  level: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, level }) => {
  // 根据分数确定颜色
  const getScoreColor = (score: number): string => {
    if (score >= 9.0) return 'text-green-800 bg-green-100'; // 深绿色
    if (score >= 8.0) return 'text-green-700 bg-green-50';   // 绿色
    if (score >= 7.0) return 'text-blue-700 bg-blue-50';     // 蓝色
    if (score >= 6.0) return 'text-orange-700 bg-orange-50'; // 橙色
    return 'text-red-700 bg-red-50';                         // 红色
  };

  // 根据分数确定评价短语
  const getEvaluationPhrase = (score: number): string => {
    if (score >= 9.0) return '内容优秀，极具传播价值';
    if (score >= 8.0) return '内容良好，传播空间较大';
    if (score >= 7.0) return '内容扎实，传播空间较大';
    if (score >= 6.0) return '内容合格，需要优化';
    return '内容需要改进';
  };

  const scoreColorClass = getScoreColor(score);
  const evaluationPhrase = getEvaluationPhrase(score);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
      {/* 圆形仪表盘 */}
      <div className="relative w-24 h-24 mb-3">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* 背景圆环 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* 分数圆环 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.83} 283`}
            className={scoreColorClass.replace('text-', 'text-').replace(' bg-', ' ')}
          />
        </svg>
        
        {/* 分数显示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${scoreColorClass.split(' ')[0]}`}>
              {score.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">/ 10.0</div>
          </div>
        </div>
      </div>

      {/* 评级标签 */}
      <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${scoreColorClass}`}>
        {level}
      </div>

      {/* 评价短语 */}
      <div className="text-sm text-gray-600 text-center">
        {evaluationPhrase}
      </div>

      {/* 权重说明 */}
      <div className="text-xs text-gray-400 mt-1">
        加权计算
      </div>
    </div>
  );
};

export default ScoreGauge;