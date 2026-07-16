import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiStatus } from "@/components/ai-status";
import { Markdown } from "@/components/markdown";
import { OutputActions } from "@/components/output-actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { trackActivity } from "@/lib/analytics";
import { summarizeMeetingNotes } from "@/lib/summarize.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a clean structured summary with decisions, action items, and deadlines.",
      },
    ],
  }),
  component: SummarizerPage,
});

const SAMPLE = `Q3 planning sync — 45 min
Attendees: Priya, Marco, Elena, Sam
- Priya: shipping the analytics dashboard by Oct 3, blocked on data pipeline from Sam
- Marco: proposes moving billing v2 to Q4 due to compliance review
- Elena: hiring — 2 designer offers going out this week
- Sam: pipeline should be unblocked Friday
Decisions: move billing v2 to Q4; keep analytics dash on track; run design portfolio review Monday.
Risks: compliance review may slip; competitor launched similar analytics feature.
Next: draft revised Q3 roadmap by EOW; Sam to send updated pipeline ETA Thursday.`;

function SummarizerPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");

  const mutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await summarizeMeetingNotes({ data: { notes: input } });
      return res.markdown;
    },
    onSuccess: (md) => {
      setOutput(md);
      trackActivity("summary", "Meeting notes summarized");
      toast.success("Summary ready");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to summarize"),
  });

  const run = () => {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a few sentences of meeting notes.");
      return;
    }
    mutation.mutate(notes);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <FileText className="h-4 w-4" /> Meeting Notes Summarizer
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Turn messy notes into clarity.</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Paste your raw notes. The assistant extracts an executive summary, key decisions, action
          items, assessments, and deadlines.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <section className="card-soft flex flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your notes</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotes(SAMPLE)}
              disabled={mutation.isPending}
            >
              Load sample
            </Button>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes here…"
            className="min-h-[320px] flex-1 resize-y text-[15px] leading-relaxed"
            disabled={mutation.isPending}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{notes.length} chars</p>
            <div className="flex items-center gap-2">
              {mutation.isPending && <AiStatus label="AI is analyzing your meeting notes…" />}
              <Button onClick={run} disabled={mutation.isPending}>
                <Wand2 /> Summarize
              </Button>
            </div>
          </div>
        </section>

        {/* Output */}
        <section className="card-soft flex flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Structured summary</h2>
            <OutputActions
              text={output}
              filename="meeting-summary.txt"
              onRegenerate={notes.trim() ? run : undefined}
              onClear={() => setOutput("")}
              disabled={mutation.isPending}
            />
          </div>
          <div className="min-h-[320px] flex-1 rounded-xl border bg-surface/50 p-4">
            {mutation.isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-9/12" />
                <Skeleton className="mt-4 h-5 w-32" />
                <Skeleton className="h-4 w-8/12" />
                <Skeleton className="h-4 w-6/12" />
              </div>
            ) : output ? (
              <EditableMarkdown value={output} onChange={setOutput} />
            ) : (
              <div className="grid h-full min-h-[280px] place-items-center text-center text-sm text-muted-foreground">
                Your summary will appear here.
              </div>
            )}
          </div>
          {output && <p className="mt-2 text-xs text-muted-foreground">Tip: click Edit to refine before copying.</p>}
        </section>
      </div>

      <div className="mt-6">
        <AiDisclaimer />
      </div>
    </div>
  );
}

function EditableMarkdown({
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
