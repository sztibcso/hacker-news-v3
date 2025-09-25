export interface HnItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  type: 'story';
  descendants?: number;
  kids?: number[];
}

export interface HnComment {
  id: number;
  by: string;
  time: number;
  text: string;
  type: 'comment';
  parent: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}

export type StoryType = 'top' | 'new';

export interface StoriesState {
  items: HnItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}

export interface CommentsState {
  items: HnComment[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}
