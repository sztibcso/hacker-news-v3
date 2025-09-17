import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SavedStory = {
  id: number;
  title: string;
  url?: string;
  by?: string;
  score?: number;
  time?: number;
  domain?: string;
};

type SavedMap = Record<number, SavedStory>;

type SavedContextType = {
  saved: SavedMap;
  isSaved: (id: number) => boolean;
  toggleSave: (story: SavedStory) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "hn-saved-v1";
const SavedContext = createContext<SavedContextType | undefined>(undefined);

function readFromStorage(): SavedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SavedMap;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function writeToStorage(state: SavedMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const SavedProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [saved, setSaved] = useState<SavedMap>(() => readFromStorage());

  useEffect(() => writeToStorage(saved), [saved]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSaved(readFromStorage());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const isSaved = (id: number) => Boolean(saved[id]);

  const toggleSave = (story: SavedStory) =>
    setSaved((prev) => {
      const next = { ...prev };
      if (next[story.id]) delete next[story.id];
      else next[story.id] = story;
      return next;
    });

  const remove = (id: number) =>
    setSaved((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const clear = () => setSaved({});

  const value = useMemo(() => ({ saved, isSaved, toggleSave, remove, clear }), [saved]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
};

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within SavedProvider");
  return ctx;
}
