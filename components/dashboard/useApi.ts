"use client";

import { useCallback, useEffect, useState } from "react";
import { apiJson } from "@/lib/api-client";

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const result = await apiJson<T>(url);
    if (!result.ok) {
      setError(result.error);
      setData(null);
    } else {
      setError("");
      setData(result.data);
    }
    setLoading(false);
  }, [url]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload };
}
