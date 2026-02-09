# Change: 创建可复用的GitHub Actions通知workflow

## Why

当前组织内缺乏统一的通知机制，各仓库需要重复实现类似的通知功能，导致维护成本高且通知方式不一致。需要一个可复用的 workflow 仓库来提供统一的通知、告警和事件触发能力。

## What Changes

- 创建可被其他仓库调用的 reusable workflow（使用 `uses:` 语法）
- 定义标准化的输入输出参数接口
- 实现飞书 Webhook 通知方式作为默认通知渠道
- 提供可扩展设计，便于后续添加其他通知渠道（钉钉、企业微信等）

## Impact

- Affected specs: `github-actions-notification` (new capability)
- Affected code:
  - `.github/workflows/notify.yml` - 可复用 workflow 定义
  - `src/feishu.ts` - 飞书 Webhook 实现
  - `src/types.ts` - TypeScript 类型定义
  - `src/index.ts` - 主入口 (ESM)
  - `package.json` - 项目配置
  - `tsconfig.json` - ESM 配置
  - `README.md` - 使用文档

## Usage Example

其他仓库可通过以下方式调用：

```yaml
jobs:
  notify:
    uses: newbe36524/haginotifier/.github/workflows/notify.yml@main
    with:
      message: '部署成功！'
      msg_type: 'text'
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```
