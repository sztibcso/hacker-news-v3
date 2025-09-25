import { useState } from 'react';
import { domainFromUrl } from '~/shared/utils/format';
import { getDomainInfo } from '~/shared/utils/domainUtils';
import { StoryVisual } from './StoryVisual';
import { StoryMetadata } from './StoryMetadata';
import { useSavedStories } from '../hooks/useSavedStories';
import { CommentsModal } from './CommentsModal';
import type { HnItem } from '../types';
import { SaveButton } from './SaveButton';

interface StoryCardProps {
  story: HnItem;
  variant?: 'full' | 'preview';
}

export function StoryCard({ story, variant = 'full' }: StoryCardProps) {
  const titleId = `story-title-${story.id}`;
  const domain = domainFromUrl(story.url);
  const domainInfo = getDomainInfo(story.url);
  const { toggleSave, isSaved } = useSavedStories();
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const commentCount = story.descendants || 0;

  if (variant === 'preview') {
    return (
      <article className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex gap-3">
          <StoryVisual url={story.url} size="small" />
          <div className="flex-1 min-w-0">
            {story.url ? (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-hn-orange transition-colors leading-tight block"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {story.title}
              </a>
            ) : (
              <h3
                className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {story.title}
              </h3>
            )}
            <div className="mt-1 flex items-center justify-between">
              <StoryMetadata
                score={story.score}
                by={story.by}
                time={story.time}
                variant="compact"
              />
              <div className="flex items-center gap-1">
                {commentCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsCommentsModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-hn-orange transition-colors rounded"
                    aria-label={`View ${commentCount} comments`}
                  >
                    💬
                    <span>{commentCount}</span>
                  </button>
                )}
                <SaveButton
                  story={story}
                  isSaved={isSaved(story.id)}
                  onToggle={toggleSave}
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        <CommentsModal
          story={story}
          isOpen={isCommentsModalOpen}
          onClose={() => setIsCommentsModalOpen(false)}
        />
      </article>
    );
  }

  // Full variant
  return (
    <article
      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 transform hover:-translate-y-0.5"
      aria-labelledby={titleId}
    >
      <div className="flex gap-4">
        <StoryVisual url={story.url} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${domainInfo.color} text-gray-700 dark:text-gray-200 capitalize`}
            >
              {domainInfo.category}
            </span>
            {domain && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{domain}</span>
            )}
          </div>

          {story.url ? (
            <a
              id={titleId}
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-hn-orange transition-colors block mb-3 leading-tight group-hover:text-hn-orange focus:outline-none focus:ring-2 focus:ring-hn-orange focus:ring-offset-2"
            >
              {story.title}
            </a>
          ) : (
            <h3
              id={titleId}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 leading-tight"
            >
              {story.title}
            </h3>
          )}

          <div className="flex items-center justify-between mb-3">
            <StoryMetadata score={story.score} by={story.by} time={story.time} />
            <div className="flex items-center gap-2">
              {commentCount > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCommentsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-hn-orange hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
                  aria-label={`View ${commentCount} comments`}
                >
                  💬
                  <span>{commentCount}</span>
                </button>
              )}
              <SaveButton story={story} isSaved={isSaved(story.id)} onToggle={toggleSave} />
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-hn-orange to-orange-400 h-1 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((story.score / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <CommentsModal
        story={story}
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
      />
    </article>
  );
}
