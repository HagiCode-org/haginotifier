# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-02-09

### Added
- GitHub Composite Action (`action.yml`) for Feishu notifications
- Action mode support in `runCli()` to prevent action failures when notifications fail
- `tsx` as runtime dependency for direct TypeScript execution

### Changed
- **BREAKING**: Converted from reusable workflow to composite action
- **BREAKING**: Updated usage syntax from `uses: ./.github/workflows/notify.yml@main` to `uses: HagiCode-org/haginotifier@v1`
- Secrets are now passed via `env:` instead of `secrets:` in workflow syntax
- Outputs are accessed via `steps.<step-id>.outputs.*` instead of `needs.<job-id>.outputs.*`

### Removed
- Deprecated `.github/workflows/notify.yml` reusable workflow

### Migration Guide

If you were using the old reusable workflow syntax, update your workflows:

**Old syntax:**
```yaml
jobs:
  notify:
    uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main
    with:
      message: 'Deployment successful!'
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

**New syntax:**
```yaml
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: HagiCode-org/haginotifier@v1
        with:
          message: 'Deployment successful!'
        env:
          FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

See README.md for more details and examples.
