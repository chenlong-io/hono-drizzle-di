import { z } from 'zod';
import 'dotenv/config';

/**
 * 环境变量校验 Schema
 * 确保应用启动前，所有必需的配置都已正确设置
 */
const envSchema = z.object({
  // 服务端口
  PORT: z.string().transform(Number).default(3000),
  // 数据库连接地址
  DATABASE_URL: z.string().url('DATABASE_URL 必须是一个有效的 URL'),
  // JWT 密钥
  JWT_SECRET: z.string().min(32, 'JWT_SECRET 至少需要 32 位以保证安全'),
  // 环境
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// 解析并校验环境变量
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ 环境参数校验失败:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;
