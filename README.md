# haginotifier

> Reusable GitHub Actions workflow for sending notifications to Feishu (飞书)

A simple, reusable GitHub Actions workflow that allows any repository to send notifications to Feishu via webhook. This provides a unified notification mechanism across your organization, eliminating the need to duplicate notification logic in each repository.

## Features

- **Reusable Workflow**: Call from any repository using standard `uses:` syntax
- **Multiple Message Types**: Support for text, rich text (post), and interactive card messages
- **Simple Configuration**: Just provide a webhook URL and message content
- **Standardized Output**: Returns status, timestamp, and response data for downstream processing
- **ESM Module**: Built with modern TypeScript and ESM for Node.js 18+

## Usage

### Basic Example

Send a simple text message:

```yaml
jobs:
  notify:
    uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main
    with:
      message: 'Deployment successful!'
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

### Rich Text Message

Send a rich text message with a title:

```yaml
jobs:
  notify:
    uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main
    with:
      message: 'The production deployment has been completed successfully.'
      msg_type: 'post'
      title: 'Deployment Notification'
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

### Interactive Card Message

Send an interactive card message:

```yaml
jobs:
  notify:
    uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main
    with:
      message: 'Build #123 completed in 5 minutes'
      msg_type: 'interactive'
      title: 'CI/CD Pipeline Status'
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

### Using Outputs

Access the notification result in subsequent steps:

```yaml
jobs:
  notify:
    uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main
    with:
      message: 'Test notification'
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
  check-result:
    needs: notify
    runs-on: ubuntu-latest
    steps:
      - name: Check notification status
        run: |
          echo "Status: ${{ needs.notify.outputs.status }}"
          echo "Timestamp: ${{ needs.notify.outputs.timestamp }}"
          echo "Response: ${{ needs.notify.outputs.response }}"
```

## Input Parameters

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `message` | Yes | string | Notification message content | - |
| `msg_type` | No | string | Message type: `text`, `post`, or `interactive` | `text` |
| `title` | No | string | Message title for post/interactive messages | - |

## Secrets

| Secret | Required | Description |
|--------|----------|-------------|
| `FEISHU_WEBHOOK_URL` | Yes | Feishu Webhook URL for sending notifications |

## Output Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Notification delivery status: `success` or `failure` |
| `timestamp` | string | ISO 8601 timestamp of notification send attempt |
| `response` | string | Webhook response content or error message |

## Setup

### Option 1: Centralized Configuration (Recommended)

Configure the webhook URL once in the haginotifier repository, and all consuming repositories can reuse it without managing their own webhook URL.

**In the haginotifier repository:**

1. Go to Settings > Secrets and variables > Actions
2. Create a new secret named `FEISHU_WEBHOOK_URL`
3. Paste your Feishu Webhook URL as the value

**In consuming repositories:**

```yaml
jobs:
  notify:
    uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main
    with:
      message: 'Your notification here'
    secrets:
      FEISHU_WEBHOOK_URL: ${{ secrets.FEISHU_WEBHOOK_URL }}
```

### Option 2: Per-Repository Configuration

Each repository manages its own webhook URL.

1. Go to Settings > Secrets and variables > Actions in your repository
2. Create a new secret named `FEISHU_WEBHOOK_URL`
3. Paste your Feishu Webhook URL as the value

### Creating a Feishu Webhook

1. Open your Feishu group chat
2. Go to Group Settings > Group Chat > Chatbots > Add Robot
3. Select "Custom Bot" and configure it
4. Copy the Webhook URL

### 3. Reference a Specific Version

For production use, pin to a specific version tag instead of `main`:

```yaml
uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@v1.0.0
```

## Development

### Prerequisites

- Node.js 18 or higher
- tsx (TypeScript executor)

### Local Testing

```bash
# Install dependencies
npm install

# Run locally with tsx
FEISHU_WEBHOOK_URL="your_webhook_url" FEISHU_MESSAGE="Test message" npx tsx src/feishu.ts
```

### Project Structure

```
haginotifier/
├── .github/
│   └── workflows/
│       ├── notify.yml         # Reusable workflow definition
│       └── test-notify.yml    # Manual test workflow
├── src/
│   ├── feishu.ts              # Feishu Webhook implementation
│   ├── types.ts               # TypeScript type definitions
│   └── index.ts               # Main entry point
├── package.json
├── tsconfig.json
└── README.md
```

### Testing

You can test the notification workflow directly from GitHub:

1. Go to Actions tab in the haginotifier repository
2. Select "Test Notification" workflow
3. Click "Run workflow"
4. Fill in the parameters:
   - **message**: Your test message content
   - **msg_type**: Choose "text", "post", or "interactive"
   - **title**: (Optional) Title for post/interactive messages
5. Click "Run workflow"

The test will send a notification and display the result in the workflow summary.

## Extensibility

The codebase is designed to be easily extended with additional notification providers. To add a new provider (e.g., DingTalk, WeCom):

1. Create a new module (e.g., `src/dingtalk.ts`)
2. Implement a similar `sendNotification` function
3. Add provider-specific types to `src/types.ts`
4. Export from `src/index.ts`
5. Update the workflow to accept a `provider` input parameter

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
