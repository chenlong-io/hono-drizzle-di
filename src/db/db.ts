import { drizzle } from 'drizzle-orm/mysql2';
import { singleton } from 'tsyringe';
import { env } from '@/config/env.js';

/**
 * 数据库连接 Provider
 * 使用 tsyringe 管理单例，实现依赖注入
 */
@singleton()
export class DatabaseProvider {
  public readonly db;

  constructor() {
    this.db = drizzle({
      connection: {
        uri: env.DATABASE_URL,
      },
    });
    console.log('✅ Database connected');
  }
}

// 为了方便直接使用，也导出一个直接的 db 实例（可选）
// 但在 Service 中建议通过构造函数注入 DatabaseProvider
