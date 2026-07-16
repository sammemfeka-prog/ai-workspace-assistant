import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Copy, MessageSquare, RotateCw, Sparkles, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { trackActivity } from "@/lib/analytics";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant to draft emails, prepare meetings, and brainstorm ideas.",
      },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "wp.chat.v1";

const SUGGESTIONS = [
  "Draft a polite email declining a meeting invite for Thursday.",
  "Create a 30-minute agenda for a project kickoff.",
  "Summarize the difference between OKRs and KPIs.",
  "Give me a checklist for a productive 1:1 with my manager.",
];

function loadInitial(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function messageText(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [initialMessages] = useState<UIMessage[]>(() => loadInitial());
  const trackedRef = useRef<Set<string>>(new Set());

  const { messages, sendMessage, status, stop, regenerate, error, clearError, setMessages } =
    (useChat as unknown as (opts: {
      transport: DefaultChatTransport<UIMessage>;
      messages: UIMessage[];
      onError: (e: Error) => void;
    }) => ReturnType<typeof useChat> & {
      setMessages: (m: UIMessage[]) => void;
    })({
      transport,
      messages: initialMessages,
      onError: (e: Error) => toast.error(e.message || "Chat failed"),
    });

  const [input, setInput] = useState("");
  const composerRef = useRef<HTMLTextAreaElement>(null);

  // Persist messages
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore quota */
    }
  }, [messages]);

  // Track completed assistant responses (once per id)
  useEffect(() => {
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (trackedRef.current.has(last.id)) return;
    trackedRef.current.add(last.id);
    trackActivity("chat", "AI chat response");
  }, [messages, status]);

  // Focus composer on mount and after replies complete
  useEffect(() => {
    if (status === "ready") composerRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  const submit = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t) return;
      clearError?.();
      sendMessage({ text: t });
      setInput("");
    },
    [sendMessage, clearError],
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    submit(input);
  };

  const clearConversation = () => {
    setMessages([]);
    trackedRef.current.clear();
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    toast.success("Conversation cleared");
    composerRef.current?.focus();
  };

  const copyMessage = async (m: UIMessage) => {
    try {
      await navigator.clipboard.writeText(messageText(m));
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  // Determine last assistant id so older messages fade
  const lastAssistantId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i].id;
    }
    return null;
  }, [messages]);

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-h-0 flex-col">
      <div className="flex items-center justify-between border-b bg-background/60 px-4 py-3 sm:px-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <MessageSquare className="h-4 w-4" /> AI Chat Assistant
          </div>
          <h1 className="text-lg font-semibold sm:text-xl">Your workplace copilot</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearConversation}
          disabled={busy || empty}
        >
          <Trash2 /> Clear
        </Button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
          {empty ? (
            <EmptyState onPick={(p) => submit(p)} />
          ) : (
            messages.map((m, i) => {
              const isUser = m.role === "user";
              const isLast = i === messages.length - 1;
              const isOldAssistant = !isUser && m.id !== lastAssistantId;
              const text = messageText(m);
              return (
                <div
                  key={m.id}
                  className={"group " + (isOldAssistant ? "chat-fade-old" : "")}
                >
                  <Message from={m.role}>
                    <MessageContent
                      className={
                        isUser
                          ? "!bg-primary !text-primary-foreground [&_*]:text-primary-foreground"
                          : "!bg-transparent !p-0"
                      }
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{text}</p>
                      ) : text ? (
                        <MessageResponse>{text}</MessageResponse>
                      ) : isLast && status === "streaming" ? (
                        <Shimmer>Thinking…</Shimmer>
                      ) : null}
                    </MessageContent>
                  </Message>
                  {!isUser && text && (
                    <div className="mt-1 flex items-center gap-1 pl-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => copyMessage(m)}
                        aria-label="Copy response"
                      >
                        <Copy />
                      </Button>
                      {isLast && !busy && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => regenerate()}
                          aria-label="Regenerate response"
                        >
                          <RotateCw />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent variant="flat">
                <Shimmer>Thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}
          {error && (
            <div className="mx-auto max-w-2xl rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {error.message}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t bg-background px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <PromptInput onSubmit={handleFormSubmit}>
            <PromptInputTextarea
              ref={composerRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about work — drafting, planning, ideas…"
              disabled={false}
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={status}
                disabled={busy ? false : !input.trim()}
                onStop={stop}
              />
            </PromptInputFooter>
          </PromptInput>
          <AiDisclaimerRow />
        </div>
      </div>
    </div>
  );
}

function AiDisclaimerRow() {
  // Compact single-line notice under composer.
  return (
    <p className="mt-2 text-center text-[11px] text-muted-foreground">
      AI-generated content may contain inaccuracies. Review important details before acting.
    </p>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold">How can I help you at work today?</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Draft an email, plan a meeting, structure a report, or brainstorm ideas. Try one of these
        to get started:
      </p>
      <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-xl border bg-card p-3 text-left text-sm shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-6 w-full">
        <AiDisclaimer />
      </div>
    </div>
  );
}

// Silence unused import in some builds where Markdown may not render directly
void Markdown;
