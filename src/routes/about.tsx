import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, FileText, Info, MessageSquare } from "lucide-react";

import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AI PA (Productivity Assistant)" },
      {
        name: "description",
        content:
          "About AI PA (Productivity Assistant) — an assistant for meeting summaries, planning, and workplace writing.",
      },
    ],
  }),
  component: AboutPage,
});

const features = [
  {
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Structured summaries with decisions, actions, assessments, and deadlines.",
  },
  {
    icon: CalendarClock,
    title: "AI Task Planner",
    desc: "Optimized daily or weekly schedules that respect priorities and working hours.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    desc: "Draft emails, agendas, and reports; brainstorm and get productivity advice.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Info className="h-4 w-4" /> About
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">AI PA (Productivity Assistant)</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A focused AI productivity assistant. No sign-up, no clutter — just three tools
          that give you time back.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="card-soft p-5">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="card-soft mt-6 p-5">
        <h2 className="text-lg font-semibold">How your time-saved estimate works</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each tool contributes an estimate: about 12 minutes per meeting summary, 8 minutes per
          generated schedule, and 4 minutes per AI chat interaction. Totals reset every Monday.
        </p>
      </section>

      <div className="mt-6">
        <AiDisclaimer />
      </div>
    </div>
  );
}
