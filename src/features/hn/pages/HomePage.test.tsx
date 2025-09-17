// src/features/hn/pages/HomePage.test.tsx - Alternatív megoldás

import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';
import * as useStoriesModule from '../hooks/useStories';
import type { HnItem } from '../types';

// Mock data
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

// Mock the useStories hook
vi.mock('../hooks/useStories', () => ({
  useStories: vi.fn(),
}));

// Mock the components
vi.mock('../components/StoryCard', () => ({
  StoryCard: ({ story, variant }: { story: HnItem; variant?: string }) => (
    <div data-testid={`story-card-${variant || 'full'}`} data-story-id={story.id}>
      {story.title}
    </div>
  ),
}));

describe('HomePage', () => {
  // Get fresh mock reference in each test block
  const mockUseStories = vi.mocked(useStoriesModule.useStories);

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    mockUseStories.mockImplementation((type: 'new' | 'top') => {
      if (type === 'new') {
        return {
          items: mockNewStories,
          loading: false,
          error: null,
          hasMore: true,
          total: mockNewStories.length,
          loadMore: vi.fn(),
          refresh: vi.fn(),
        };
      }
      return {
        items: mockTopStories,
        loading: false,
        error: null,
        hasMore: true,
        total: mockTopStories.length,
        loadMore: vi.fn(),
        refresh: vi.fn(),
      };
    });
  });

  describe('layout structure', () => {
    it('renders header with title and navigation', () => {
      render(<HomePage />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Hacker News V3.0')).toBeInTheDocument();
      expect(
        screen.getByText('Discover the latest in tech, programming, and innovation'),
      ).toBeInTheDocument();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(screen.getByText('Home')).toHaveClass('text-hn-orange', 'font-semibold');
    });

    it('renders main content with two-column layout', () => {
      render(<HomePage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('🔥 Latest Stories')).toBeInTheDocument();
      expect(screen.getByText('🏆 Top Stories')).toBeInTheDocument();
    });

    it('applies correct responsive grid classes', () => {
      render(<HomePage />);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
    });
  });

  describe('navigation menu', () => {
    it('renders all navigation links', () => {
      render(<HomePage />);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      const newLink = screen.getByRole('link', { name: 'New Stories' });
      const topLink = screen.getByRole('link', { name: 'Top Stories' });
      const savedLink = screen.getByRole('link', { name: 'Saved' });

      expect(homeLink).toHaveAttribute('href', '/');
      expect(newLink).toHaveAttribute('href', '/new');
      expect(topLink).toHaveAttribute('href', '/top');
      expect(savedLink).toHaveAttribute('href', '/saved');
    });

    it('highlights current page (home)', () => {
      render(<HomePage />);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('text-hn-orange', 'font-semibold');

      const otherLinks = [
        screen.getByRole('link', { name: 'New Stories' }),
        screen.getByRole('link', { name: 'Top Stories' }),
        screen.getByRole('link', { name: 'Saved' }),
      ];

      otherLinks.forEach((link) => {
        expect(link).toHaveClass('text-gray-600');
        expect(link).not.toHaveClass('text-hn-orange');
      });
    });
  });

  describe('new stories section', () => {
    it('displays section header with status indicator', () => {
      render(<HomePage />);

      expect(screen.getByText('🔥 Latest Stories')).toBeInTheDocument();
      expect(screen.getByText('Updated just now')).toBeInTheDocument();
    });

    it('renders first 20 new stories in full variant', () => {
      render(<HomePage />);

      const fullCards = screen.getAllByTestId('story-card-full');
      expect(fullCards).toHaveLength(20);

      expect(screen.getByText('New Story 1')).toBeInTheDocument();
      expect(screen.getByText('New Story 20')).toBeInTheDocument();
      expect(screen.queryByText('New Story 21')).not.toBeInTheDocument();
    });

    it('displays "View All New Stories" button', () => {
      render(<HomePage />);

      const viewAllButton = screen.getByRole('link', { name: /view all new stories/i });
      expect(viewAllButton).toBeInTheDocument();
      expect(viewAllButton).toHaveAttribute('href', '/new');
    });

    it('applies correct column span for new stories', () => {
      render(<HomePage />);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      const newStoriesContainer = gridContainer?.querySelector('.lg\\:col-span-2');

      expect(newStoriesContainer).toBeInTheDocument();
      expect(newStoriesContainer).toHaveClass('lg:col-span-2');
    });
  });

  describe('top stories sidebar', () => {
    it('displays section header with trending indicator', () => {
      render(<HomePage />);

      expect(screen.getByText('🏆 Top Stories')).toBeInTheDocument();
      expect(screen.getByText('Trending')).toBeInTheDocument();
    });

    it('renders first 20 top stories in preview variant', () => {
      render(<HomePage />);

      const previewCards = screen.getAllByTestId('story-card-preview');
      expect(previewCards).toHaveLength(20);

      expect(screen.getByText('Top Story 1')).toBeInTheDocument();
      expect(screen.getByText('Top Story 20')).toBeInTheDocument();
      expect(screen.queryByText('Top Story 21')).not.toBeInTheDocument();
    });

    it('displays ranking numbers for top stories', () => {
      render(<HomePage />);

      const rankingElements = screen.getAllByText(/^[1-9]$|^1[0-9]$|^20$/);
      expect(rankingElements.length).toBeGreaterThan(0);
    });

    it('displays "View All Top Stories" button', () => {
      render(<HomePage />);

      const viewAllButton = screen.getByRole('link', { name: /view all top stories/i });
      expect(viewAllButton).toBeInTheDocument();
      expect(viewAllButton).toHaveAttribute('href', '/top');
    });

    it('applies sticky positioning to sidebar', () => {
      render(<HomePage />);

      const sidebarContainer = screen.getByText('🏆 Top Stories').closest('.sticky');
      expect(sidebarContainer).toHaveClass('sticky', 'top-8');
    });

    it('applies correct column span for top stories', () => {
      render(<HomePage />);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      const topStoriesContainer = gridContainer?.querySelector('.lg\\:col-span-1');

      expect(topStoriesContainer).toBeInTheDocument();
      expect(topStoriesContainer).toHaveClass('lg:col-span-1');
    });
  });

  describe('loading states', () => {
    it('shows loading skeletons for new stories when loading', () => {
      // Override the mock implementation for this test
      mockUseStories.mockImplementation((type: 'new' | 'top') => {
        if (type === 'new') {
          return {
            items: [],
            loading: true,
            error: null,
            hasMore: false,
            total: 0,
            loadMore: vi.fn(),
            refresh: vi.fn(),
          };
        }
        return {
          items: mockTopStories,
          loading: false,
          error: null,
          hasMore: true,
          total: mockTopStories.length,
          loadMore: vi.fn(),
          refresh: vi.fn(),
        };
      });

      render(<HomePage />);

      // Check for loading animations
      const loadingElements = document.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('shows loading skeletons for top stories when loading', () => {
      mockUseStories.mockImplementation((type: 'new' | 'top') => {
        if (type === 'top') {
          return {
            items: [],
            loading: true,
            error: null,
            hasMore: false,
            total: 0,
            loadMore: vi.fn(),
            refresh: vi.fn(),
          };
        }
        return {
          items: mockNewStories,
          loading: false,
          error: null,
          hasMore: true,
          total: mockNewStories.length,
          loadMore: vi.fn(),
          refresh: vi.fn(),
        };
      });

      render(<HomePage />);

      const loadingElements = document.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });
  });

  describe('responsive design', () => {
    it('stacks columns on mobile', () => {
      render(<HomePage />);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1');
    });

    it('shows two-column layout on large screens', () => {
      render(<HomePage />);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
    });

    it('adjusts header layout for different screen sizes', () => {
      render(<HomePage />);

      const headerContent = screen.getByRole('banner').querySelector('.flex');
      expect(headerContent).toHaveClass('flex-col', 'lg:flex-row');
    });
  });

  describe('accessibility', () => {
    it('has proper semantic HTML structure', () => {
      render(<HomePage />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<HomePage />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Hacker News V3.0');

      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements).toHaveLength(2);
      expect(h2Elements[0]).toHaveTextContent('🔥 Latest Stories');
      expect(h2Elements[1]).toHaveTextContent('🏆 Top Stories');
    });

    it('provides descriptive link text', () => {
      render(<HomePage />);

      const viewAllLinks = screen.getAllByRole('link', { name: /view all/i });
      expect(viewAllLinks).toHaveLength(2);
      expect(viewAllLinks[0]).toHaveAccessibleName(/view all new stories/i);
      expect(viewAllLinks[1]).toHaveAccessibleName(/view all top stories/i);
    });
  });
});
