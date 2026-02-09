## ADDED Requirements

### Requirement: Reusable Workflow Interface

The system SHALL provide a reusable GitHub Actions workflow (using `uses:` syntax) that accepts standardized input parameters and returns output parameters for notification delivery.

#### Scenario: Successful workflow invocation with required parameters

- **WHEN** a calling repository invokes the workflow with `message` parameter and `FEISHU_WEBHOOK_URL` secret
- **THEN** the workflow executes successfully and processes the notification request

#### Scenario: Workflow invocation with optional parameters

- **WHEN** a calling repository provides optional parameters (`msg_type`, `title`)
- **THEN** the workflow uses the provided values or falls back to defaults (text message)

#### Scenario: Missing required parameter

- **WHEN** a calling repository omits the `message` parameter or `FEISHU_WEBHOOK_URL` secret
- **THEN** the workflow validation fails with a clear error message

### Requirement: Input Parameters

The workflow SHALL accept the following input parameters:

- `message` (required): Notification message content
- `msg_type` (optional): Message type, defaults to "text". Options: "text", "post", "interactive"
- `title` (optional): Message title for post/interactive messages

#### Scenario: Text message with minimal parameters

- **WHEN** `msg_type` is "text" (or omitted) and only `message` is provided
- **THEN** the workflow sends a simple text message to Feishu

#### Scenario: Rich text message

- **WHEN** `msg_type` is "post"
- **THEN** the workflow sends a rich text message with optional title

#### Scenario: Interactive card message

- **WHEN** `msg_type` is "interactive"
- **THEN** the workflow sends an interactive card message

### Requirement: Secret Configuration

The workflow SHALL accept the webhook URL via a secret parameter to centralize configuration and enhance security.

- `FEISHU_WEBHOOK_URL` (required): Feishu Webhook URL for sending notifications, passed as a secret

#### Scenario: Centralized webhook configuration

- **WHEN** the webhook URL is configured in the haginotifier repository
- **THEN** consuming repositories can reuse the workflow by passing their own `FEISHU_WEBHOOK_URL` secret

#### Scenario: Per-repository webhook configuration

- **WHEN** each consuming repository has its own `FEISHU_WEBHOOK_URL` secret
- **THEN** each repository can send notifications to different Feishu webhooks

### Requirement: Output Parameters

The workflow SHALL return the following output parameters:

- `status`: Notification delivery status (success/failure)
- `timestamp`: ISO 8601 timestamp of notification send attempt
- `response`: Webhook response content or error message

#### Scenario: Successful notification delivery

- **WHEN** the webhook request succeeds
- **THEN** outputs include `status: success`, valid `timestamp`, and webhook `response`

#### Scenario: Failed notification delivery

- **WHEN** the webhook request fails
- **THEN** outputs include `status: failure`, valid `timestamp`, and error details in `response`

### Requirement: Feishu Webhook Notification

The system SHALL send notifications to Feishu using the Webhook API with properly formatted JSON payloads.

#### Scenario: Text message delivery

- **WHEN** sending a text message
- **THEN** the payload includes `msg_type: "text"` and `content` with the message text

#### Scenario: Post (rich text) message delivery

- **WHEN** sending a rich text message
- **THEN** the payload includes `msg_type: "post"` with structured content

#### Scenario: Webhook request failure

- **WHEN** the webhook URL is invalid or the Feishu service is unavailable
- **THEN** the workflow catches the error and returns failure status with error details

### Requirement: ESM Module Configuration

The TypeScript code SHALL use ESM (ECMAScript Modules) with proper configuration for Node.js execution.

#### Scenario: Module imports

- **WHEN** importing modules within the codebase
- **THEN** imports use `.js` file extensions as required by Node.js ESM

#### Scenario: Package configuration

- **WHEN** `package.json` is configured
- **THEN** it includes `"type": "module"` to enable ESM mode

#### Scenario: TypeScript compilation

- **WHEN** TypeScript compiles the source code
- **THEN** `tsconfig.json` is configured with `"module": "node16"` or `"nodenext"`

### Requirement: Reusable Workflow Invocation

The workflow SHALL be invocable from external repositories using the standard `uses:` syntax.

#### Scenario: External repository invocation

- **WHEN** an external repository uses `uses: newbe36524/haginotifier/.github/workflows/notify.yml@main`
- **THEN** the workflow executes with the provided inputs and returns outputs

#### Scenario: Version pinning

- **WHEN** a caller specifies a specific version tag (e.g., `@v1.0.0`)
- **THEN** the workflow uses the version from that tag
