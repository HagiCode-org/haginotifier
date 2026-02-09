/**
 * haginotifier - Reusable GitHub Actions workflow for Feishu notifications
 *
 * This module exports the main notification functionality for sending
 * messages to Feishu via webhook.
 */

// Export notification function
export { sendNotification, runCli } from "./feishu.js";

// Export type definitions
export type {
  NotificationInput,
  NotificationOutput,
  FeishuTextPayload,
  FeishuPostPayload,
  FeishuInteractivePayload,
  FeishuWebhookPayload,
  FeishuWebhookResponse,
  FeishuPostContentElement,
  FeishuCardElement,
} from "./types.js";
