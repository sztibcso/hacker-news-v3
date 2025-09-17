import React from 'react';
import { StoryCard } from './StoryCard';
import type { HnItem } from '../types';

interface StoryListProps {
  stories: HnItem[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
  variant?: 'full' | 'preview';
  showLoadMore?: boolean;
  loadMoreText?: string;
  emptyMessage?: string;
  className?: string;
  showRanking?: boolean;
}

export const StoryList: React.FC<StoryListProps> = ({
  stories,
  loading,
  hasMore,
  onLoadMore,
  variant = 'full',
  showLoadMore = true,
  loadMoreText = 'Load More',
  emptyMessage = 'No stories available.',
  className = '',
  showRanking = false,
}) => {
  if (loading && stories.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
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
    );
  }

  if (stories.length === 0 && !loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {emptyMessage}
        </h3>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {stories.map((story, index) => (
        <div key={story.id} className="relative">
          {showRanking && (
            <div className="absolute -left-2 -top-1 bg-hn-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10">
              {index + 1}
            </div>
          )}
          <StoryCard 
            story={story} 
            variant={variant}
          />
        </div>
      ))}
      
      {showLoadMore && hasMore && (
        <div className="text-center py-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-hn-orange text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : loadMoreText}
          </button>
        </div>
      )}
    </div>
  );
};