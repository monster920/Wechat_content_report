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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">维度对比雷达图</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          折叠
        </button>
      </div>
      
      {/* 雷达图容器 */}
      <div className="flex justify-center mb-4">
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
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          ))}
          
          {/* 数据区域 */}
          <polygon
            points={getRadarPath()}
            fill="rgba(24, 144, 255, 0.3)"
            stroke="#1890FF"
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
                r="4"
                fill="#1890FF"
              />
            );
          })}
          
          {/* 轴标签 */}
          {dimensions.map((dim, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + (radius + 20) * Math.cos(angle);
            const y = centerY + (radius + 20) * Math.sin(angle);
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#333"
              >
                {dim.name}
              </text>
            );
          })}
        </svg>
      </div>
      
      {/* 统计数据 */}
      <div className="text-center text-gray-600">
        <p className="text-sm">
          超越 <span className="font-semibold text-green-600">{exceedPercent}%</span> 的同类型文章
        </p>
        {avgScore < 8.0 && (
          <p className="text-sm text-orange-600 mt-1">
            传播维度明显低于其他维度，建议重点优化
          </p>
        )}
      </div>
    </div>
  );
};

export default RadarChart;