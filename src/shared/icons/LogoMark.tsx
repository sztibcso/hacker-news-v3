import * as React from "react";

type Props = {
  className?: string;
  strokeWidth?: number;
  showBraces?: boolean;
  title?: string;
};

export const LogoMark: React.FC<Props> = ({
  className = "w-10 h-10",
  strokeWidth = 2,
  showBraces = true,
  title = "HN monogram",
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      {showBraces && (
        <>
          <path d="M5 4c-2 1-2 3 0 4c-2 1-2 3 0 4c-2 1-2 3 0 4" />
          <path d="M19 4c2 1 2 3 0 4c2 1 2 3 0 4c2 1 2 3 0 4" />
        </>
      )}

      {/* H */}
      <path d="M9 6v12" />      {/* H left vertical */}
      <path d="M15 6v12" />     {/* shared central vertical = H right + N left */}
      <path d="M9 12h6" />      {/* H crossbar */}

      {/* N */}
      <path d="M21 6v12" />     {/* N right vertical */}
      <path d="M15 6l6 12" />   {/* N diagonal (top of shared → bottom of right) */}
    </svg>
  );
};
