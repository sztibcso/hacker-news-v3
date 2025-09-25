import { timeAgo } from '~/shared/utils/format';
import type { HnComment } from '../types';

interface CommentCardProps {
  comment: HnComment;
  variant?: 'full' | 'compact';
}

export function CommentCard({ comment, variant = 'full' }: CommentCardProps) {
  const cleanText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  if (variant === 'compact') {
    return (
      <article className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{comment.by}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(comment.time)}</span>
        </div>
        <div className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
          {cleanText(comment.text)}
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {comment.by.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{comment.by}</span>
          <div className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(comment.time)}</div>
        </div>
      </div>

      <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: comment.text }} />
      </div>

      {comment.kids && comment.kids.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-hn-orange">
            {comment.kids.length} replies →
          </button>
        </div>
      )}
    </article>
  );
}
