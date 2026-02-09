# Project Context

## Purpose

haginotifier 是一个可重用的 GitHub Actions 工作流，用于向飞书（Feishu）发送通知。该项目为组织内所有仓库提供统一的通知机制，消除了在每个仓库中重复实现通知逻辑的需要。通过组织级别的密钥配置，可以实现一次配置、多仓库复用的便捷管理方式。

## Tech Stack

- **TypeScript 5.7.2** - 主要开发语言
- **Node.js 20+** - 运行时环境（ESM 模块）
- **GitHub Actions** - 复合 action 执行平台
- **飞书 Webhook API** - 通知发送接口
- **ESM (ES Modules)** - 模块系统（NodeNext）
- **tsx** - TypeScript 执行器（运行时直接执行 TS）

## Project Conventions

### Code Style

- **模块系统**：使用 ESM (`"type": "module"`)
- **TypeScript 配置**：NodeNext 模块解析，ES2022 目标
- **严格模式**：启用 `strict: true`
- **类型导出**：生成 `.d.ts` 声明文件
- **命名规范**：
  - 文件名：kebab-case（如 `feishu.ts`, `types.ts`）
  - 函数名：camelCase（如 `sendNotification`, `buildPayload`）
  - 类型名：PascalCase（如 `NotificationInput`, `FeishuWebhookPayload`）

### Architecture Patterns

- **单一职责**：每个模块专注一个功能领域
  - `feishu.ts` - 飞书 API 集成
  - `types.ts` - 类型定义
  - `index.ts` - 主入口和导出
- **函数式设计**：纯函数处理数据转换，副作用隔离在 I/O 操作中
- **错误处理**：统一的错误响应格式，返回结构化的 `NotificationOutput`
- **可扩展性**：设计支持添加其他通知提供商（钉钉、企业微信等）

### Testing Strategy

- **本地测试**：使用 `npx tsx src/feishu.ts` 直接执行 TypeScript 代码
- **环境变量测试**：通过环境变量配置 webhook URL 和消息内容
- **GitHub Actions 测试**：提供 `test-notify.yml` 手动测试工作流
- **输出验证**：检查 action 返回的 `status`、`timestamp` 和 `response` 参数

### Git Workflow

- **分支策略**：主要开发在 `main` 分支
- **提交规范**：
  - 使用简洁的英文提交消息
  - 示例：`update readme`, `feishu`, `update repo path`
- **版本管理**：使用 Git 标签标记版本（如 `v1.0.0`）
- **工作流引用**：推荐使用特定版本标签而非 `main` 分支（生产环境）

## Domain Context

### 飞书 Webhook 通知

飞书支持三种消息类型：

1. **text** - 纯文本消息
2. **post** - 富文本消息（支持标题）
3. **interactive** - 交互卡片消息（支持标题和卡片元素）

### 密钥配置策略

项目支持两种密钥配置方式：

1. **组织级别密钥**（推荐）：
   - 在组织级别配置一次
   - 通过访问设置控制可用仓库
   - 集中管理，易于维护

2. **仓库级别密钥**：
   - 每个仓库单独配置
   - 适用于个人账户或需要不同 webhook URL 的场景

### 工作流使用模式

使用 GitHub Actions 的复合 action 特性：
- Action 定义位于：`action.yml`
- 调用语法：`uses: HagiCode-org/haginotifier@v1`
- 输入参数：`message`, `msg_type`, `title`
- 密钥要求：`FEISHU_WEBHOOK_URL`（通过 `env:` 传递）
- 输出参数：`status`, `timestamp`, `response`（通过 `steps.<id>.outputs.*` 访问）

## Important Constraints

- **Node.js 版本**：要求 Node.js 20 或更高版本
- **飞书 API 限制**：遵循飞书 Webhook API 的速率限制和消息格式要求
- **密钥安全**：Webhook URL 必须存储为 GitHub Secrets，不得硬编码
- **ESM 兼容性**：所有导入必须使用 `.js` 扩展名（即使源文件是 `.ts`）
- **消息长度**：飞书对消息内容有长度限制，需确保消息内容符合要求

