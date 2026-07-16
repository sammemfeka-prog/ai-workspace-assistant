import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const Input = z.object({ notes: z.string().min(20, "Please paste more detailed notes.") });

const SYSTEM = `You are an expert meeting notes summarizer for busy professionals.
Given raw meeting notes, produce a clean, structured Markdown summary using EXACTLY these level-2 headings, in this order:

## Executive Summary
## Key Decisions
## Action Items
## Assessments
## Deadlines

Rules:
- Under Executive Summary write 2-4 concise sentences.
- Under Key Decisions, Action Items, Assessments, Deadlines use "- " bullet points.
- For Action Items, use the format: "- [Owner] Task (due: date if known)".
- For Deadlines, use the format: "- Date — What is due".
- If a section has no content, write "- None noted".
- Do NOT add any other headings, preambles, or closing remarks. Return only the Markdown.`;

export const summarizeMeetingNotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const { getLovableAiGateway, DEFAULT_CHAT_MODEL } = await import("./ai-gateway.server");
    const gateway = getLovableAiGateway();
    const { text } = await generateText({
      model: gateway(DEFAULT_CHAT_MODEL),
      system: SYSTEM,
      prompt: `Meeting notes:\n\n${data.notes}`,
    });
    return { markdown: text };
  });
