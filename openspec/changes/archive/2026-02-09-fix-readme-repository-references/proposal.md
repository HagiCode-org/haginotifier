# Change: 更新README中的仓库地址引用

## Why

README.md 中使用的仓库地址 `newbe36524/haginotifier` 与实际的 git 远程仓库地址 `HagiCode-org/haginotifier` 不一致，导致用户按照文档使用时会遇到仓库不存在的错误，降低项目的可用性和用户体验。

## What Changes

- 将 README.md 中所有的 `newbe36524/haginotifier` 引用替换为 `HagiCode-org/haginotifier`
- 更新位置包括：
  - 基本示例 (第 24 行)
  - 富文本消息示例 (第 38 行)
  - 交互式卡片消息示例 (第 54 行)
  - 使用输出示例 (第 70 行)
  - 集中式配置部分 (第 125 行)
  - 版本引用示例 (第 152 行)

## Impact

- Affected specs: `github-actions-notification`
- Affected code:
  - `README.md` - 使用文档中的仓库引用

## Status

**ExecutionCompleted**
