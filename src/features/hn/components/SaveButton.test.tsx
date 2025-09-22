import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveButton } from './SaveButton';
import type { HnItem } from '../types';

const mockStory: HnItem = {
  id: 1,
  title: 'Test Story',
  url: 'https://example.com',
  score: 100,
  by: 'testuser',
  time: Math.floor(Date.now() / 1000),
  type: 'story',
};

describe('SaveButton', () => {
  const mockToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering states', () => {
    it('renders unsaved state correctly', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button', { name: 'Save story' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('☆');
      expect(button).toHaveAttribute('title', 'Save story');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveClass('bg-white', 'border-gray-300', 'text-gray-400');
    });

    it('renders saved state correctly', () => {
      render(<SaveButton story={mockStory} isSaved={true} onToggle={mockToggle} />);

      const button = screen.getByRole('button', { name: 'Remove from saved' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('★');
      expect(button).toHaveAttribute('title', 'Remove from saved');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveClass('bg-hn-orange', 'border-hn-orange', 'text-white');
    });

    it('has proper data attribute for saved state', () => {
      const { rerender } = render(
        <SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />,
      );

      expect(screen.getByRole('button')).toHaveAttribute('data-saved', 'false');

      rerender(<SaveButton story={mockStory} isSaved={true} onToggle={mockToggle} />);
      expect(screen.getByRole('button')).toHaveAttribute('data-saved', 'true');
    });
  });

  describe('size variants', () => {
    it('applies medium size classes by default', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'w-9', 'text-lg');
    });

    it('applies small size classes when specified', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} size="small" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'w-8', 'text-base');
    });
  });

  describe('user interactions', () => {
    it('calls onToggle when clicked', async () => {
      const user = userEvent.setup();

      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(1);
      expect(mockToggle).toHaveBeenCalledWith(mockStory);
    });

    it('prevents event propagation on click', async () => {
      const user = userEvent.setup();
      const parentClickHandler = vi.fn();

      render(
        <div onClick={parentClickHandler}>
          <SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />
        </div>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(1);
      expect(parentClickHandler).not.toHaveBeenCalled();
    });

    it('prevents default behavior on click', async () => {
      const user = userEvent.setup();

      render(
        <a href="/test">
          <SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />
        </a>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockToggle).toHaveBeenCalledTimes(1);
      expect(window.location.pathname).not.toBe('/test');
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes for unsaved state', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Save story');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('has proper ARIA attributes for saved state', () => {
      render(<SaveButton story={mockStory} isSaved={true} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Remove from saved');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('has keyboard focus support', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();

      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(mockToggle).toHaveBeenCalledTimes(1);
      expect(mockToggle).toHaveBeenCalledWith(mockStory);
    });
  });

  describe('visual feedback', () => {
    it('has hover state classes', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:border-hn-orange', 'hover:text-hn-orange');
    });

    it('has transition classes for smooth animations', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors', 'duration-200');
    });

    it('has proper border styling', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full', 'border-2');
    });
  });

  describe('dark mode support', () => {
    it('applies dark mode classes in unsaved state', () => {
      render(<SaveButton story={mockStory} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('dark:bg-gray-800', 'dark:border-gray-600', 'dark:text-gray-400');
    });
  });

  describe('edge cases', () => {
    it('handles story without URL', () => {
      const storyWithoutUrl: HnItem = {
        ...mockStory,
        url: undefined,
      };

      render(<SaveButton story={storyWithoutUrl} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles very long story titles', () => {
      const storyWithLongTitle: HnItem = {
        ...mockStory,
        title: 'A'.repeat(500),
      };

      render(<SaveButton story={storyWithLongTitle} isSaved={false} onToggle={mockToggle} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});
