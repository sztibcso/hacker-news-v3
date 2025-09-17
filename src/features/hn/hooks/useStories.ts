import { useState, useEffect, useCallback } from 'react';
import { getTopStories, getNewStories } from '~/services/hnRepository';
import type { HnItem, StoryType } from '~/features/hn/types';

interface UseStoriesState {
  items: HnItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}

interface UseStoriesReturn extends UseStoriesState {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useStories(type: StoryType): UseStoriesReturn {
  const [state, setState] = useState<UseStoriesState>({
    items: [],
    loading: false,
    error: null,
    hasMore: false,
    total: 0,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadStories() {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        items: [],
      }));

      try {
        const getStories = type === 'top' ? getTopStories : getNewStories;
        const result = await getStories({ limit: 20, offset: 0 });

        if (!controller.signal.aborted) {
          setState({
            items: result.items,
            loading: false,
            error: null,
            hasMore: result.hasMore,
            total: result.total,
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load stories',
          }));
        }
      }
    }

    loadStories();

    return () => controller.abort();
  }, [type]);

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) {
      console.log('LoadMore skipped:', { loading: state.loading, hasMore: state.hasMore });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const getStories = type === 'top' ? getTopStories : getNewStories;
      const result = await getStories({
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
        error: error instanceof Error ? error.message : 'Failed to load more stories',
      }));
    }
  }, [type, state.items.length, state.loading, state.hasMore]);

  const refresh = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const getStories = type === 'top' ? getTopStories : getNewStories;
      const result = await getStories({ limit: 20, offset: 0 });

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
        error: error instanceof Error ? error.message : 'Failed to refresh stories',
      }));
    }
  }, [type]);

  return {
    ...state,
    loadMore,
    refresh,
  };
}
