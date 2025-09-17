import { Link } from 'react-router-dom';
import { StoryCard } from '../components/StoryCard';
import { useStories } from '../hooks/useStories';

export function HomePage() {
  const { items: newStories, loading: newLoading, error: newError } = useStories('new');
  const { items: topStories, loading: topLoading, error: topError } = useStories('top');

  const previewNewStories = newStories.slice(0, 10);
  const previewTopStories = topStories.slice(0, 10);

  if (newError || topError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Stories</h2>
          <p className="text-red-600 mb-4">{newError || topError}</p>
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column - News Stories (3/4) */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Showing {previewNewStories.length} stories
          </span>
        </div>

        {newLoading && previewNewStories.length === 0 ? (
          <div className="space-y-4" role="status" aria-label="Loading news stories">
            <span className="sr-only">Loading news stories...</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {previewNewStories.map((story) => (
              <StoryCard key={story.id} story={story} variant="full" />
            ))}

            {/* Load More Button */}
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

      {/* Right Column - Top Stories (1/4) */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Stories</h2>
            <span className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded-full">
              Trending
            </span>
          </div>

          {topLoading && previewTopStories.length === 0 ? (
            <div className="space-y-3" role="status" aria-label="Loading top stories">
              <span className="sr-only">Loading top stories...</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {previewTopStories.map((story, index) => (
                <div key={story.id} className="relative">
                  {/* Ranking number */}
                  <div className="absolute -left-2 -top-1 bg-hn-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10">
                    {index + 1}
                  </div>

                  {/* Story title only */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                    {story.url ? (
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 hover:text-hn-orange transition-colors leading-tight block line-clamp-3"
                      >
                        {story.title}
                      </a>
                    ) : (
                      <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-3">
                        {story.title}
                      </h3>
                    )}

                    {/* Minimal metadata */}
                    <div className="mt-2 text-xs text-gray-500">{story.score} pts</div>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
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
