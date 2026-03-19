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
    <div className="flex flex-col items-center justify-center p-4 bg-tertiary rounded-lg border border-light">
      {/* 圆形仪表盘 */}
      <div className="relative w-20 h-20 mb-3">
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
            strokeWidth="6"
          />
          {/* 分数圆环 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1e40af"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.83} 283`}
          />
        </svg>
        
        {/* 分数显示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {score.toFixed(1)}
            </div>
            <div className="text-[10px] text-muted">/ 10.0</div>
          </div>
        </div>
      </div>

      {/* 评级标签 */}
      <div className="px-3 py-1 bg-accent border border-accent text-primary rounded-full text-xs font-medium mb-2">
        {level}
      </div>

      {/* 评价短语 */}
      <div className="text-xs text-secondary text-center max-w-[120px]">
        {evaluationPhrase}
      </div>
    </div>
  );
};

export default ScoreGauge;