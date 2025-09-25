import type { HnItem, HnComment } from '~/features/hn/types';

export async function fetchStoryIds(type: 'top' | 'new'): Promise<number[]> {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/${type}stories.json`);
  if (!response.ok) throw new Error(`Failed to fetch ${type} stories`);
  return response.json();
}

export async function fetchItem(id: number): Promise<HnItem> {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  if (!response.ok) throw new Error(`Failed to fetch item ${id}`);
  return response.json();
}

export async function fetchComment(id: number): Promise<HnComment | null> {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  if (!response.ok) throw new Error(`Failed to fetch comment ${id}`);

  const comment = await response.json();

  if (comment.deleted || comment.dead || !comment.text) {
    return null;
  }

  return comment;
}
