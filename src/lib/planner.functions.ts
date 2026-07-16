import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
});

const Input = z.object({
  tasks: z.array(TaskSchema).min(1, "Add at least one task."),
  workingHours: z.string().min(1),
  scope: z.enum(["day", "week"]).default("day"),
  notes: z.string().optional(),
});

const SYSTEM = `You are an intelligent productivity scheduler.
Given a list of tasks with priorities, due dates, and estimated durations, plus the user's available working hours and scope (day or week), build a realistic, optimized schedule.

Rules:
- Prioritize by urgency (deadlines) and importance (priority).
- Respect the user's available working hours strictly.
- Add short breaks (5-10 min) between focus blocks and a longer break after ~2 hours.
- Group similar tasks; protect deep focus sessions of 60-90 min for high-priority work.
- Never overlap tasks. Never schedule outside working hours.
- End with 2-4 concise recommendations.

Output MUST be Markdown using EXACTLY these headings:

## Overview
## Schedule
## Recommendations

Under Schedule, if scope is "day" use a single "### Today" heading and list each block as "- HH:MM–HH:MM — Task (priority)".
If scope is "week" use one "### Monday", "### Tuesday", ... heading per weekday, same block format.
Under Recommendations use "- " bullets. No preambles, no closing remarks.`;

export const generateSchedule = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const { getLovableAiGateway, DEFAULT_CHAT_MODEL } = await import("./ai-gateway.server");
    const gateway = getLovableAiGateway();
    const prompt = [
      `Scope: ${data.scope}`,
      `Available working hours: ${data.workingHours}`,
      data.notes ? `Notes: ${data.notes}` : null,
      "",
      "Tasks:",
      ...data.tasks.map(
        (t, i) =>
          `${i + 1}. ${t.title} — priority: ${t.priority}${
            t.dueDate ? `, due: ${t.dueDate}` : ""
          }${t.estimatedMinutes ? `, est: ${t.estimatedMinutes} min` : ""}`,
      ),
    ]
      .filter(Boolean)
      .join("\n");

    const { text } = await generateText({
      model: gateway(DEFAULT_CHAT_MODEL),
      system: SYSTEM,
      prompt,
    });
    return { markdown: text };
  });
