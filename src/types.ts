/**
 * Input parameters for the notification workflow
 */
export interface NotificationInput {
  /** Feishu Webhook URL for sending notifications */
  webhook_url: string;
  /** Notification message content */
  message: string;
  /** Message type: "text", "post", or "interactive". Defaults to "text" */
  msg_type?: "text" | "post" | "interactive";
  /** Message title for post/interactive messages (optional) */
  title?: string;
}

/**
 * Output parameters returned by the notification workflow
 */
export interface NotificationOutput {
  /** Notification delivery status: "success" or "failure" */
  status: "success" | "failure";
  /** ISO 8601 timestamp of notification send attempt */
  timestamp: string;
  /** Webhook response content or error message */
  response: string;
}

/**
 * Feishu text message payload
 */
export interface FeishuTextPayload {
  msg_type: "text";
  content: {
    text: string;
  };
}

/**
 * Feishu post (rich text) content element
 */
export interface FeishuPostContentElement {
  tag: "text" | "a" | "at" | "img" | "media";
  text?: string;
  href?: string;
  userId?: string;
  userName?: string;
  src?: string;
  fileId?: string;
}

/**
 * Feishu post (rich text) message payload
 */
export interface FeishuPostPayload {
  msg_type: "post";
  content: {
    post: {
      zh_cn: {
        title?: string;
        content: FeishuPostContentElement[][];
      };
    };
  };
}

/**
 * Feishu interactive card element
 */
export interface FeishuCardElement {
  tag: string;
  [key: string]: unknown;
}

/**
 * Feishu interactive card message payload
 */
export interface FeishuInteractivePayload {
  msg_type: "interactive";
  card: {
    header?: {
      title: {
        content: string;
        tag: "plain_text";
      };
      template?: string;
    };
    elements: FeishuCardElement[];
  };
}

/**
 * Union type for all Feishu webhook payload types
 */
export type FeishuWebhookPayload =
  | FeishuTextPayload
  | FeishuPostPayload
  | FeishuInteractivePayload;

/**
 * Feishu webhook API response
 */
export interface FeishuWebhookResponse {
  code?: number;
  msg?: string;
  Data?: unknown;
}
