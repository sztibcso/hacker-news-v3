import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StoryList } from './StoryList'
import type { HnItem } from '../types'

// Mock the StoryCard component since it has many dependencies
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
        onLoadMore={() => {}}
      />
    )
    
    expect(screen.getByRole('list')).toBeInTheDocument()
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
        onLoadMore={() => {}}
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
        onLoadMore={() => {}}
      />
    )
    
    expect(screen.getByRole('status', { name: 'Loading stories...' })).toBeInTheDocument()
    expect(screen.getByText('Loading stories...')).toBeInTheDocument()
    
    const animatedElements = document.querySelectorAll('.animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('shows stories and load more button when has more stories', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={true}
        onLoadMore={() => {}}
      />
    )
    
    expect(screen.getAllByTestId('story-card')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /load more stories/i })).toBeInTheDocument()
  })

  it('does not show load more button when hasMore is false', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={false}
        onLoadMore={() => {}}
      />
    )
    
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
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
    
    const loadMoreButton = screen.getByRole('button', { name: /load more stories/i })
    await user.click(loadMoreButton)
    
    expect(mockLoadMore).toHaveBeenCalledTimes(1)
  })

  it('disables load more button when loading', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={true}
        hasMore={true}
        onLoadMore={() => {}}
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
        onLoadMore={() => {}}
      />
    )
    
    expect(screen.getByRole('button', { name: /load more stories/i })).toBeInTheDocument()
    
    rerender(
      <StoryList 
        stories={mockStories}
        loading={true}
        hasMore={true}
        onLoadMore={() => {}}
      />
    )
    
    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(
      <StoryList 
        stories={mockStories}
        loading={false}
        hasMore={true}
        onLoadMore={() => {}}
      />
    )
    
    const container = screen.getByRole('list').closest('div')
    expect(container).toHaveClass('space-y-4')
    
    const list = screen.getByRole('list')
    expect(list).toHaveClass('space-y-4')
    
    const loadMoreButton = screen.getByRole('button')
    expect(loadMoreButton).toHaveClass('px-6', 'py-2', 'bg-hn-orange', 'text-white', 'rounded-lg')
  })

  it('handles empty stories array', () => {
    render(
      <StoryList 
        stories={[]}
        loading={false}
        hasMore={false}
        onLoadMore={() => {}}
      />
    )
    
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    expect(screen.queryAllByTestId('story-card')).toHaveLength(0)
  })

  describe('accessibility', () => {
    it('provides proper ARIA labels for loading state', () => {
      render(
        <StoryList 
          stories={[]}
          loading={true}
          hasMore={false}
          onLoadMore={() => {}}
        />
      )
      
      const loadingStatus = screen.getByRole('status')
      expect(loadingStatus).toHaveAttribute('aria-label', 'Loading stories...')
    })

    it('uses semantic list structure', () => {
      render(
        <StoryList 
          stories={mockStories}
          loading={false}
          hasMore={false}
          onLoadMore={() => {}}
        />
      )
      
      expect(screen.getByRole('list')).toBeInTheDocument()
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(2)
    })

    it('provides proper button accessibility', () => {
      render(
        <StoryList 
          stories={mockStories}
          loading={false}
          hasMore={true}
          onLoadMore={() => {}}
        />
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-hn-orange')
    })
  })

  describe('loading skeleton', () => {
    it('renders correct number of skeleton items', () => {
      render(
        <StoryList 
          stories={[]}
          loading={true}
          hasMore={false}
          onLoadMore={() => {}}
        />
      )
      
      // LoadingSkeleton should render 3 skeleton items
      const animatedElements = document.querySelectorAll('.animate-pulse')
      expect(animatedElements.length).toBeGreaterThanOrEqual(3)
    })

    it('applies correct skeleton styling', () => {
      render(
        <StoryList 
          stories={[]}
          loading={true}
          hasMore={false}
          onLoadMore={() => {}}
        />
      )
      
      const skeletonContainer = screen.getByRole('status').querySelector('.space-y-4')
      expect(skeletonContainer).toBeInTheDocument()
      
      const skeletonCards = document.querySelectorAll('.bg-white.rounded-lg.border.border-gray-200.p-4.animate-pulse')
      expect(skeletonCards.length).toBeGreaterThan(0)
    })
  })
})