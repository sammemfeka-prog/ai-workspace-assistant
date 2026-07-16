import { Copy, Download, RotateCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function OutputActions({
  text,
  filename,
  onRegenerate,
  onClear,
  disabled,
}: {
  text: string;
  filename: string;
  onRegenerate?: () => void;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };
  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={copy} disabled={disabled || !text}>
        <Copy /> Copy
      </Button>
      <Button variant="outline" size="sm" onClick={download} disabled={disabled || !text}>
        <Download /> Download
      </Button>
      {onRegenerate && (
        <Button variant="outline" size="sm" onClick={onRegenerate} disabled={disabled}>
          <RotateCw /> Regenerate
        </Button>
      )}
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} disabled={disabled || !text}>
          <Trash2 /> Clear
        </Button>
      )}
    </div>
  );
}