## External Dependencies

### 飞书服务
- **Webhook URL**：从飞书群聊设置中获取
- **自定义机器人**：需要在飞书群聊中添加自定义机器人
- **API 端点**：飞书提供的 Webhook URL

### GitHub 服务
- **GitHub Actions**：工作流执行平台
- **GitHub Secrets**：存储敏感配置信息
- **组织设置**：配置组织级别密钥

### 开发依赖
- `@types/node` ^22.10.2 - Node.js 类型定义
- `typescript` ^5.7.2 - TypeScript 编译器

## OpenSpec Development Guidelines

本项目使用 OpenSpec 进行规范驱动的开发。在创建变更提案时，请遵循以下指南：

### OpenSpec 工作流程

1. **创建变更**：当涉及新功能、破坏性变更、架构调整或重大性能/安全改进时创建提案
2. **实施变更**：按照提案和任务清单逐步实现
3. **归档变更**：部署后归档变更并更新规范

### 关键文档

- **[OpenSpec 代理指南](openspec/AGENTS.md)** - 完整的 OpenSpec 工作流程和最佳实践
- **[提案设计指南](openspec/PROPOSAL_DESIGN_GUIDELINES.md)** - UI 设计和代码流程图的标准格式

### 设计文档要求

当创建涉及以下内容的变更时，必须包含相应的可视化设计：

**UI 设计变更**：
- 使用 ASCII 艺术图展示界面原型
- 使用 Mermaid 时序图描述用户交互流程
- 标注所有界面状态（正常、悬停、禁用、错误）

**代码流程变更**：
- 使用 Mermaid 流程图描述数据流
- 使用 Mermaid 时序图描述 API 交互
- 使用 Mermaid 架构图描述系统变更
- 提供完整的代码变更表格（文件路径、变更类型、变更原因、影响范围）

详细的设计文档格式要求，请参考 `@/openspec/PROPOSAL_DESIGN_GUIDELINES.md`。

### 快速命令

```bash
openspec list                  # 列出活跃的变更
openspec list --specs          # 列出所有规范
openspec show [item]           # 显示变更或规范详情
openspec validate [item]       # 验证变更或规范
openspec archive <change-id>   # 归档已部署的变更
```

## Project Structure

```
haginotifier/
├── .github/
│   └── workflows/
│       └── test-notify.yml    # 手动测试工作流
├── src/
│   ├── feishu.ts              # 飞书 Webhook 实现
│   ├── types.ts               # TypeScript 类型定义
│   └── index.ts               # 主模块导出
├── openspec/
│   ├── project.md             # 项目上下文（本文件）
│   ├── AGENTS.md              # OpenSpec 代理指南
│   ├── PROPOSAL_DESIGN_GUIDELINES.md  # 提案设计指南
│   ├── specs/                 # 当前规范（已实现的功能）
│   └── changes/               # 变更提案
│       └── archive/           # 已归档的变更
├── action.yml                 # 复合 action 定义
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── CLAUDE.md                  # Claude Code 指令
├── CHANGELOG.md               # 版本变更记录
└── README.md                  # 项目文档
```

## 扩展性

项目设计支持轻松添加其他通知提供商：

1. 创建新模块（如 `src/dingtalk.ts`）
2. 实现类似的 `sendNotification` 函数
3. 在 `src/types.ts` 中添加提供商特定的类型
4. 从 `src/index.ts` 导出
5. 更新 `action.yml` 以接受 `provider` 输入参数

## 支持的通知提供商

当前支持：
- **飞书（Feishu/Lark）** - 完整支持

计划支持：
- 钉钉（DingTalk）
- 企业微信（WeCom）
- Slack
- Microsoft Teams

## 相关资源

- [飞书自定义机器人文档](https://open.feishu.cn/document/ukTMukTMukTM/uUTNz4SN1MjL1UzM)
- [GitHub Actions 复合 action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action)
- [GitHub Secrets 管理](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
