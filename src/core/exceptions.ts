import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * 业务异常基类 - 继承自 Hono 内置的 HTTPException
 */
export class AppException extends HTTPException {
  /**
   * @param message 错误消息
   * @param code 业务状态码 (默认为 http 状态码)
   * @param status HTTP 状态码 (默认 400)
   */
  constructor(
    public readonly message: string,
    public readonly code: number = 400,
    public readonly status: ContentfulStatusCode = 400
  ) {
    // 调用父类构造函数
    super(status, { message });
    this.name = 'AppException';
  }
}

/**
 * 参数校验错误 (400)
 */
export class ValidationException extends AppException {
  constructor(message: string = '参数验证失败') {
    super(message, 400, 400);
  }
}

/**
 * 身份验证错误 (401)
 */
export class UnauthorizedException extends AppException {
  constructor(message: string = '未授权访问') {
    super(message, 401, 401);
  }
}

/**
 * 业务逻辑异常 (默认 200)
 */
export class BusinessException extends AppException {
  constructor(message: string, code: number = 1000, status: ContentfulStatusCode = 200) {
    super(message, code, status);
  }
}
