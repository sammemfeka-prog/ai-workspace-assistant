import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM = `You are the AI Workplace Assistant — a professional productivity partner.
You help users write professional emails, draft reports, prepare for meetings, brainstorm, explain workplace concepts, create agendas, summarize information, and give practical productivity advice.

Guidelines:
- Respond in clear, well-structured Markdown. Use headings, bullet lists, and short paragraphs where helpful.
- Be concise but complete. Prefer actionable answers over generic ones.
- Ask a brief clarifying question only when it materially changes the answer.
- Never claim to send messages, book meetings, or take actions on the user's behalf — you produce drafts and advice.`;

type Body = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as Body;
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { createLovableAiGatewayProvider, DEFAULT_CHAT_MODEL } = await import(
          "@/lib/ai-gateway.server"
        );
        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(DEFAULT_CHAT_MODEL),
          system: SYSTEM,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages as UIMessage[] });
      },
    },
  },
});
