import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', // 迁移内容存放的位置
  schema: './src/db/schema.ts', // 表结构定义文件，多个可以用数组
  dialect: 'mysql', // 数据库类型 "postgresql" | "mysql" | "sqlite" | "singlestore" | "gel"
  dbCredentials: {
    url: process.env.DATABASE_URL!, // 数据库连接方式 一般用 url 连接
  },
});
