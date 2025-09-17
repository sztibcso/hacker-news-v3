import type { HnItem } from "../types";

interface SaveButtonProps {
  story: HnItem;
  isSaved: boolean;
  onToggle: (story: HnItem) => void;
  size?: "small" | "medium";
}

/**
 * Star-style Save button
 * - circular
 * - saved: orange bg + white star + orange border  -> always visible, not only on hover
 * - unsaved: light outline (light/dark compatible)
 */
export function SaveButton({
  story,
  isSaved,
  onToggle,
  size = "medium",
}: SaveButtonProps) {
  const circle =
    size === "small"
      ? "h-8 w-8 text-base"
      : "h-9 w-9 text-lg";

  const base =
    "inline-flex items-center justify-center rounded-full border-2 select-none cursor-pointer " +
    "transition-colors duration-200 shadow-sm " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hn-orange focus-visible:ring-offset-2";

  const saved =
    "bg-hn-orange border-hn-orange text-white hover:bg-orange-600";
  const unsaved =
    "bg-white border-gray-300 text-gray-400 hover:border-hn-orange hover:text-hn-orange " +
    "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:text-hn-orange";

  const title = isSaved ? "Remove from saved" : "Save story";

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={title}
      title={title}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(story);
      }}
      className={`${base} ${circle} ${isSaved ? saved : unsaved}`}
      data-saved={isSaved ? "true" : "false"}
    >
      {isSaved ? "★" : "☆"}
    </button>
  );
}
