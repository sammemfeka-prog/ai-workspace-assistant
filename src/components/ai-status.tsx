import { Loader2 } from "lucide-react";

export function AiStatus({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
