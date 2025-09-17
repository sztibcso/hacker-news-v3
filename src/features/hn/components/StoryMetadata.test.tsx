import { render, screen } from '@testing-library/react';
import { StoryMetadata } from './StoryMetadata';

vi.mock('~/shared/utils/format', () => ({
  timeAgo: (timestamp: number) => {
    const diff = Date.now() / 1000 - timestamp;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  },
  pluralize: (count: number, word: string) => {
    return count === 1 ? word : `${word}s`;
  }
}));

vi.mock('~/shared/utils/domainUtils', () => ({
  getScoreColor: (score: number) => {
    if (score >= 500) return 'text-green-600 font-bold';
    if (score >= 100) return 'text-orange-600 font-semibold';
    if (score >= 50) return 'text-blue-600';
    return 'text-gray-600';
  }
}));

describe('StoryMetadata', () => {
  const baseProps = {
    score: 150,
    by: 'testuser',
    time: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
  };

  describe('full variant (default)', () => {
    it('renders all metadata elements', () => {
      render(<StoryMetadata {...baseProps} />);
      
      expect(screen.getByText('150 points')).toBeInTheDocument();
      expect(screen.getByText('by testuser')).toBeInTheDocument();
      expect(screen.getByText('1h ago')).toBeInTheDocument();
    });

    it('displays score with correct styling', () => {
      render(<StoryMetadata {...baseProps} />);
      
      const scoreElement = screen.getByText('150 points').closest('div');
      expect(scoreElement).toHaveClass('text-orange-600', 'font-semibold');
    });

    it('includes visual icons', () => {
      render(<StoryMetadata {...baseProps} />);
      
      expect(screen.getByText('▲')).toBeInTheDocument(); // Score arrow
      expect(screen.getByText('👤')).toBeInTheDocument(); // User icon
      expect(screen.getByText('⏰')).toBeInTheDocument(); // Time icon
    });

    it('handles singular vs plural points correctly', () => {
      render(<StoryMetadata {...baseProps} score={1} />);
      expect(screen.getByText('1 point')).toBeInTheDocument();
      
      render(<StoryMetadata {...baseProps} score={2} />);
      expect(screen.getByText('2 points')).toBeInTheDocument();
    });
  });

  describe('compact variant', () => {
    it('renders condensed metadata', () => {
      render(<StoryMetadata {...baseProps} variant="compact" />);
      
      expect(screen.getByText('150 pts')).toBeInTheDocument();
      expect(screen.getByText('1h ago')).toBeInTheDocument();
      expect(screen.getByText('•')).toBeInTheDocument(); // Separator
    });

    it('does not show author in compact mode', () => {
      render(<StoryMetadata {...baseProps} variant="compact" />);
      
      expect(screen.queryByText('by testuser')).not.toBeInTheDocument();
      expect(screen.queryByText('👤')).not.toBeInTheDocument();
    });

    it('applies compact styling', () => {
      render(<StoryMetadata {...baseProps} variant="compact" />);
      
      const container = screen.getByText('150 pts').closest('div');
      expect(container).toHaveClass('text-xs', 'text-gray-500');
    });
  });

  describe('score color variations', () => {
    it('applies green color for high scores (500+)', () => {
      render(<StoryMetadata {...baseProps} score={750} />);
      
      const scoreElement = screen.getByText('750 points').closest('div');
      expect(scoreElement).toHaveClass('text-green-600', 'font-bold');
    });

    it('applies orange color for medium-high scores (100-499)', () => {
      render(<StoryMetadata {...baseProps} score={250} />);
      
      const scoreElement = screen.getByText('250 points').closest('div');
      expect(scoreElement).toHaveClass('text-orange-600', 'font-semibold');
    });

    it('applies blue color for medium scores (50-99)', () => {
      render(<StoryMetadata {...baseProps} score={75} />);
      
      const scoreElement = screen.getByText('75 points').closest('div');
      expect(scoreElement).toHaveClass('text-blue-600');
    });

    it('applies gray color for low scores (<50)', () => {
      render(<StoryMetadata {...baseProps} score={25} />);
      
      const scoreElement = screen.getByText('25 points').closest('div');
      expect(scoreElement).toHaveClass('text-gray-600');
    });
  });

  describe('time formatting', () => {
    it('displays recent times correctly', () => {
      const recentTime = Math.floor(Date.now() / 1000) - 1800; // 30 min ago
      render(<StoryMetadata {...baseProps} time={recentTime} />);
      
      expect(screen.getByText('30m ago')).toBeInTheDocument();
    });

    it('displays older times correctly', () => {
      const oldTime = Math.floor(Date.now() / 1000) - 172800; // 2 days ago
      render(<StoryMetadata {...baseProps} time={oldTime} />);
      
      expect(screen.getByText('2d ago')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles zero score', () => {
      render(<StoryMetadata {...baseProps} score={0} />);
      
      expect(screen.getByText('0 points')).toBeInTheDocument();
    });

    it('handles empty username', () => {
      render(<StoryMetadata {...baseProps} by="" />);
      
      expect(screen.getByText('by')).toBeInTheDocument();
    });

    it('handles very large scores', () => {
      render(<StoryMetadata {...baseProps} score={9999} />);
      
      expect(screen.getByText('9999 points')).toBeInTheDocument();
    });
  });
});