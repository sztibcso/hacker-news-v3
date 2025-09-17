export interface HnItem {
  id: number
  title: string
  url?: string
  score: number
  by: string
  time: number
  type: 'story'
}

export type StoryType = 'top' | 'new'

// Hook state interface exportálása
export interface StoriesState {
  items: HnItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  total: number
}