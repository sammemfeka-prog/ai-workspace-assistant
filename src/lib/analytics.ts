import { useEffect, useState, useCallback } from "react";

export type ActivityKind = "summary" | "schedule" | "chat";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  title: string;
  minutesSaved: number;
  timestamp: number;
}

const KEY = "wp.activity.v1";

const MINUTES_BY_KIND: Record<ActivityKind, number> = {
  summary: 12,
  schedule: 8,
  chat: 4,
};

function startOfWeek(d = new Date()): number {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday start
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date.getTime();
}

function readAll(): ActivityEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActivityEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(events: ActivityEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(events.slice(-500)));
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}

export function trackActivity(kind: ActivityKind, title: string, minutesOverride?: number) {
  const evt: ActivityEvent = {
    id: crypto.randomUUID(),
    kind,
    title,
    minutesSaved: minutesOverride ?? MINUTES_BY_KIND[kind],
    timestamp: Date.now(),
  };
  writeAll([...readAll(), evt]);
  return evt;
}

export function useActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => setEvents(readAll()), []);

  useEffect(() => {
    setHydrated(true);
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const weekStart = startOfWeek();
  const weekEvents = events.filter((e) => e.timestamp >= weekStart);

  const stats = {
    minutesSavedThisWeek: weekEvents.reduce((s, e) => s + e.minutesSaved, 0),
    summaries: weekEvents.filter((e) => e.kind === "summary").length,
    schedules: weekEvents.filter((e) => e.kind === "schedule").length,
    chats: weekEvents.filter((e) => e.kind === "chat").length,
  };

  const counts: Record<ActivityKind, number> = {
    summary: stats.summaries,
    schedule: stats.schedules,
    chat: stats.chats,
  };
  const mostUsed = (Object.entries(counts) as [ActivityKind, number][])
    .sort((a, b) => b[1] - a[1])[0];

  return {
    hydrated,
    events,
    weekEvents,
    stats,
    mostUsedTool: mostUsed && mostUsed[1] > 0 ? mostUsed[0] : null,
    refresh,
    clearAll: () => writeAll([]),
  };
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function toolLabel(k: ActivityKind): string {
  return k === "summary"
    ? "Meeting Summarizer"
    : k === "schedule"
      ? "Task Planner"
      : "AI Chat Assistant";
}
