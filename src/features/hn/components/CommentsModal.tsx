import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { CommentList } from './CommentList';
import { useComments } from '../hooks/useComments';
import type { HnItem } from '../types';

interface CommentsModalProps {
  story: HnItem;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsModal({ story, isOpen, onClose }: CommentsModalProps) {
  const { items, loading, error, total, loadComments } = useComments();

  useEffect(() => {
    if (isOpen && story.id) {
      loadComments(story.id, 5); // Load first 5 comments
    }
  }, [isOpen, story.id, loadComments]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {story.title}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{story.descendants || 0} comments</span>
                <span>by {story.by}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <CommentList
            comments={items}
            loading={loading}
            hasMore={false}
            showLoadMore={false}
            variant="compact"
            emptyMessage="No comments yet"
          />
        </div>

        {/* Footer */}
        {total > 5 && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
            <Link
              to={`/story/${story.id}/comments`}
              className="block w-full text-center py-2 px-4 bg-hn-orange text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              onClick={onClose}
            >
              View All {total} Comments
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
