import { useState, useCallback } from 'react';
import { getStoryComments } from '~/services/hnRepository';
import type { HnComment } from '~/features/hn/types';

interface UseCommentsState {
  items: HnComment[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}

interface UseCommentsReturn extends UseCommentsState {
  loadComments: (storyId: number, limit?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export function useComments(): UseCommentsReturn {
  const [state, setState] = useState<UseCommentsState>({
    items: [],
    loading: false,
    error: null,
    hasMore: false,
    total: 0,
  });

  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);

  const loadComments = useCallback(async (storyId: number, limit = 5) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    setCurrentStoryId(storyId);

    try {
      const result = await getStoryComments(storyId, { limit, offset: 0 });

      setState({
        items: result.items,
        loading: false,
        error: null,
        hasMore: result.hasMore,
        total: result.total,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load comments',
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore || !currentStoryId) {
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const result = await getStoryComments(currentStoryId, {
        limit: 20,
        offset: state.items.length,
      });

      setState((prev) => ({
        ...prev,
        items: [...prev.items, ...result.items],
        loading: false,
        hasMore: result.hasMore,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load more comments',
      }));
    }
  }, [state.items.length, state.loading, state.hasMore, currentStoryId]);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      error: null,
      hasMore: false,
      total: 0,
    });
    setCurrentStoryId(null);
  }, []);

  return {
    ...state,
    loadComments,
    loadMore,
    reset,
  };
}
