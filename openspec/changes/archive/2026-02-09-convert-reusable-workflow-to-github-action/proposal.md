# Change: Convert Reusable Workflow to GitHub Action

## Why

The current reusable workflow implementation has several limitations that impact user experience and maintainability:

1. **Runtime overhead**: Every execution requires checking out the entire repository, setting up Node.js, and installing tsx globally
2. **Distribution limitations**: Users cannot reference the action using standard GitHub Actions versioning patterns (e.g., `@v1`)
3. **Non-standard pattern**: The reusable workflow approach diverges from GitHub Actions ecosystem conventions for distributable actions
4. **Client-side complexity**: Consuming repositories must use the verbose workflow-specific syntax

Converting to a proper GitHub Action will align with ecosystem standards, improve performance, and simplify the user experience.

## What Changes

- **BREAKING**: Replace `.github/workflows/notify.yml` reusable workflow with `action.yml` composite action
- Add TypeScript compilation step to build `dist/index.js` from `src/` sources
- Update action invocation syntax from `uses: ./.github/workflows/notify.yml@main` to `uses: HagiCode-org/haginotifier@v1`
- Remove runtime dependency on `tsx` - action will use pre-compiled JavaScript
- Add CI/CD workflow for automated building and publishing
- Update all documentation with new usage patterns

## Migration Path

Users must update their workflow configurations:

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

## Impact

- **Affected specs**: `feishu-notification` (new capability)
- **Affected code**:
  - `src/feishu.ts` - may need modifications for action context
  - `src/index.ts` - may need new entry point for action execution
  - `.github/workflows/notify.yml` - will be deprecated/removed
  - `.github/workflows/test-notify.yml` - needs update to use new action syntax
  - `package.json` - will need build scripts and dependencies
  - `tsconfig.json` - may need updates for build output
  - `README.md` - requires comprehensive update for new usage

## Benefits

### User Experience
- Cleaner, more intuitive action invocation syntax
- Standard version pinning via Git tags (`@v1`, `@v1.0.0`)
- No need to consume repository to access workflow files

### Performance
- Faster execution: no checkout, no tsx installation
- Direct execution of compiled JavaScript code

### Maintainability
- Follows GitHub Actions best practices
- Better alignment with ecosystem patterns
- Easier to add features like branding metadata

## Risks

- **Breaking change**: All existing users must update their workflow configurations
- **Transition period**: Need to maintain backward compatibility or provide clear migration guidance
- **Build complexity**: Addition of build step requires CI/CD pipeline changes
