import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StoryList } from './StoryList'
import type { HnItem } from '../types'

// Mock the StoryCard component
vi.mock('./StoryCard', () => ({
  StoryCard: ({ story }: { story: HnItem }) => (
    <div data-testid="story-card" data-story-id={story.id}>
      {story.title}
    </div>
  )
}));

const mockStories: HnItem[] = [
  {
    id: 1,
    title: 'First Story',
    url: 'https://example.com/1',
    score: 100,
    by: 'user1',
    time: Math.floor(Date.now() / 1000) - 3600,
    type: 'story'
  },
  {
    id: 2,
    title: 'Second Story',
    score: 50,
    by: 'user2',
    time: Math.floor(Date.now() / 1000) - 7200,
    type: 'story'
  }
]

describe('StoryList', () => {
  it('renders list of stories', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
      />
    )
    
    expect(screen.getAllByTestId('story-card')).toHaveLength(2)
    expect(screen.getByText('First Story')).toBeInTheDocument()
    expect(screen.getByText('Second Story')).toBeInTheDocument()
  })

  it('renders stories with correct data attributes', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
      />
    )
    
    const storyCards = screen.getAllByTestId('story-card')
    expect(storyCards[0]).toHaveAttribute('data-story-id', '1')
    expect(storyCards[1]).toHaveAttribute('data-story-id', '2')
  })

  it('shows loading skeleton when loading and no stories', () => {
    render(
      <StoryList 
        stories={[]}
        loading={true}
        hasMore={false}
        onLoadMore={async () => {}}
      />
    )
    
    const animatedElements = document.querySelectorAll('.animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('shows empty state when no stories and not loading', () => {
    render(
      <StoryList 
        stories={[]}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
      />
    )
    
    expect(screen.getByText('No stories available.')).toBeInTheDocument()
  })

  it('shows custom empty message when provided', () => {
    render(
      <StoryList 
        stories={[]}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
        emptyMessage="Custom empty message"
      />
    )
    
    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
  })

  it('shows load more button when has more stories', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={true}
        onLoadMore={async () => {}}
      />
    )
    
    expect(screen.getAllByTestId('story-card')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
  })

  it('does not show load more button when hasMore is false', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
      />
    )
    
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
  })

  it('hides load more button when showLoadMore is false', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={true}
        onLoadMore={async () => {}}
        showLoadMore={false}
      />
    )
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onLoadMore when load more button clicked', async () => {
    const user = userEvent.setup()
    const mockLoadMore = vi.fn()
    
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={true}
        onLoadMore={mockLoadMore}
      />
    )
    
    const loadMoreButton = screen.getByRole('button', { name: /load more/i })
    await user.click(loadMoreButton)
    
    expect(mockLoadMore).toHaveBeenCalledTimes(1)
  })

  it('disables load more button when loading', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={true}
        hasMore={true}
        onLoadMore={async () => {}}
      />
    )
    
    const loadMoreButton = screen.getByRole('button', { name: /loading/i })
    expect(loadMoreButton).toBeDisabled()
    expect(loadMoreButton).toHaveTextContent('Loading...')
  })

  it('shows correct button text based on loading state', () => {
    const { rerender } = render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={true}
        onLoadMore={async () => {}}
      />
    )
    
    expect(screen.getByRole('button', { name: /load more/i })).toHaveTextContent('Load More')
    
    rerender(
      <StoryList 
        stories={mockStories}
        loading={true}
        hasMore={true}
        onLoadMore={async () => {}}
      />
    )
    
    expect(screen.getByRole('button', { name: /loading/i })).toHaveTextContent('Loading...')
  })

  it('uses custom load more text when provided', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={true}
        onLoadMore={async () => {}}
        loadMoreText="Get More Stories"
      />
    )
    
    expect(screen.getByRole('button')).toHaveTextContent('Get More Stories')
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
        className="custom-class"
      />
    )
    
    expect(container.firstChild).toHaveClass('custom-class', 'space-y-4')
  })

  it('shows ranking numbers when showRanking is true', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
        showRanking={true}
      />
    )
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('does not show ranking numbers by default', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={false}
        onLoadMore={async () => {}}
      />
    )
    
    const container = screen.getAllByTestId('story-card')[0].closest('div')?.parentElement
    expect(container?.textContent).not.toMatch(/^1$/)
  })

  it('renders correct number of skeleton items', () => {
    render(
      <StoryList 
        stories={[]}
        loading={true}
        hasMore={false}
        onLoadMore={async () => {}}
      />
    )
    
    const animatedElements = document.querySelectorAll('.animate-pulse')
    expect(animatedElements.length).toBe(5)
  })
})