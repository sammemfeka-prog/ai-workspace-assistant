import { createFileRoute } from "@tanstack/react-router";
import { RotateCw, Settings2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/analytics";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI PA (Productivity Assistant)" },
      { name: "description", content: "Manage your AI PA (Productivity Assistant) preferences and stored data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { clearAll, refresh, stats } = useActivity();

  const clearActivity = () => {
    clearAll();
    refresh();
    toast.success("Weekly activity cleared");
  };

  const clearChat = () => {
    if (typeof window !== "undefined") window.localStorage.removeItem("wp.chat.v1");
    toast.success("Chat history cleared");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Settings2 className="h-4 w-4" /> Settings
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Preferences</h1>
        <p className="mt-1 text-muted-foreground">
          AI PA (Productivity Assistant) stores your activity and chat locally in your browser. Nothing here leaves
          this device except when the assistant calls the AI model.
        </p>
      </header>

      <section className="card-soft mb-4 p-5">
        <h2 className="text-lg font-semibold">Local data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You currently have {stats.summaries + stats.schedules + stats.chats} tracked activities
          this week ({stats.minutesSavedThisWeek} min saved).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={clearActivity}>
            <RotateCw /> Reset weekly activity
          </Button>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 /> Clear chat history
          </Button>
        </div>
      </section>

      <section className="card-soft mb-6 p-5">
        <h2 className="text-lg font-semibold">Model</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          All AI features run through the Lovable AI Gateway using a balanced default model tuned
          for workplace writing and reasoning.
        </p>
      </section>

      <AiDisclaimer />
    </div>
  );
}
