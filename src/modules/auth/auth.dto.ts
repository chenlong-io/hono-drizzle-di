import { z } from 'zod';

/**
 * 注册请求校验 Schema
 */
export const RegisterSchema = z.object({
  username: z.string().min(3, '用户名至少 3 个字符').max(20, '用户名最多 20 个字符'),
  password: z.string().min(6, '密码至少 6 个字符'),
});

/**
 * 登录请求校验 Schema
 */
export const LoginSchema = z.object({
  username: z.string().nonempty('用户名不能为空'),
  password: z.string().nonempty('密码不能为空'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
