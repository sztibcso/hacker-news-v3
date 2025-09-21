import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SavedPage } from './SavedPage';
import * as useSavedStoriesModule from '../hooks/useSavedStories';
import type { HnItem } from '../types';

const mockStories: HnItem[] = [
  {
    id: 1,
    title: 'Saved Story 1',
    url: 'https://example.com/1',
    score: 100,
    by: 'user1',
    time: Math.floor(Date.now() / 1000),
    type: 'story',
  },
  {
    id: 2,
    title: 'Saved Story 2',
    score: 50,
    by: 'user2',
    time: Math.floor(Date.now() / 1000) - 3600,
    type: 'story',
  },
];

vi.mock('../hooks/useSavedStories');
vi.mock('../components/StoryList', () => ({
  StoryList: ({ stories }: { stories: HnItem[] }) => (
    <div data-testid="story-list">
      {stories.map((s) => <div key={s.id}>{s.title}</div>)}
    </div>
  ),
}));

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('SavedPage', () => {
  const mockUseSavedStories = vi.mocked(useSavedStoriesModule.useSavedStories);
  const mockClearAllSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
  });

  it('renders page header with saved stories count', () => {
    mockUseSavedStories.mockReturnValue({
      savedStories: mockStories,
      savedCount: 2,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('📚 Saved Stories')).toBeInTheDocument();
    expect(screen.getByText('You have 2 saved stories')).toBeInTheDocument();
  });

  it('shows singular "story" for count of 1', () => {
    mockUseSavedStories.mockReturnValue({
      savedStories: [mockStories[0]],
      savedCount: 1,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('You have 1 saved story')).toBeInTheDocument();
  });

  it('renders story list when there are saved stories', () => {
    mockUseSavedStories.mockReturnValue({
      savedStories: mockStories,
      savedCount: 2,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    expect(screen.getByTestId('story-list')).toBeInTheDocument();
    expect(screen.getByText('Saved Story 1')).toBeInTheDocument();
    expect(screen.getByText('Saved Story 2')).toBeInTheDocument();
  });

  it('shows clear all button when there are saved stories', () => {
    mockUseSavedStories.mockReturnValue({
      savedStories: mockStories,
      savedCount: 2,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
  });

  it('clears all stories when clear button clicked and confirmed', async () => {
    const user = userEvent.setup();
    mockUseSavedStories.mockReturnValue({
      savedStories: mockStories,
      savedCount: 2,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove all saved stories?');
    expect(mockClearAllSaved).toHaveBeenCalledTimes(1);
  });

  it('does not clear when user cancels confirmation', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => false);
    
    mockUseSavedStories.mockReturnValue({
      savedStories: mockStories,
      savedCount: 2,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearButton);

    expect(mockClearAllSaved).not.toHaveBeenCalled();
  });

  it('shows empty state when no saved stories', () => {
    mockUseSavedStories.mockReturnValue({
      savedStories: [],
      savedCount: 0,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('No saved stories yet')).toBeInTheDocument();
    expect(screen.getByText(/Start building your reading list/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse stories/i })).toHaveAttribute('href', '/news');
  });

  it('does not show clear button when no saved stories', () => {
    mockUseSavedStories.mockReturnValue({
      savedStories: [],
      savedCount: 0,
      clearAllSaved: mockClearAllSaved,
      saveStory: vi.fn(),
      unsaveStory: vi.fn(),
      toggleSave: vi.fn(),
      isSaved: vi.fn(),
    });

    render(<SavedPage />, { wrapper: RouterWrapper });

    expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument();
  });
});