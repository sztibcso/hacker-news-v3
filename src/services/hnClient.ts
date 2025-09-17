import type { HnItem } from '~/features/hn/types';

export async function fetchStoryIds(type: 'top' | 'new'): Promise<number[]> {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/${type}stories.json`
  );
  if (!response.ok) throw new Error(`Failed to fetch ${type} stories`);
  return response.json();
}

export async function fetchItem(id: number): Promise<HnItem> {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  if (!response.ok) throw new Error(`Failed to fetch item ${id}`);
  return response.json();
}