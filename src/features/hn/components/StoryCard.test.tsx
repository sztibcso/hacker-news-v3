import { render, screen } from '@testing-library/react'
import { StoryCard } from './StoryCard'
import type { HnItem } from '../types'

// Mock dependencies
vi.mock('~/shared/utils/format', () => ({
  timeAgo: () => '1 h ago',
  domainFromUrl: (url?: string) => url ? new URL(url).hostname : null,
  pluralize: (count: number, word: string) => count === 1 ? word : `${word}s`
}))

vi.mock('~/shared/utils/domainUtils', () => ({
  getDomainInfo: (url?: string) => {
    if (!url) return { category: 'discussion', color: 'bg-gray-100', icon: '💬' }
    if (url.includes('x.com')) return { category: 'social', color: 'bg-gray-100', icon: '❌' }
    return { category: 'web', color: 'bg-gray-100', icon: '🌐' }
  }
}))

vi.mock('./StoryVisual', () => ({
  StoryVisual: ({ url }: { url?: string }) => (
    <div data-testid="story-visual">Visual for {url || 'no-url'}</div>
  )
}))

vi.mock('./StoryMetadata', () => ({
  StoryMetadata: ({ score, by }: { score: number; by: string; time: number }) => (
    <div data-testid="story-metadata">{score} points by {by}</div>
  )
}))

vi.mock('./SaveButton', () => ({
  SaveButton: () => <button data-testid="save-button">Save</button>
}))

vi.mock('../hooks/useSavedStories', () => ({
  useSavedStories: () => ({
    toggleSave: vi.fn(),
    isSaved: vi.fn().mockReturnValue(false)
  })
}))

const mockStory: HnItem = {
  id: 1,
  title: 'Test Story Title',
  url: 'https://example.com',
  score: 42,
  by: 'testuser',
  time: Math.floor(Date.now() / 1000) - 3600,
  type: 'story'
}

describe('StoryCard', () => {
  it('renders story information correctly', () => {
    render(<StoryCard story={mockStory} />)
    
    expect(screen.getByText('Test Story Title')).toBeInTheDocument()
    expect(screen.getByTestId('story-visual')).toBeInTheDocument()
    expect(screen.getByTestId('story-metadata')).toBeInTheDocument()
    expect(screen.getByTestId('save-button')).toBeInTheDocument()
  })

  it('renders external link when URL is provided', () => {
    render(<StoryCard story={mockStory} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('handles story without URL', () => {
    const storyWithoutUrl = { ...mockStory, url: undefined }
    render(<StoryCard story={storyWithoutUrl} />)
    
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('displays domain from URL', () => {
    render(<StoryCard story={mockStory} />)
    
    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<StoryCard story={mockStory} />)
    
    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('aria-labelledby', 'story-title-1')
    
    const title = screen.getByRole('link')
    expect(title).toHaveAttribute('id', 'story-title-1')
  })

  it('renders preview variant correctly', () => {
    render(<StoryCard story={mockStory} variant="preview" />)
    
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByText('Test Story Title')).toBeInTheDocument()
    expect(screen.getByTestId('story-visual')).toBeInTheDocument()
  })
})