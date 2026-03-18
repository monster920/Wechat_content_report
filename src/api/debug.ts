// API调试工具
import type { ApiResponse } from '../types/index';

/**
 * 调试API响应数据
 */
export function debugApiResponse(apiData: ApiResponse): void {
  console.log('=== API响应调试 ===');
  console.log('完整API数据:', JSON.stringify(apiData, null, 2));
  
  // 检查数据结构
  const data = apiData.data || apiData;
  console.log('data对象:', data);
  
  const outputs = data.outputs || apiData.outputs || {};
  console.log('outputs对象:', outputs);
  
  // 检查是否有report字段
  if (outputs.report) {
    console.log('找到report字段，内容长度:', outputs.report.length);
    console.log('report前200字符:', outputs.report.substring(0, 200));
  } else {
    console.log('未找到report字段');
    console.log('outputs所有键:', Object.keys(outputs));
  }
  
  // 检查其他可能的字段
  console.log('检查其他字段:');
  console.log('- report_object:', (outputs as any).report_object);
  console.log('- weighted_score:', (outputs as any).weighted_score);
  console.log('- detailed_diagnosis:', (outputs as any).detailed_diagnosis);
}