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
    <div className="flex flex-col items-center justify-center p-6 bg-black/30 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
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
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="8"
          />
          {/* 分数圆环 - 紫蓝渐变 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#purpleCyanGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.83} 283`}
            className="drop-shadow-lg"
          />
          {/* 紫蓝渐变定义 */}
          <defs>
            <linearGradient id="purpleCyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* 分数显示 - 霓虹灯效果 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text text-neon">
              {score.toFixed(1)}
            </div>
            <div className="text-xs text-[#64748b]">/ 10.0</div>
          </div>
        </div>
      </div>

      {/* 评级标签 - 霓虹灯效果 */}
      <div className="px-5 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full text-sm font-bold mb-3 shadow-lg shadow-purple-500/30">
        {level}
      </div>

      {/* 评价短语 */}
      <div className="text-sm text-[#94a3b8] text-center">
        {evaluationPhrase}
      </div>

      {/* 权重说明 */}
      <div className="text-xs text-[#64748b] mt-2">
        加权计算
      </div>
    </div>
  );
};

export default ScoreGauge;