import React from 'react';
import { StoryList } from '../components/StoryList';
import { useSavedStories } from '../hooks/useSavedStories';
import { Link } from 'react-router-dom';

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📖</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        No saved stories yet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Start building your reading list by saving interesting stories. Look for the bookmark icon
        on any story!
      </p>
      <Link
        to="/news"
        className="inline-block px-6 py-3 rounded-md bg-hn-orange text-white font-medium hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-hn-orange focus:ring-offset-2"
      >
        Browse Stories
      </Link>
    </div>
  );
}

export const SavedPage: React.FC = () => {
  const { savedStories, clearAllSaved, savedCount } = useSavedStories();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved stories?')) {
      clearAllSaved();
    }
  };

  const storiesText = savedCount === 1 ? 'story' : 'stories';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            📚 Saved Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {savedCount > 0
              ? `You have ${savedCount} saved ${storiesText}`
              : 'Your reading list is empty'}
          </p>
        </div>

        {savedCount > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-md text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear All
          </button>
        )}
      </div>

      {savedCount === 0 ? (
        <EmptyState />
      ) : (
        <StoryList
          stories={savedStories}
          loading={false}
          hasMore={false}
          onLoadMore={async () => {}}
          variant="full"
          showLoadMore={false}
          emptyMessage="No saved stories found."
          className="max-w-4xl"
        />
      )}
    </div>
  );
};
