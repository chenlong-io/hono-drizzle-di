import { singleton, inject } from 'tsyringe';
import { DatabaseProvider } from '@/db/db.js';
import { users } from '@/db/schema.js';
import { eq } from 'drizzle-orm';
import type { RegisterDto } from './auth.dto.js';

/**
 * 认证模型类 (Data Access Layer)
 * 负责与数据库进行交互
 */
@singleton()
export class AuthModel {
  constructor(
    @inject(DatabaseProvider) private readonly dbProvider: DatabaseProvider
  ) {}

  private get db() {
    return this.dbProvider.db;
  }

  /**
   * 按用户名查找用户
   */
  async findUserByUsername(username: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user;
  }

  /**
   * 创建用户
   */
  async createUser(dto: RegisterDto & { passwordHash: string }) {
    return await this.db.insert(users).values({
      username: dto.username,
      passwordHash: dto.passwordHash,
      role: 'user',
    });
  }
}
