import { fetchStoryIds, fetchItem, fetchComment } from './hnClient';
import type { HnItem, HnComment } from '~/features/hn/types';

export interface StoryResult {
  items: HnItem[];
  hasMore: boolean;
  total: number;
}

export interface CommentResult {
  items: HnComment[];
  hasMore: boolean;
  total: number;
}

export interface FetchOptions {
  limit?: number;
  offset?: number;
}

export interface BatchOptions {
  concurrency?: number;
}

async function pLimit<T>(tasks: (() => Promise<T>)[], limit: number = 8): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((task) => task()));
    results.push(...batchResults);
  }

  return results;
}

export async function batchFetchItems(
  ids: number[],
  options: BatchOptions = {},
): Promise<HnItem[]> {
  const { concurrency = 8 } = options;

  const tasks = ids.map((id) => async () => {
    try {
      return await fetchItem(id);
    } catch (error) {
      console.warn(`Failed to fetch item ${id}:`, error);
      return null;
    }
  });

  const items = await pLimit(tasks, concurrency);
  return items.filter((item): item is HnItem => item !== null);
}

export async function batchFetchComments(
  ids: number[],
  options: BatchOptions = {},
): Promise<HnComment[]> {
  const { concurrency = 8 } = options;

  const tasks = ids.map((id) => async () => {
    try {
      return await fetchComment(id);
    } catch (error) {
      console.warn(`Failed to fetch comment ${id}:`, error);
      return null;
    }
  });

  const items = await pLimit(tasks, concurrency);
  return items.filter((item): item is HnComment => item !== null);
}

async function getStoriesByType(
  type: 'top' | 'new',
  options: FetchOptions = {},
): Promise<StoryResult> {
  const { limit = 20, offset = 0 } = options;

  const allIds = await fetchStoryIds(type);
  const slicedIds = allIds.slice(offset, offset + limit);
  const items = await batchFetchItems(slicedIds);

  return {
    items,
    hasMore: offset + limit < allIds.length,
    total: allIds.length,
  };
}

export async function getTopStories(options: FetchOptions = {}) {
  return getStoriesByType('top', options);
}

export async function getNewStories(options: FetchOptions = {}) {
  return getStoriesByType('new', options);
}

export async function getStoryComments(
  storyId: number,
  options: FetchOptions = {},
): Promise<CommentResult> {
  const { limit = 20, offset = 0 } = options;

  const story = await fetchItem(storyId);
  const commentIds = story.kids || [];

  if (commentIds.length === 0) {
    return {
      items: [],
      hasMore: false,
      total: 0,
    };
  }

  const slicedIds = commentIds.slice(offset, offset + limit);
  const comments = await batchFetchComments(slicedIds);

  return {
    items: comments,
    hasMore: offset + limit < commentIds.length,
    total: commentIds.length,
  };
}
