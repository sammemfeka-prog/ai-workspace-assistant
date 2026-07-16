import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Plus, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiStatus } from "@/components/ai-status";
import { Markdown } from "@/components/markdown";
import { OutputActions } from "@/components/output-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { trackActivity } from "@/lib/analytics";
import { generateSchedule } from "@/lib/planner.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Enter your tasks, priorities, and working hours to generate an optimized daily or weekly schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

type PriorityLevel = "low" | "medium" | "high";
type TaskRow = {
  id: string;
  title: string;
  priority: PriorityLevel;
  dueDate: string;
  estimatedMinutes: string;
};

const emptyTask = (): TaskRow => ({
  id: crypto.randomUUID(),
  title: "",
  priority: "medium",
  dueDate: "",
  estimatedMinutes: "",
});

function PlannerPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([emptyTask(), emptyTask()]);
  const [workingHours, setWorkingHours] = useState("9:00–17:00, Mon–Fri");
  const [scope, setScope] = useState<"day" | "week">("day");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const cleaned = tasks
        .filter((t) => t.title.trim())
        .map((t) => ({
          title: t.title.trim(),
          priority: t.priority,
          dueDate: t.dueDate || undefined,
          estimatedMinutes: t.estimatedMinutes ? Number(t.estimatedMinutes) : undefined,
        }));
      if (cleaned.length === 0) throw new Error("Add at least one task.");
      const res = await generateSchedule({
        data: { tasks: cleaned, workingHours, scope, notes: notes || undefined },
      });
      return res.markdown;
    },
    onSuccess: (md) => {
      setOutput(md);
      trackActivity("schedule", `${scope === "day" ? "Daily" : "Weekly"} schedule generated`);
      toast.success("Schedule ready");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to generate schedule"),
  });

  const update = (id: string, patch: Partial<TaskRow>) =>
    setTasks((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: string) => setTasks((rows) => rows.filter((r) => r.id !== id));
  const add = () => setTasks((rows) => [...rows, emptyTask()]);
  const clearForm = () => {
    setTasks([emptyTask()]);
    setNotes("");
    setOutput("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <CalendarClock className="h-4 w-4" /> AI Task Planner
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Plan a focused day or week.</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Add your tasks with priorities and deadlines. The assistant builds an optimized schedule
          around your working hours, with breaks and focus sessions.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <section className="card-soft flex flex-col p-5">
          <h2 className="mb-4 text-lg font-semibold">Your tasks</h2>

          <div className="grid grid-cols-2 gap-3 pb-4">
            <div>
              <Label className="mb-1.5 text-xs">Scope</Label>
              <Select value={scope} onValueChange={(v) => setScope(v as "day" | "week")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Available working hours</Label>
              <Input
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 9:00–17:00, Mon–Fri"
              />
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((t, i) => (
              <div key={t.id} className="rounded-xl border bg-surface/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Task {i + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(t.id)}
                    disabled={tasks.length === 1}
                    aria-label="Remove task"
                  >
                    <Trash2 />
                  </Button>
                </div>
                <Input
                  placeholder="Task title"
                  value={t.title}
                  onChange={(e) => update(t.id, { title: e.target.value })}
                  className="mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={t.priority}
                    onValueChange={(v) => update(t.id, { priority: v as PriorityLevel })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={t.dueDate}
                    onChange={(e) => update(t.id, { dueDate: e.target.value })}
                  />
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={5}
                    step={5}
                    placeholder="Est. min"
                    value={t.estimatedMinutes}
                    onChange={(e) => update(t.id, { estimatedMinutes: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={add} className="mt-3 w-fit">
            <Plus /> Add task
          </Button>

          <div className="mt-4">
            <Label className="mb-1.5 text-xs">Additional notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Meetings I can't move, energy patterns, etc."
              className="min-h-[70px] resize-y"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={clearForm} disabled={mutation.isPending}>
              Clear form
            </Button>
            <div className="flex items-center gap-2">
              {mutation.isPending && <AiStatus label="Creating your schedule…" />}
              <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                <Wand2 /> Generate Schedule
              </Button>
            </div>
          </div>
        </section>

        {/* Output */}
        <section className="card-soft flex flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Optimized schedule</h2>
            <OutputActions
              text={output}
              filename={scope === "day" ? "daily-schedule.txt" : "weekly-schedule.txt"}
              onRegenerate={tasks.some((t) => t.title.trim()) ? () => mutation.mutate() : undefined}
              onClear={() => setOutput("")}
              disabled={mutation.isPending}
            />
          </div>
          <div className="min-h-[320px] flex-1 rounded-xl border bg-surface/50 p-4">
            {mutation.isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="mt-3 h-5 w-24" />
                <Skeleton className="h-4 w-8/12" />
                <Skeleton className="h-4 w-9/12" />
                <Skeleton className="h-4 w-7/12" />
              </div>
            ) : output ? (
              <EditableSchedule value={output} onChange={setOutput} />
            ) : (
              <div className="grid h-full min-h-[280px] place-items-center text-center text-sm text-muted-foreground">
                Your schedule will appear here.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6">
        <AiDisclaimer />
      </div>
    </div>
  );
}

function EditableSchedule({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <div className="mb-2 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>
          {editing ? "Preview" : "Edit"}
        </Button>
      </div>
      {editing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[280px] resize-y font-mono text-[13px] leading-relaxed"
        />
      ) : (
        <Markdown>{value}</Markdown>
      )}
    </div>
  );
}
