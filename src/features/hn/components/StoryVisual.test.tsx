import { render, screen, fireEvent } from '@testing-library/react';
import { StoryVisual } from './StoryVisual';

vi.mock('~/shared/utils/domainUtils', () => ({
  getDomainInfo: (url?: string) => {
    if (!url) return { category: 'discussion', color: 'bg-gray-100', icon: '💬' };
    if (url.includes('github')) return { category: 'code', color: 'bg-purple-100', icon: '💻' };
    if (url.includes('youtube')) return { category: 'video', color: 'bg-red-100', icon: '📺' };
    return { category: 'web', color: 'bg-gray-100', icon: '🌐' };
  },
  getFaviconUrl: (url?: string) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  }
}));

vi.mock('~/shared/utils/format', () => ({
  domainFromUrl: (url?: string) => {
    if (!url) return null;
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  }
}));

describe('StoryVisual', () => {
  describe('renders correctly', () => {
    it('displays emoji icon when no URL provided', () => {
      render(<StoryVisual />);
      
      const icon = screen.getByRole('img', { name: 'discussion' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('💬');
    });

    it('displays favicon when valid URL provided', () => {
      render(<StoryVisual url="https://github.com/example/repo" />);
      
      const favicon = screen.getByAltText('github.com favicon');
      expect(favicon).toBeInTheDocument();
      expect(favicon).toHaveAttribute('src', 'https://www.google.com/s2/favicons?domain=github.com&sz=32');
    });

    it('displays fallback icon when favicon fails to load', () => {
      render(<StoryVisual url="https://github.com/example/repo" />);
      
      const favicon = screen.getByAltText('github.com favicon');
      const icon = screen.getByRole('img', { name: 'code' });
      
      expect(favicon).toBeVisible();
      expect(icon).toHaveClass('hidden');
      
      fireEvent.error(favicon);
      
      expect(favicon).toHaveStyle({ display: 'none' });
    });
  });

  describe('size variants', () => {
    it('applies small size classes correctly', () => {
      render(<StoryVisual size="small" />);
      
      const container = screen.getByRole('img', { name: 'discussion' }).closest('div');
      expect(container).toHaveClass('w-8', 'h-8');
      expect(screen.getByRole('img', { name: 'discussion' })).toHaveClass('text-sm');
    });

    it('applies medium size classes correctly (default)', () => {
      render(<StoryVisual size="medium" />);
      
      const container = screen.getByRole('img', { name: 'discussion' }).closest('div');
      expect(container).toHaveClass('w-12', 'h-12');
      expect(screen.getByRole('img', { name: 'discussion' })).toHaveClass('text-xl');
    });

    it('applies large size classes correctly', () => {
      render(<StoryVisual size="large" />);
      
      const container = screen.getByRole('img', { name: 'discussion' }).closest('div');
      expect(container).toHaveClass('w-16', 'h-16');
      expect(screen.getByRole('img', { name: 'discussion' })).toHaveClass('text-2xl');
    });

    it('defaults to medium size when no size prop provided', () => {
      render(<StoryVisual />);
      
      const container = screen.getByRole('img', { name: 'discussion' }).closest('div');
      expect(container).toHaveClass('w-12', 'h-12');
    });
  });

  describe('domain categorization', () => {
    it('displays code icon for GitHub URLs', () => {
      render(<StoryVisual url="https://github.com/example/repo" />);
      
      const container = screen.getByRole('img', { name: 'code' }).closest('div');
      expect(container).toHaveClass('bg-purple-100');
      expect(screen.getByRole('img', { name: 'code' })).toHaveTextContent('💻');
    });

    it('displays video icon for YouTube URLs', () => {
      render(<StoryVisual url="https://youtube.com/watch?v=example" />);
      
      const container = screen.getByRole('img', { name: 'video' }).closest('div');
      expect(container).toHaveClass('bg-red-100');
      expect(screen.getByRole('img', { name: 'video' })).toHaveTextContent('📺');
    });

    it('displays web icon for unknown domains', () => {
      render(<StoryVisual url="https://unknown-domain.com/article" />);
      
      const container = screen.getByRole('img', { name: 'web' }).closest('div');
      expect(container).toHaveClass('bg-gray-100');
      expect(screen.getByRole('img', { name: 'web' })).toHaveTextContent('🌐');
    });
  });

  describe('error handling', () => {
    it('handles invalid URLs gracefully', () => {
      render(<StoryVisual url="not-a-valid-url" />);
      
      const icon = screen.getByRole('img', { name: 'web' });
      expect(icon).toBeInTheDocument();
      expect(icon).not.toHaveClass('hidden');
    });

    it('handles empty string URL', () => {
      render(<StoryVisual url="" />);
      
      const icon = screen.getByRole('img', { name: 'discussion' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('💬');
    });
  });

  describe('accessibility', () => {
    it('provides proper aria-label for icons', () => {
      render(<StoryVisual url="https://github.com/example" />);
      
      const icon = screen.getByRole('img', { name: 'code' });
      expect(icon).toHaveAttribute('aria-label', 'code');
    });

    it('provides proper alt text for favicons', () => {
      render(<StoryVisual url="https://example.com" />);
      
      const favicon = screen.getByAltText('example.com favicon');
      expect(favicon).toBeInTheDocument();
    });
  });
});