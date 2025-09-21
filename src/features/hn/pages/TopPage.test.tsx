import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TopPage } from './TopPage';
import * as useStoriesModule from '../hooks/useStories';
import type { HnItem } from '../types';

const mockStories: HnItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Top Story ${i + 1}`,
  url: `https://example.com/${i + 1}`,
  score: 500 - i * 10,
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

describe('TopPage', () => {
  const mockUseStories = vi.mocked(useStoriesModule.useStories);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header with fire emoji', () => {
    mockUseStories.mockReturnValue({
      items: mockStories,
      loading: false,
      error: null,
      hasMore: true,
      total: 20,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<TopPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('🔥 Top Stories')).toBeInTheDocument();
    expect(screen.getByText(/The most popular and trending stories/i)).toBeInTheDocument();
  });

  it('renders story list with top stories', () => {
    mockUseStories.mockReturnValue({
      items: mockStories,
      loading: false,
      error: null,
      hasMore: true,
      total: 20,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<TopPage />, { wrapper: RouterWrapper });

    expect(screen.getByTestId('story-list')).toBeInTheDocument();
    expect(screen.getByText('Top Story 1')).toBeInTheDocument();
  });

  it('enables ranking display', () => {
    mockUseStories.mockReturnValue({
      items: mockStories,
      loading: false,
      error: null,
      hasMore: true,
      total: 20,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<TopPage />, { wrapper: RouterWrapper });

    const storyList = screen.getByTestId('story-list');
    expect(storyList).toHaveAttribute('data-show-ranking', 'true');
  });

  it('shows error state when loading fails', () => {
    mockUseStories.mockReturnValue({
      items: [],
      loading: false,
      error: 'Network error',
      hasMore: false,
      total: 0,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<TopPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls useStories with "top" type', () => {
    mockUseStories.mockReturnValue({
      items: [],
      loading: false,
      error: null,
      hasMore: false,
      total: 0,
      loadMore: vi.fn(),
      refresh: vi.fn(),
    });

    render(<TopPage />, { wrapper: RouterWrapper });

    expect(mockUseStories).toHaveBeenCalledWith('top');
  });
});