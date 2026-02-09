# Design: GitHub Actions 调用方式研究

## Context

用户提出了关于 GitHub Actions 调用方式的重要问题：
- 当前提案使用 `uses:` 语法，这通常是用于调用 composite actions 或 reusable workflows
- 需要确认使用 `uses:` (reusable workflow) 还是 `workflow_dispatch` (repository dispatch) 更合适

## Goals / Non-Goals

**Goals:**
- 选择最适合的 GitHub Actions 跨仓库调用方式
- 确保调用的简单性和可维护性
- 支持标准化输入输出参数

**Non-Goals:**
- 复杂的事件触发机制
- 需要消费者仓库进行复杂配置

## Decisions

### Decision 1: 使用 Reusable Workflow (`uses:`)

**选项对比:**

| 方式 | 语法 | 优点 | 缺点 |
|------|------|------|------|
| Reusable Workflow | `uses: owner/repo/.github/workflows/file.yml@ref` | 简单直接，支持输入输出，官方推荐 | 需要目标仓库是 public 或有访问权限 |
| Repository Dispatch | `uses: actions/github-script@v6` + api calls | 更灵活，可异步 | 复杂，需要 PAT token，无直接输出参数 |
| Workflow Dispatch | `uses: actions/github-script@v6` + api calls | 可手动触发 | 复杂，需要 PAT token，无直接输出参数 |

**选择: Reusable Workflow**

**理由:**
1. **简单性**: 使用者只需一行 `uses:` 配置即可调用
2. **输入输出**: 天然支持 `with:` 输入和输出参数，符合提案需求
3. **官方推荐**: GitHub 官方推荐的跨仓库 workflow 复用方式
4. **无需额外认证**: 不需要 PAT token，使用标准的 GITHUB_TOKEN
5. **同步执行**: 可以获取执行结果和输出

### Decision 2: 通知渠道改为飞书

**原计划:** Slack Webhook
**修改为:** 飞书 Webhook

**理由:**
- 用户明确要求使用飞书
- 飞书是字节跳动的企业协作平台，在国内广泛使用
- 飞书 Webhook API 稳定可靠

## Technical Design

### Reusable Workflow 调用架构

```mermaid
graph LR
    A[Consumer Repo] -->|uses:| B[Haginotifier Workflow]
    B -->|webhook| C[飞书]
    B -->|outputs| A
```

### 调用示例

**消费者仓库配置:**
```yaml
jobs:
  notify:
    uses: newbe36524/haginotifier/.github/workflows/notify.yml@main
    with:
      webhook_url: ${{ secrets.FEISHU_WEBHOOK_URL }}
      message: '部署成功！'
      msg_type: 'text'
    secrets: inherit  # 如果需要传递 secrets
```

### 飞书 Webhook API 格式

```typescript
// 文本消息
{
  "msg_type": "text",
  "content": {
    "text": "请求内容"
  }
}

// 富文本消息
{
  "msg_type": "post",
  "content": {
    "post": {
      "zh_cn": {
        "title": "标题",
        "content": [[{"tag": "text", "text": "内容"}]]
      }
    }
  }
}

// 卡片消息
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": {
        "content": "标题",
        "tag": "plain_text"
      }
    },
    "elements": [...]
  }
}
```

### 项目结构（更新后）

```
haginotifier/
├── .github/
│   └── workflows/
│       └── notify.yml         # 可复用 workflow 定义
├── src/
│   ├── feishu.ts              # 飞书 Webhook 实现
│   ├── types.ts               # TypeScript 类型定义
│   └── index.ts               # 主入口 (ESM)
├── package.json
├── tsconfig.json              # ESM 配置
└── README.md
```

## Risks / Trade-offs

### Reusable Workflow 限制

**限制 1: 位置要求**
- Reusable workflow 必须位于 `.github/workflows/` 目录
- 文件必须由目标仓库所有者直接拥有（不能来自 fork）

**缓解:** 将 workflow 放在正确的位置，并在文档中说明

**限制 2: 私有仓库访问**
- 如果仓库是私有的，调用者需要对该仓库有访问权限

**缓解:** 使用公共仓库或将此仓库添加到组织的允许列表

**限制 3: 嵌套限制**
- Reusable workflow 最多只能嵌套 4 层

**缓解:** 本项目不使用嵌套调用

## Migration Plan

从 Slack 迁移到飞书的步骤：
1. 更新输入参数（移除 Slack 特有的 `username`, `icon_emoji`）
2. 添加飞书特有参数（`msg_type`）
3. 实现 `feishu.ts` 替代 `slack.ts`
4. 更新文档和示例

## Open Questions

1. **消息格式支持**: 初版是否只支持文本消息，还是同时支持富文本和卡片？
   - 建议: 初版支持 text 和 post 两种类型
