import type { HnItem } from "../types";

interface SaveButtonProps {
  story: HnItem;
  isSaved: boolean;
  onToggle: (story: HnItem) => void;
  size?: "small" | "medium";
}

const SIZE_CLASSES = {
  small: "h-8 w-8 text-base",
  medium: "h-9 w-9 text-lg",
} as const;

const BASE_CLASSES = 
  "inline-flex items-center justify-center rounded-full border-2 select-none cursor-pointer " +
  "transition-colors duration-200 shadow-sm " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hn-orange focus-visible:ring-offset-2";

const SAVED_CLASSES = "bg-hn-orange border-hn-orange text-white hover:bg-orange-600";

const UNSAVED_CLASSES =
  "bg-white border-gray-300 text-gray-400 hover:border-hn-orange hover:text-hn-orange " +
  "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:border-hn-orange dark:hover:text-hn-orange";

export function SaveButton({
  story,
  isSaved,
  onToggle,
  size = "medium",
}: SaveButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(story);
  };

  const ariaLabel = isSaved ? "Remove from saved" : "Save story";

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={handleClick}
      className={`${BASE_CLASSES} ${SIZE_CLASSES[size]} ${isSaved ? SAVED_CLASSES : UNSAVED_CLASSES}`}
      data-saved={isSaved}
    >
      {isSaved ? "★" : "☆"}
    </button>
  );
}