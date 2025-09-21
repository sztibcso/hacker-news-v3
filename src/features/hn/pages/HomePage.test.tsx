import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import * as useStoriesModule from '../hooks/useStories';
import type { HnItem } from '../types';

const mockNewStories: HnItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `New Story ${i + 1}`,
  url: `https://example.com/new/${i + 1}`,
  score: 50 + i,
  by: `user${i + 1}`,
  time: Math.floor(Date.now() / 1000) - i * 3600,
  type: 'story',
}));

const mockTopStories: HnItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: 100 + i,
  title: `Top Story ${i + 1}`,
  url: `https://example.com/top/${i + 1}`,
  score: 500 - i * 10,
  by: `topuser${i + 1}`,
  time: Math.floor(Date.now() / 1000) - i * 7200,
  type: 'story',
}));

vi.mock('../hooks/useStories');
vi.mock('../components/StoryCard', () => ({
  StoryCard: ({ story }: { story: HnItem }) => (
    <div data-testid="story-card" data-story-id={story.id}>{story.title}</div>
  ),
}));

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HomePage', () => {
  const mockUseStories = vi.mocked(useStoriesModule.useStories);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStories.mockImplementation((type: 'new' | 'top') => ({
      items: type === 'new' ? mockNewStories : mockTopStories,
      loading: false,
      error: null,
      hasMore: true,
      total: 25,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    }));
  });

  it('renders two-column layout', () => {
    render(<HomePage />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('Latest News')).toBeInTheDocument();
    expect(screen.getByText('Top Stories')).toBeInTheDocument();
  });

  it('displays first 10 new stories', () => {
    render(<HomePage />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('New Story 1')).toBeInTheDocument();
    expect(screen.getByText('New Story 10')).toBeInTheDocument();
    expect(screen.queryByText('New Story 11')).not.toBeInTheDocument();
  });

  it('displays first 10 top stories with rankings', () => {
    render(<HomePage />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('Top Story 1')).toBeInTheDocument();
    expect(screen.getByText('Top Story 10')).toBeInTheDocument();
    expect(screen.queryByText('Top Story 11')).not.toBeInTheDocument();
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows load more buttons', () => {
    render(<HomePage />, { wrapper: RouterWrapper });
    
    const newsButton = screen.getByRole('link', { name: /load more news/i });
    const topButton = screen.getByRole('link', { name: /load more top/i });
    
    expect(newsButton).toHaveAttribute('href', '/news');
    expect(topButton).toHaveAttribute('href', '/top');
  });

  it('shows loading state for new stories', () => {
    mockUseStories.mockImplementation((type) => ({
      items: type === 'new' ? [] : mockTopStories,
      loading: type === 'new',
      error: null,
      hasMore: false,
      total: 0,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    }));
    
    render(<HomePage />, { wrapper: RouterWrapper });
    
    expect(screen.getByRole('status', { name: /loading news/i })).toBeInTheDocument();
  });

  it('shows loading state for top stories', () => {
    mockUseStories.mockImplementation((type) => ({
      items: type === 'top' ? [] : mockNewStories,
      loading: type === 'top',
      error: null,
      hasMore: false,
      total: 0,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    }));
    
    render(<HomePage />, { wrapper: RouterWrapper });
    
    expect(screen.getByRole('status', { name: /loading top/i })).toBeInTheDocument();
  });

  it('shows error state when stories fail to load', () => {
    mockUseStories.mockImplementation(() => ({
      items: [],
      loading: false,
      error: 'Failed to fetch',
      hasMore: false,
      total: 0,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    }));
    
    render(<HomePage />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('Error Loading Stories')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('has proper grid layout classes', () => {
    const { container } = render(<HomePage />, { wrapper: RouterWrapper });
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-4');
  });

  it('applies sticky positioning to top stories sidebar', () => {
    render(<HomePage />, { wrapper: RouterWrapper });
    
    const sidebar = screen.getByText('Top Stories').closest('.sticky');
    expect(sidebar).toHaveClass('sticky', 'top-8');
  });
});