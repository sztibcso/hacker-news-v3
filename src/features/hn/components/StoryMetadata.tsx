import { timeAgo, pluralize } from '~/shared/utils/format';
import { getScoreColor } from '~/shared/utils/domainUtils';

interface StoryMetadataProps {
  score: number;
  by: string;
  time: number;
  variant?: 'full' | 'compact';
}

export function StoryMetadata({ score, by, time, variant = 'full' }: StoryMetadataProps) {
  const scoreColor = getScoreColor(score);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className={scoreColor}>{score} pts</span>
        <span>•</span>
        <span>{timeAgo(time)}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <div className={`flex items-center gap-1 ${scoreColor}`}>
        <span className="text-base">▲</span>
        <span className="font-medium">
          {score} {pluralize(score, 'point')}
        </span>
      </div>

      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
        <span className="text-base">👤</span>
        <span>by {by}</span>
      </div>

      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
        <span className="text-base">⏰</span>
        <span>{timeAgo(time)}</span>
      </div>
    </div>
  );
}
