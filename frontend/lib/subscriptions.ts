"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "oitoon-subscribed-authors";

function readSubscribedIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function writeSubscribedIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("oitoon-subscriptions-change"));
}

export function useSubscriptions() {
  const [subscribedIds, setSubscribedIds] = useState<number[]>([]);

  useEffect(() => {
    setSubscribedIds(readSubscribedIds());
    const onChange = () => setSubscribedIds(readSubscribedIds());
    window.addEventListener("oitoon-subscriptions-change", onChange);
    return () => window.removeEventListener("oitoon-subscriptions-change", onChange);
  }, []);

  const isSubscribed = useCallback(
    (authorId: number) => subscribedIds.includes(authorId),
    [subscribedIds]
  );

  const toggleSubscription = useCallback((authorId: number) => {
    const current = readSubscribedIds();
    const next = current.includes(authorId)
      ? current.filter((id) => id !== authorId)
      : [...current, authorId];
    writeSubscribedIds(next);
  }, []);

  return { subscribedIds, isSubscribed, toggleSubscription };
}
