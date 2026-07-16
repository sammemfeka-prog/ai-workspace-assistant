import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  Clock,
  FileText,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { formatMinutes, toolLabel, useActivity } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI PA (Productivity Assistant)" },
      {
        name: "description",
        content: "Your workplace productivity dashboard with AI tools and weekly insights.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/summarizer" as const,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw meeting notes into a clean, structured summary with decisions, actions, and deadlines.",
    icon: FileText,
    time: "~12 min saved",
  },
  {
    to: "/planner" as const,
    title: "AI Task Planner",
    desc: "Get an optimized daily or weekly schedule that respects priorities and working hours.",
    icon: CalendarClock,
    time: "~8 min saved",
  },
  {
    to: "/chat" as const,
    title: "AI Chat Assistant",
    desc: "Draft emails, prepare for meetings, brainstorm ideas, and get productivity advice on demand.",
    icon: MessageSquare,
    time: "~4 min per chat",
  },
];

function Dashboard() {
  const { hydrated, stats, mostUsedTool, weekEvents } = useActivity();
  const hoursSaved = stats.minutesSavedThisWeek / 60;
  const motivational =
    hoursSaved >= 1
      ? `Great work! You've saved approximately ${hoursSaved.toFixed(1)} hours this week using AI.`
      : hydrated && stats.minutesSavedThisWeek > 0
        ? `Nice start — ${stats.minutesSavedThisWeek} minutes reclaimed this week.`
        : "Use a tool to start tracking your time saved.";

  const recent = [...weekEvents].reverse().slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <section className="mb-8">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" /> Welcome back
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to AI PA (Productivity Assistant)
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Your AI-powered workplace productivity companion — summarize meetings, plan your week,
          and draft polished writing in one calm, focused workspace.
        </p>
      </section>

      {/* Insights */}
      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Weekly productivity insights</h2>
          <span className="text-xs text-muted-foreground">Resets every Monday</span>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Clock}
            label="Time saved this week"
            value={hydrated ? formatMinutes(stats.minutesSavedThisWeek) : "—"}
            hint="Estimated"
            accent
          />
          <StatCard
            icon={FileText}
            label="Meetings summarized"
            value={hydrated ? String(stats.summaries) : "—"}
          />
          <StatCard
            icon={CalendarClock}
            label="Schedules generated"
            value={hydrated ? String(stats.schedules) : "—"}
          />
          <StatCard
            icon={MessageSquare}
            label="AI conversations"
            value={hydrated ? String(stats.chats) : "—"}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-gradient-to-r from-primary/5 via-transparent to-primary-soft/20 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">{motivational}</p>
          </div>
          {mostUsedTool && (
            <p className="text-xs text-muted-foreground">
              Most used this week: <span className="font-medium text-foreground">{toolLabel(mostUsedTool)}</span>
            </p>
          )}
        </div>
      </section>

      {/* Quick access */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Quick access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="card-soft group flex flex-col p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{t.time}</span>
              </div>
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Open
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Recent activity</h2>
        <div className="card-soft divide-y">
          {!hydrated || recent.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No activity yet this week. Try summarizing a meeting or generating a schedule.
            </div>
          ) : (
            recent.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface text-muted-foreground">
                  {e.kind === "summary" ? (
                    <FileText className="h-4 w-4" />
                  ) : e.kind === "schedule" ? (
                    <CalendarClock className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {toolLabel(e.kind)} · {new Date(e.timestamp).toLocaleString()}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-primary">
                  +{formatMinutes(e.minutesSaved)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <AiDisclaimer />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="card-soft p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className={"h-4 w-4 " + (accent ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div className={"text-2xl font-bold " + (accent ? "text-primary" : "")}>{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

// Silence unused button import in some builds
void Button;
