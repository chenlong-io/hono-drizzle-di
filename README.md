# Hono Drizzle DI Template

一个基于 **Hono** + **Drizzle ORM** + **tsyringe** 构建的现代化、高性能、高可用的 Node.js 后端模板项目。

[![Tech Stack](https://img.shields.io/badge/Stack-Hono%20%7C%20Drizzle%20%7C%20tsyringe%20%7C%20Zod-blue)](https://github.com/chenlong-io/hono-drizzle-di)

## 🌟 项目亮点 (Highlights)

-   🚀 **高性能**: 基于 [Hono](https://hono.dev/)，可能是目前最快的 Node.js Web 框架。
-   💉 **依赖注入 (DI)**: 使用 `tsyringe` 实现类 NestJS 的开发体验，解耦业务逻辑。
-   🛡️ **默认安全 (Secure by Default)**: 全局 JWT 鉴权中间件 + 白名单机制，确保接口安全。
-   📐 **规范化架构**: 严格的 `Controller -> Service -> Model -> DTO` 分层架构，高内聚低耦合。
-   ✅ **强类型校验**: 环境变量与接口请求均使用 `Zod` 进行严格校验。
-   🔗 **现代化工具链**: 完全支持 ESM，内置路径别名 (`@/*`)，支持优雅停机 (Graceful Shutdown)。

## 🛠️ 技术栈 (Tech Stack)

-   **Framework**: [Hono](https://hono.dev/)
-   **Runtime**: [Node.js](https://nodejs.org/) (ESM)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Database**: MySQL (via `mysql2`)
-   **DI Container**: [tsyringe](https://github.com/microsoft/tsyringe)
-   **Validation**: [Zod](https://zod.dev/)
-   **Development**: [tsx](https://github.com/privatenumber/tsx), [tsc-alias](https://github.com/justkey007/tsc-alias)

## 📂 目录结构 (Project Structure)

```text
src/
├── config/             # 配置管理 (环境变量、常量)
├── core/               # 核心层 (中间件、异常处理、工具类)
│   ├── middleware/     # 全局中间件 (鉴权、日志)
│   ├── exceptions.ts   # 统一异常定义
│   ├── jwt.ts          # JWT 工具类
│   └── response.ts     # 统一响应封装
├── db/                 # 数据库层 (连接池、Schema 定义)
├── modules/            # 业务模块 (按功能拆分)
│   └── auth/           # 认证模块示例
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.model.ts
│       ├── auth.dto.ts
│       └── auth.module.ts
├── app.ts              # 应用实例与中间件挂载
└── index.ts            # 入口文件 (服务器启动与优雅停机)
```

## 🚀 快速开始 (Quick Start)

### 1. 环境准备
确保你已安装 Node.js (>= 20) 和 pnpm。

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量
复制 `.env.development` 为 `.env` 并填写你的配置：
```bash
cp .env.development .env
```

### 4. 数据库迁移 (Drizzle)
```bash
# 生成并运行迁移 (请确保 MySQL 已启动)
pnpm drizzle-kit push
```

### 5. 启动开发服务器
```bash
pnpm dev
```

### 6. 生产构建
```bash
pnpm build
pnpm start
```

## 🔒 鉴权说明 (Auth)

项目采用 **默认拦截** 策略。所有新增路由均默认受到 JWT 保护。
如果需要公开某个接口，请在 `src/config/common.ts` 的 `whiteList` 中添加对应的路径。

## 📜 开源协议

MIT
