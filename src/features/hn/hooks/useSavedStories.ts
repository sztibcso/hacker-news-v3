import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import type { HnItem } from "../types";

const STORAGE_KEY = "hn-saved-stories";

let savedStoriesRef: HnItem[] = loadFromStorage();
const listeners = new Set<() => void>();

function loadFromStorage(): HnItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error loading saved stories:", err);
    return [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStoriesRef));
  } catch (err) {
    console.error("Error saving stories to localStorage:", err);
  }
}

function emit() {
  for (const l of listeners) l();
}

let storageListenerAttached = false;
function attachStorageListenerOnce() {
  if (storageListenerAttached || typeof window === "undefined") return;
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    savedStoriesRef = loadFromStorage();
    emit();
  });
  storageListenerAttached = true;
}
attachStorageListenerOnce();

export function useSavedStories() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    return () => listeners.delete(onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => savedStoriesRef, []);
  const savedStories = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isSaved = useCallback(
    (id: number) => savedStories.some((s) => s.id === id),
    [savedStories]
  );

  const saveStory = useCallback((story: HnItem) => {
    if (!story || typeof story.id !== "number") return;
    if (savedStoriesRef.some((s) => s.id === story.id)) return;
    savedStoriesRef = [story, ...savedStoriesRef];
    persist();
    emit();
  }, []);

  const unsaveStory = useCallback((id: number) => {
    const next = savedStoriesRef.filter((s) => s.id !== id);
    if (next.length === savedStoriesRef.length) return;
    savedStoriesRef = next;
    persist();
    emit();
  }, []);

  const toggleSave = useCallback((story: HnItem) => {
    if (!story) return;
    if (savedStoriesRef.some((s) => s.id === story.id)) {
      unsaveStory(story.id);
    } else {
      saveStory(story);
    }
  }, [saveStory, unsaveStory]);

  const clearAllSaved = useCallback(() => {
    savedStoriesRef = [];
    persist();
    emit();
  }, []);

  const savedCount = savedStories.length;

  useEffect(() => attachStorageListenerOnce(), []);

  return useMemo(
    () => ({
      savedStories,
      savedCount,
      saveStory,
      unsaveStory,
      toggleSave,
      clearAllSaved,
      isSaved,
    }),
    [savedStories, savedCount, saveStory, unsaveStory, toggleSave, clearAllSaved, isSaved]
  );
}
