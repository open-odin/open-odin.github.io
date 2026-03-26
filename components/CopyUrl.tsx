"use client";
import { useState } from "react";

export default function CopyUrl() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={copy}
      title={copied ? "Link copied!" : "Copy link to clipboard"}
      aria-label={copied ? "Link copied!" : "Copy link to clipboard"}
      className="copy-url-btn"
    >
      {copied ? "✓ copied" : "⎘ copy link"}
    </button>
  );
}
