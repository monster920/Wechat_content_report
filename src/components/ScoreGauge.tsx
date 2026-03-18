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
    <div className="flex flex-col items-center justify-center p-6 bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a]">
      {/* 圆形仪表盘 */}
      <div className="relative w-28 h-28 mb-4">
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
            stroke="#2a2a2a"
            strokeWidth="8"
          />
          {/* 分数圆环 - 金色渐变 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.83} 283`}
          />
          {/* 金色渐变定义 */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f4d03f" />
              <stop offset="100%" stopColor="#d4af37" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* 分数显示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#d4af37]">
              {score.toFixed(1)}
            </div>
            <div className="text-xs text-[#6b6b6b]">/ 10.0</div>
          </div>
        </div>
      </div>

      {/* 评级标签 */}
      <div className="px-4 py-1.5 bg-gradient-to-r from-[#f4d03f] to-[#d4af37] text-[#0a0a0a] rounded-full text-sm font-bold mb-3">
        {level}
      </div>

      {/* 评价短语 */}
      <div className="text-sm text-[#a0a0a0] text-center">
        {evaluationPhrase}
      </div>

      {/* 权重说明 */}
      <div className="text-xs text-[#6b6b6b] mt-2">
        加权计算
      </div>
    </div>
  );
};

export default ScoreGauge;