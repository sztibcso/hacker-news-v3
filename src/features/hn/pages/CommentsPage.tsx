import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CommentList } from '../components/CommentList';
import { useComments } from '../hooks/useComments';
import { fetchItem } from '~/services/hnClient';
import { useState } from 'react';
import type { HnItem } from '../types';

export function CommentsPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const { items, loading, error, hasMore, total, loadComments, loadMore } = useComments();
  const [story, setStory] = useState<HnItem | null>(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [storyError, setStoryError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStory() {
      if (!storyId) return;

      setStoryLoading(true);
      setStoryError(null);

      try {
        const storyData = await fetchItem(parseInt(storyId));
        setStory(storyData);
      } catch (error) {
        setStoryError(error instanceof Error ? error.message : 'Failed to load story');
      } finally {
        setStoryLoading(false);
      }
    }

    loadStory();
  }, [storyId]);

  useEffect(() => {
    if (storyId && story) {
      loadComments(parseInt(storyId), 20);
    }
  }, [storyId, story, loadComments]);

  if (storyLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
        </div>
      </div>
    );
  }

  if (storyError || !story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Story Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {storyError || 'The requested story could not be found.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-hn-orange text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            ← Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-hn-orange transition-colors"
        >
          ← Back to Stories
        </Link>
      </nav>

      <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-8">
        <div className="flex flex-col gap-4">
          {story.url ? (
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-hn-orange transition-colors"
            >
              {story.title}
            </a>
          ) : (
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{story.title}</h1>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span>▲</span>
              <span className="font-medium">{story.score} points</span>
            </span>
            <span>by {story.by}</span>
            <span>{story.descendants || 0} comments</span>
          </div>
        </div>
      </article>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Comments ({total})</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <CommentList
          comments={items}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyMessage="No comments yet"
        />
      </div>
    </div>
  );
}
