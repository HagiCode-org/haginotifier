import type {
  NotificationInput,
  NotificationOutput,
  FeishuTextPayload,
  FeishuPostPayload,
  FeishuWebhookPayload,
  FeishuWebhookResponse,
} from "./types.js";

/**
 * Builds a Feishu webhook payload based on the message type
 *
 * @param input - Notification input parameters
 * @returns Formatted webhook payload
 */
function buildPayload(input: NotificationInput): FeishuWebhookPayload {
  const { message, msg_type = "text", title } = input;

  switch (msg_type) {
    case "text": {
      const textPayload: FeishuTextPayload = {
        msg_type: "text",
        content: {
          text: message,
        },
      };
      return textPayload;
    }

    case "post": {
      const postPayload: FeishuPostPayload = {
        msg_type: "post",
        content: {
          post: {
            zh_cn: {
              ...(title ? { title } : {}),
              content: [[{ tag: "text", text: message }]],
            },
          },
        },
      };
      return postPayload;
    }

    case "interactive": {
      // For interactive cards, we'll create a simple text card
      // More complex card structures can be built based on requirements
      return {
        msg_type: "interactive",
        card: {
          ...(title
            ? {
                header: {
                  title: {
                    content: title,
                    tag: "plain_text",
                  },
                },
              }
            : {}),
          elements: [
            {
              tag: "div",
              text: {
                content: message,
                tag: "plain_text",
              },
            },
          ],
        },
      };
    }

    default:
      // Default to text message for unknown types
      const defaultPayload: FeishuTextPayload = {
        msg_type: "text",
        content: {
          text: message,
        },
      };
      return defaultPayload;
  }
}

/**
 * Sends a notification to Feishu via webhook
 *
 * @param input - Notification input parameters
 * @returns Notification output with status, timestamp, and response
 */
export async function sendNotification(
  input: NotificationInput,
): Promise<NotificationOutput> {
  const { webhook_url } = input;
  const timestamp = new Date().toISOString();

  try {
    // Validate required parameters
    if (!webhook_url) {
      return {
        status: "failure",
        timestamp,
        response: "Missing required parameter: webhook_url",
      };
    }

    if (!input.message) {
      return {
        status: "failure",
        timestamp,
        response: "Missing required parameter: message",
      };
    }

    // Build the payload
    const payload = buildPayload(input);

    // Send the webhook request
    const response = await fetch(webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Parse the response
    let responseData: FeishuWebhookResponse;
    let responseText = "";

    try {
      responseText = await response.text();
      responseData = JSON.parse(responseText) as FeishuWebhookResponse;
    } catch {
      // If response is not JSON, use the raw text
      responseData = {};
      responseText = responseText || response.statusText;
    }

    // Check if the request was successful
    if (response.ok && (!responseData.code || responseData.code === 0)) {
      return {
        status: "success",
        timestamp,
        response: responseText || "Notification sent successfully",
      };
    }

    return {
      status: "failure",
      timestamp,
      response: `HTTP ${response.status}: ${responseText}`,
    };
  } catch (error) {
    // Handle network errors or other exceptions
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      status: "failure",
      timestamp,
      response: `Request failed: ${errorMessage}`,
    };
  }
}

/**
 * CLI interface for standalone execution
 * Reads environment variables for configuration
 *
 * Environment variables:
 * - FEISHU_WEBHOOK_URL: The webhook URL
 * - FEISHU_MESSAGE: The message content
 * - FEISHU_MSG_TYPE: Optional message type (default: text)
 * - FEISHU_TITLE: Optional title for post/interactive messages
 */
export async function runCli(): Promise<void> {
  const webhook_url = process.env.FEISHU_WEBHOOK_URL || "";
  const message = process.env.FEISHU_MESSAGE || "";
  const msg_type = (process.env.FEISHU_MSG_TYPE as "text" | "post" | "interactive") || "text";
  const title = process.env.FEISHU_TITLE;

  const result = await sendNotification({
    webhook_url,
    message,
    msg_type,
    title,
  });

  console.log(JSON.stringify(result, null, 2));

  if (result.status === "failure") {
    process.exit(1);
  }
}

// Allow running as a standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  runCli().catch((error) => {
    console.error("CLI error:", error);
    process.exit(1);
  });
}
