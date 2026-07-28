"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Bike } from "@/types/bike";
import { generateSocialContent } from "@/lib/socialContent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CopyKey = "facebook" | "chotot";

interface SocialContentPanelProps {
  bike: Bike;
}

export function SocialContentPanel({ bike }: SocialContentPanelProps) {
  const [copiedKey, setCopiedKey] = useState<CopyKey | null>(null);
  const content = generateSocialContent(bike);

  const copyToClipboard = async (key: CopyKey, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
    } catch (error) {
      console.error("Failed to copy social content:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">
            Mẫu 1: Facebook / Zalo (giật gân)
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard("facebook", content.facebookPost)}
          >
            {copiedKey === "facebook" ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Đã Copy
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Nội Dung
              </>
            )}
          </Button>
        </div>
        <Textarea
          readOnly
          value={content.facebookPost}
          rows={16}
          className="font-mono text-xs"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Mẫu 2: Chợ Tốt (minh bạch)</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard("chotot", content.choTotPost)}
          >
            {copiedKey === "chotot" ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Đã Copy
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Nội Dung
              </>
            )}
          </Button>
        </div>
        <Textarea
          readOnly
          value={content.choTotPost}
          rows={16}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
}
