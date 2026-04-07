import type { Context } from 'hono';

/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * 格式化成功响应
 * @param data 响应数据
 * @param message 响应信息
 */
export function success<T>(data: T = null as any, message: string = '操作成功'): ApiResponse<T> {
  return {
    code: 0,
    data,
    message,
  };
}

/**
 * 格式化错误响应
 * @param message 错误信息
 * @param code 错误码
 */
export function fail(message: string = '操作失败', code: number = 500): ApiResponse {
  return {
    code,
    data: null,
    message,
  };
}
