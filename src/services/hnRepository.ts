import { fetchStoryIds, fetchItem } from './hnClient';
import type { HnItem } from '~/features/hn/types';

export interface StoryResult {
  items: HnItem[];
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

async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number = 8
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(task => task()));
    results.push(...batchResults);
  }
  
  return results;
}

export async function batchFetchItems(
  ids: number[], 
  options: BatchOptions = {}
): Promise<HnItem[]> {
  const { concurrency = 8 } = options;
  
  const tasks = ids.map(id => async () => {
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

async function getStoriesByType(
  type: 'top' | 'new',
  options: FetchOptions = {}
): Promise<StoryResult> {
  const { limit = 20, offset = 0 } = options;
  
  const allIds = await fetchStoryIds(type);
  const slicedIds = allIds.slice(offset, offset + limit);
  const items = await batchFetchItems(slicedIds);
  
  return {
    items,
    hasMore: offset + limit < allIds.length,
    total: allIds.length
  };
}

export async function getTopStories(options: FetchOptions = {}) {
  return getStoriesByType('top', options);
}

export async function getNewStories(options: FetchOptions = {}) {
  return getStoriesByType('new', options);
}