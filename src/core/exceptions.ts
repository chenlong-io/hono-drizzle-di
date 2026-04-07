import type { Context } from 'hono';

/**
 * 业务异常基类
 */
export class AppException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: number = 500,
    public readonly httpStatus: number = 200 // 默认返回 200，前端凭 code 判断
  ) {
    super(message);
    this.name = 'AppException';
  }
}

/**
 * 参数错误
 */
export class ValidationException extends AppException {
  constructor(message: string = '参数错误') {
    super(message, 400, 400);
  }
}

/**
 * 未授权异常
 */
export class UnauthorizedException extends AppException {
  constructor(message: string = '未授权访问') {
    super(message, 401, 401);
  }
}

/**
 * 业务逻辑异常
 */
export class BusinessException extends AppException {
  constructor(message: string, code: number = 1000) {
    super(message, code, 200);
  }
}
