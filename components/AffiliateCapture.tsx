"use client";

import { useEffect } from "react";

export default function AffiliateCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get("ref") || params.get("aff") || "").trim();
    if (!code) return;
    const key = `mf-ref-hit:${code.toLowerCase()}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch("/api/affiliate/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
  }, []);

  return null;
}
