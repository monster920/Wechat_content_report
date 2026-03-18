import { useEffect, useRef } from 'react';
import type { DimensionData } from '../types';

interface RadarChartProps {
  dimensions: DimensionData[];
}

// 简化的雷达图组件（使用CSS和SVG实现）
const RadarChart = ({ dimensions }: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // 计算统计数据
  const avgScore = dimensions.length > 0 
    ? dimensions.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length 
    : 0;
  const exceedPercent = Math.round((avgScore / 8.0) * 100);

  // 计算雷达图参数
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const numAxes = dimensions.length;
  const angleStep = (2 * Math.PI) / numAxes;

  // 生成雷达图路径
  const getRadarPath = () => {
    if (dimensions.length === 0) return '';
    
    return dimensions.map((dim, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = dim.score / 10;
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // 生成网格路径
  const getGridPaths = () => {
    const gridLevels = [0.25, 0.5, 0.75, 1];
    return gridLevels.map(level => {
      return dimensions.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + radius * level * Math.cos(angle);
        const y = centerY + radius * level * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
    });
  };

  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-8 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#d4af37]">维度能力分布图</h3>
      </div>
      
      {/* 雷达图容器 */}
      <div className="flex justify-center mb-6">
        <svg
          ref={svgRef}
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="max-w-full"
        >
          {/* 网格 */}
          {getGridPaths().map((path, index) => (
            <polygon
              key={index}
              points={path}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="1"
            />
          ))}
          
          {/* 数据区域 */}
          <polygon
            points={getRadarPath()}
            fill="rgba(212, 175, 55, 0.3)"
            stroke="#d4af37"
            strokeWidth="2"
          />
          
          {/* 数据点 */}
          {dimensions.map((dim, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const value = dim.score / 10;
            const x = centerX + radius * value * Math.cos(angle);
            const y = centerY + radius * value * Math.sin(angle);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill="#d4af37"
              />
            );
          })}
          
          {/* 轴标签 */}
          {dimensions.map((dim, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + (radius + 25) * Math.cos(angle);
            const y = centerY + (radius + 25) * Math.sin(angle);
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#a0a0a0"
              >
                {dim.name}
              </text>
            );
          })}
        </svg>
      </div>
      
      {/* 统计数据 */}
      <div className="text-center text-[#a0a0a0]">
        <p className="text-sm">
          超越 <span className="font-semibold text-[#d4af37]">{exceedPercent}%</span> 的同类型文章
        </p>
        {avgScore < 8.0 && (
          <p className="text-sm text-[#f4d03f] mt-2">
            💡 传播维度明显低于其他维度，建议重点优化
          </p>
        )}
      </div>
    </div>
  );
};

export default RadarChart;