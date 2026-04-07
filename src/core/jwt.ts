import { sign, verify } from 'hono/jwt';
import { singleton } from 'tsyringe';
import { env } from '@/config/env.js';

export interface JwtPayload {
  id: number;
  username: string;
  role: string;
  exp?: number;
}

/**
 * JWT 工具类
 * 用于 Token 的签发与校验
 */
@singleton()
export class JwtService {
  private readonly secret = env.JWT_SECRET;

  /**
   * 签发 Token
   * @param payload 载荷
   * @param expiresIn 过期时间（秒），默认 1 天
   */
  async generateToken(payload: JwtPayload, expiresIn: number = 24 * 60 * 60) {
    const exp = Math.floor(Date.now() / 1000) + expiresIn;
    return await sign({ ...payload, exp }, this.secret);
  }

  /**
   * 校验 Token
   * @param token 
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    return (await verify(token, this.secret, 'HS256')) as unknown as JwtPayload;
  }
}
