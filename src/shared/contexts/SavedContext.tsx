import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

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

const SavedContext = createContext<SavedContextType | null>(null);

const STORAGE_KEY = 'hn_saved_v1';

function loadFromStorage(): SavedMap {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SavedMap;
    if (parsed && typeof parsed === 'object') return parsed;
    return {};
  } catch {
    return {};
  }
}

function saveToStorage(map: SavedMap) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    }
  } catch {
    return;
  }
}

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedMap>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(saved);
  }, [saved]);

  const isSaved = useCallback((id: number) => !!saved[id], [saved]);

  const toggleSave = useCallback((story: SavedStory) => {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[story.id]) {
        delete next[story.id];
      } else {
        next[story.id] = story;
      }
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setSaved((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSaved({});
  }, []);

  const value = useMemo(
    () => ({ saved, isSaved, toggleSave, remove, clear }),
    [saved, isSaved, toggleSave, remove, clear],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}
