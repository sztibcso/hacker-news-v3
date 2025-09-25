import React from 'react';
import { CommentCard } from './CommentCard';
import type { HnComment } from '../types';

interface CommentListProps {
  comments: HnComment[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore?: () => Promise<void>;
  variant?: 'full' | 'compact';
  showLoadMore?: boolean;
  emptyMessage?: string;
  className?: string;
}

const SKELETON_COUNT = 3;

function LoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-3">💬</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{message}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Be the first to start a discussion!
      </p>
    </div>
  );
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  loading,
  hasMore,
  onLoadMore,
  variant = 'full',
  showLoadMore = true,
  emptyMessage = 'No comments yet.',
  className = '',
}) => {
  if (loading && comments.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (comments.length === 0 && !loading) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} variant={variant} />
      ))}

      {showLoadMore && hasMore && onLoadMore && (
        <div className="text-center py-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-hn-orange text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-hn-orange focus:ring-offset-2"
          >
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </div>
  );
};
