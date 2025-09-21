import { act, renderHook, waitFor } from '@testing-library/react';
import { useStories } from './useStories';
import type { StoryType } from '~/features/hn/types';

describe('useStories', () => {
  it('loads top stories by default', async () => {
    const { result } = renderHook(() => useStories('top'));

    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('switches between top and new stories', async () => {
    const { result, rerender } = renderHook(({ type }: { type: StoryType }) => useStories(type), {
      initialProps: { type: 'top' as StoryType },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const topItems = result.current.items;

    rerender({ type: 'new' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).not.toEqual(topItems);
  });

  it('handles loadMore correctly based on hasMore flag', async () => {
    const { result } = renderHook(() => useStories('top'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCount = result.current.items.length;
    const hasMoreInitially = result.current.hasMore;

    if (hasMoreInitially) {
      await result.current.loadMore();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items.length).toBeGreaterThan(initialCount);
    } else {
      await result.current.loadMore();
      expect(result.current.items.length).toBe(initialCount);
    }
  });

  it('provides refresh functionality', async () => {
    const { result } = renderHook(() => useStories('top'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });
});
