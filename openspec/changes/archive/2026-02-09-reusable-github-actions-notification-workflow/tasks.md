## 1. Project Setup

- [x] 1.1 Create `package.json` with `"type": "module"` for ESM support
- [x] 1.2 Create `tsconfig.json` with `"module": "nodenext"` configuration
- [x] 1.3 Add TypeScript and Node.js type definitions as dependencies
- [x] 1.4 Add build script to compile TypeScript to JavaScript

## 2. Type Definitions

- [x] 2.1 Create `src/types.ts` with input parameters interface
- [x] 2.2 Define output parameters interface
- [x] 2.3 Define Feishu webhook payload interface (text, post, interactive)
- [x] 2.4 Export all types for use in other modules

## 3. Feishu Webhook Implementation

- [x] 3.1 Create `src/feishu.ts` with `sendNotification` function
- [x] 3.2 Implement text message payload construction
- [x] 3.3 Implement post (rich text) message payload construction
- [x] 3.4 Add HTTP request handling using `fetch` API (Node.js 18+)
- [x] 3.5 Implement error handling and response parsing
- [x] 3.6 Return standardized output (status, timestamp, response)

## 4. Main Entry Point

- [x] 4.1 Create `src/index.ts` as the main ESM entry point
- [x] 4.2 Export Feishu notification function
- [x] 4.3 Export type definitions
- [x] 4.4 Add CLI interface for standalone execution (optional)

## 5. GitHub Actions Workflow

- [x] 5.1 Create `.github/workflows/notify.yml` as a reusable workflow
- [x] 5.2 Define input parameters matching the spec
- [x] 5.3 Define output parameters (status, timestamp, response)
- [x] 5.4 Add workflow steps to:
  - Checkout repository
  - Setup Node.js
  - Install dependencies
  - Run notification script with inputs
  - Set outputs from script result
- [x] 5.5 Add permission constraints for security

## 6. Documentation

- [x] 6.1 Create `README.md` with project overview
- [x] 6.2 Add usage examples for calling repositories
- [x] 6.3 Document input/output parameters
- [x] 6.4 Add setup instructions for contributors
- [x] 6.5 Document extensibility pattern for adding new providers

## 7. Testing

- [ ] 7.1 Add sample calling workflow in `.github/workflows/`
- [ ] 7.2 Test with valid Feishu webhook URL (text message)
- [ ] 7.3 Test with post (rich text) message type
- [ ] 7.4 Test with missing required parameters
- [ ] 7.5 Test error handling with invalid webhook URL
- [ ] 7.6 Verify output parameters are correctly set
- [ ] 7.7 Verify reusable workflow is callable from external repositories

## 8. Build and Release

- [x] 8.1 Ensure TypeScript compiles without errors
- [x] 8.2 Add `.gitignore` for `node_modules` and build artifacts
- [ ] 8.3 Verify workflow is callable from external repositories
- [ ] 8.4 Tag and release version 1.0.0
