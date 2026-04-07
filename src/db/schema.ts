import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

/**
 * 用户表 (users)
 * 存储系统用户信息，包括用户名、密码哈希和角色。
 */
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(), // 用户名，必须唯一
  passwordHash: varchar('password_hash', { length: 255 }).notNull(), // 加密后的密码
  role: mysqlEnum('role', ['admin', 'user']).notNull().default('user'), // 用户角色：管理员或普通用户
  createdAt: timestamp('created_at').defaultNow(), // 创建时间
  updatedAt: timestamp('updated_at').onUpdateNow(), // 更新时间
});
