import { singleton, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';
import { BusinessException } from '@/core/exceptions.js';
import { JwtService } from '@/core/jwt.js';
import { AuthModel } from './auth.model.js';
import type { LoginDto, RegisterDto } from './auth.dto.js';

/**
 * 认证服务类
 * 处理业务逻辑：注册、登录、密码校验等
 */
@singleton()
export class AuthService {
  constructor(
    @inject(AuthModel) private readonly authModel: AuthModel,
    @inject(JwtService) private readonly jwtService: JwtService
  ) {}

  /**
   * 注册新用户
   * @param dto 注册数据
   */
  async register(dto: RegisterDto) {
    // 检查用户是否已存在
    const existingUser = await this.authModel.findUserByUsername(dto.username);

    if (existingUser) {
      throw new BusinessException('用户名已存在', 1001);
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 存入数据库
    await this.authModel.createUser({
      ...dto,
      passwordHash,
    });

    return { username: dto.username };
  }

  /**
   * 用户登录
   * @param dto 登录数据
   */
  async login(dto: LoginDto) {
    // 查找用户
    const user = await this.authModel.findUserByUsername(dto.username);

    if (!user) {
      throw new BusinessException('用户名或密码错误', 1002);
    }

    // 校验密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BusinessException('用户名或密码错误', 1002);
    }

    // 签发 Token
    const token = await this.jwtService.generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }
}
