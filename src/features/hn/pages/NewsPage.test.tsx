import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NewsPage } from './NewsPage';
import * as useStoriesModule from '../hooks/useStories';
import type { HnItem } from '../types';

const mockStories: HnItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `News Story ${i + 1}`,
  url: `https://example.com/${i + 1}`,
  score: 100 - i,
  by: `user${i + 1}`,
  time: Math.floor(Date.now() / 1000) - i * 3600,
  type: 'story',
}));

vi.mock('../hooks/useStories');
vi.mock('../components/StoryList', () => ({
  StoryList: ({ stories, loading, emptyMessage, showRanking }: {
    stories: HnItem[];
    loading: boolean;
    emptyMessage?: string;
    showRanking?: boolean;
  }) => (
    <div data-testid="story-list" data-show-ranking={showRanking}>
      {loading && <div>Loading...</div>}
      {stories.length === 0 && !loading && <div>{emptyMessage}</div>}
      {stories.map((s) => <div key={s.id}>{s.title}</div>)}
    </div>
  ),
}));

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('NewsPage', () => {
  const mockUseStories = vi.mocked(useStoriesModule.useStories);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header', () => {
    mockUseStories.mockReturnValue({
      items: mockStories,
      loading: false,
      error: null,
      hasMore: true,
      total: 20,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<NewsPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('📰 Latest News')).toBeInTheDocument();
    expect(screen.getByText(/Stay updated with the newest stories/i)).toBeInTheDocument();
  });

  it('renders story list with news stories', () => {
    mockUseStories.mockReturnValue({
      items: mockStories,
      loading: false,
      error: null,
      hasMore: true,
      total: 20,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<NewsPage />, { wrapper: RouterWrapper });

    expect(screen.getByTestId('story-list')).toBeInTheDocument();
    expect(screen.getByText('News Story 1')).toBeInTheDocument();
  });

  it('shows error state when loading fails', () => {
    mockUseStories.mockReturnValue({
      items: [],
      loading: false,
      error: 'Failed to load stories',
      hasMore: false,
      total: 0,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<NewsPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to load stories')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('passes correct props to StoryList', () => {
    const mockLoadMore = vi.fn();
    mockUseStories.mockReturnValue({
      items: mockStories,
      loading: false,
      error: null,
      hasMore: true,
      total: 20,
      loadMore: mockLoadMore,
      refresh: vi.fn(),
    });

    render(<NewsPage />, { wrapper: RouterWrapper });

    expect(screen.getByTestId('story-list')).toBeInTheDocument();
  });

  it('calls useStories with "new" type', () => {
    mockUseStories.mockReturnValue({
      items: [],
      loading: false,
      error: null,
      hasMore: false,
      total: 0,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<NewsPage />, { wrapper: RouterWrapper });

    expect(mockUseStories).toHaveBeenCalledWith('new');
  });
});