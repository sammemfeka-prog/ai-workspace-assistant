import ReactMarkdown from "react-markdown";

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={
        "max-w-none text-[15px] leading-relaxed text-foreground " +
        "[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold " +
        "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight " +
        "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold " +
        "[&_p]:my-2 " +
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 " +
        "[&_li]:my-1 " +
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 " +
        "[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] " +
        "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface [&_pre]:p-3 [&_pre]:text-[13px] " +
        "[&_strong]:font-semibold " +
        "[&_hr]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground " +
        (className ?? "")
      }
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
