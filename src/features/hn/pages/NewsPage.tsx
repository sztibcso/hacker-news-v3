import React from 'react';
import { StoryList } from '../components/StoryList';
import { useStories } from '../hooks/useStories';

export const NewsPage: React.FC = () => {
  const { items, loading, error, hasMore, loadMore } = useStories('new');

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-hn-orange text-white rounded hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📰 Latest News
        </h1>
        <p className="text-gray-600">
          Stay updated with the newest stories from the tech community
        </p>
      </div>

      <StoryList 
        stories={items}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        variant="full"
        showLoadMore={true}
        loadMoreText="Load More News"
        emptyMessage="No news stories available at the moment."
        className="max-w-4xl"
      />
    </div>
  );
};