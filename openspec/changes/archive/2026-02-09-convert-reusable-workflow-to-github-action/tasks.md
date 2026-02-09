# Implementation Tasks

## 1. Project Configuration

- [ ] 1.1 Update `tsconfig.json` to configure `outDir` for compiled output (`dist/`)
- [ ] 1.2 Add build script to `package.json` for TypeScript compilation
- [ ] 1.3 Add `prepublishOnly` script to ensure builds before publishing
- [ ] 1.4 Update `package.json` with proper action metadata (if needed for npm publishing)

## 2. Build Infrastructure

- [ ] 2.1 Create `.github/workflows/build.yml` for CI/CD pipeline
- [ ] 2.2 Configure build workflow to run on push to main and on tag creation
- [ ] 2.3 Add automated compilation step in CI workflow
- [ ] 2.4 Add validation step to ensure `dist/index.js` is present

## 3. Action Definition

- [ ] 3.1 Create `action.yml` with composite action definition
- [ ] 3.2 Define inputs: `message`, `msg_type`, `title`
- [ ] 3.3 Define outputs: `status`, `timestamp`, `response`
- [ ] 3.4 Add branding metadata (icon, color)
- [ ] 3.5 Configure action to run with `runs: using: 'composite'`

## 4. Core Implementation

- [ ] 4.1 Update `src/index.ts` to export action-compatible entry point
- [ ] 4.2 Create or update `src/action.ts` for GitHub Actions execution context
- [ ] 4.3 Ensure `runCli()` function properly handles action environment variables
- [ ] 4.4 Add GITHUB_OUTPUT support for setting action outputs
- [ ] 4.5 Test compiled output with `node dist/index.js`

## 5. Action Steps

- [ ] 5.1 Add `actions/setup-node@v4` step for Node.js runtime
- [ ] 5.2 Configure npm install for runtime dependencies
- [ ] 5.3 Add execution step for compiled JavaScript
- [ ] 5.4 Add output parsing step for status, timestamp, response

## 6. Documentation

- [ ] 6.1 Update `README.md` with new action usage syntax
- [ ] 6.2 Add migration guide section for existing users
- [ ] 6.3 Create example workflows showing new syntax
- [ ] 6.4 Update input/output documentation tables
- [ ] 6.5 Add versioning documentation (tag-based releases)

## 7. Testing

- [ ] 7.1 Test action locally with `act` (if available)
- [ ] 7.2 Create test workflow in repository using new action syntax
- [ ] 7.3 Verify all three message types (text, post, interactive) work correctly
- [ ] 7.4 Verify output parameters are correctly passed to subsequent steps
- [ ] 7.5 Test with both organization-level and repository-level secrets

## 8. Release Preparation

- [ ] 8.1 Create first release tag (v1.0.0)
- [ ] 8.2 Verify build workflow creates and publishes artifacts
- [ ] 8.3 Test action invocation with version tag syntax
- [ ] 8.4 Add CHANGELOG.md for release notes

## 9. Backward Compatibility (Optional)

- [ ] 9.1 Update `.github/workflows/test-notify.yml` to use new action syntax
- [ ] 9.2 Modify test workflow to use action step instead of reusable workflow call
- [ ] 9.3 Update show-result job to work with action-level outputs
- [ ] 9.4 Decide whether to deprecate or remove old workflow file
- [ ] 9.5 Add deprecation notice to old workflow if keeping it
- [ ] 9.6 Document transition period for existing users

## 10. Validation

- [ ] 10.1 Run `openspec validate convert-reusable-workflow-to-github-action --strict`
- [ ] 10.2 Verify all spec deltas are properly formatted
- [ ] 10.3 Ensure at least one scenario per requirement
