import { ShieldAlert } from "lucide-react";

export function AiDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          AI-generated content may contain inaccuracies. Review important details before acting on
          them.
        </span>
      </p>
    );
  }
  return (
    <div className="rounded-xl border bg-surface p-4 text-xs text-muted-foreground">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShieldAlert className="h-4 w-4" />
        Responsible AI Notice
      </div>
      <p className="leading-relaxed">
        This application uses artificial intelligence to generate summaries, schedules, and
        responses based on user input. AI-generated content may contain inaccuracies or omissions
        and should not be considered legal, financial, medical, or other professional advice. Users
        should review and verify important information before acting on it.
      </p>
    </div>
  );
}
