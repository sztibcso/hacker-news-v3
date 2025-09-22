import { Link } from 'react-router-dom';
import { StoryCard } from '../components/StoryCard';
import { useStories } from '../hooks/useStories';

const PREVIEW_LIMIT = 10;
const SKELETON_COUNT = 5;

function LoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="text-center py-12">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
          Error Loading Stories
        </h2>
        <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export function HomePage() {
  const { items: newStories, loading: newLoading, error: newError } = useStories('new');
  const { items: topStories, loading: topLoading, error: topError } = useStories('top');

  const previewNewStories = newStories.slice(0, PREVIEW_LIMIT);
  const previewTopStories = topStories.slice(0, PREVIEW_LIMIT);

  if (newError || topError) {
    return <ErrorDisplay error={newError || topError || 'Unknown error'} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Latest News</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Showing {previewNewStories.length} stories
          </span>
        </div>

        {newLoading && previewNewStories.length === 0 ? (
          <div className="space-y-4" role="status" aria-label="Loading news stories">
            <span className="sr-only">Loading news stories...</span>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {previewNewStories.map((story) => (
              <StoryCard key={story.id} story={story} variant="full" />
            ))}

            <div className="text-center pt-6">
              <Link
                to="/news"
                className="inline-flex items-center px-6 py-3 bg-hn-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-hn-orange focus:ring-offset-2"
              >
                Load More News
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Top Stories</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              Trending
            </span>
          </div>

          {topLoading && previewTopStories.length === 0 ? (
            <div className="space-y-3" role="status" aria-label="Loading top stories">
              <span className="sr-only">Loading top stories...</span>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 animate-pulse">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {previewTopStories.map((story, index) => (
                <div key={story.id} className="relative">
                  <div className="absolute -left-2 -top-1 bg-hn-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10">
                    {index + 1}
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow">
                    {story.url ? (
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-hn-orange transition-colors leading-tight block line-clamp-3"
                      >
                        {story.title}
                      </a>
                    ) : (
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight line-clamp-3">
                        {story.title}
                      </h3>
                    )}

                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {story.score} pts
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <Link
                  to="/top"
                  className="inline-flex items-center px-4 py-2 bg-hn-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-hn-orange focus:ring-offset-2"
                >
                  Load More Top
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
