import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { env } from "cloudflare:workers";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { checkRateLimit, type RateLimitKV } from "@/lib/rate-limit.server";
import { siteConfig } from "@/config";

type ChatRequestBody = { messages?: unknown };

const MAX_MESSAGE_LENGTH = 2000;

function getClientIdentifier(request: Request): string {
  // Cloudflare sets this automatically on every request that reaches a Worker.
  return request.headers.get("cf-connecting-ip") ?? "unknown";
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const identifier = getClientIdentifier(request);
        const rateLimitKv = (env as { RATE_LIMIT_KV?: RateLimitKV }).RATE_LIMIT_KV;
        const { allowed } = await checkRateLimit(rateLimitKv, identifier);
        if (!allowed) {
          return new Response("Too many requests — please try again later.", { status: 429 });
        }

        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const totalLength = JSON.stringify(messages).length;
        if (totalLength > MAX_MESSAGE_LENGTH) {
          return new Response("Message too long", { status: 413 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: siteConfig.aiAgent.systemPrompt,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});