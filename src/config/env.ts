import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// 根据 NODE_ENV 加载对应的 .env 文件
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });
// 同时加载默认的 .env 作为兜底
dotenv.config();

/**
 * 环境变量校验 Schema
 */
const envSchema = z.object({
  PORT: z.string().transform(Number).default(3333),
  DATABASE_URL: z.url({ message: 'DATABASE_URL 必须是一个有效的 URL' }),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET 至少需要 32 位以保证安全'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ 环境参数校验失败:', JSON.stringify(z.treeifyError(parsedEnv.error), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;
