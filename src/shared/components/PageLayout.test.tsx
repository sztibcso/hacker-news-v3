import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { PageLayout } from './PageLayout';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('PageLayout', () => {
  const mockOnNavigateToSecret = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders header, main content, and footer', () => {
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies full viewport layout structure', () => {
      const { container } = render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(container.firstChild).toHaveClass('min-h-screen', 'flex', 'flex-col');
    });

    it('wraps main content in proper container', () => {
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('flex-1', 'py-8');

      const container = mainContent.querySelector('.max-w-7xl.mx-auto.px-4');
      expect(container).toBeInTheDocument();
    });
  });

  describe('modal functionality', () => {
    it('opens modal when secret button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      const secretButton = screen.getByRole('button', { name: /secret button/i });
      await user.click(secretButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Are You sure?')).toBeInTheDocument();
    });

    it('closes modal when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      const secretButton = screen.getByRole('button', { name: /secret button/i });
      await user.click(secretButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const dialog = screen.getByRole('dialog');
      const backdrop = dialog.firstChild as Element;
      await user.click(backdrop);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls onNavigateToSecret when modal is confirmed', async () => {
      const user = userEvent.setup();
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      const secretButton = screen.getByRole('button', { name: /secret button/i });
      await user.click(secretButton);

      const yesButton = screen.getByRole('button', { name: 'Yes' });
      await user.click(yesButton);

      expect(mockOnNavigateToSecret).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('navigates to secret when Hell yea! button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      const secretButton = screen.getByRole('button', { name: /secret button/i });
      await user.click(secretButton);

      const hellYeaButton = screen.getByRole('button', { name: /Hell yea/i });
      await user.click(hellYeaButton);

      expect(mockOnNavigateToSecret).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('styling and layout', () => {
    it('applies custom className when provided', () => {
      const { container } = render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret} className="custom-layout">
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(container.firstChild).toHaveClass('custom-layout');
    });

    it('uses proper background and spacing', () => {
      const { container } = render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(container.firstChild).toHaveClass('bg-gray-50');
    });
  });

  describe('accessibility', () => {
    it('maintains proper landmark structure', () => {
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('provides proper focus management for modal', async () => {
      const user = userEvent.setup();
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      const secretButton = screen.getByRole('button', { name: /secret button/i });
      await user.click(secretButton);

      const yesButton = screen.getByRole('button', { name: 'Yes' });
      expect(yesButton).toHaveFocus();
    });
  });

  describe('children rendering', () => {
    it('renders children content correctly', () => {
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div data-testid="child-content">
            <h1>Test Page</h1>
            <p>Some content</p>
          </div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('Some content')).toBeInTheDocument();
    });

    it('handles complex nested children', () => {
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>
            <header>Page Header</header>
            <section>
              <article>Article Content</article>
            </section>
            <aside>Sidebar</aside>
          </div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(screen.getByText('Page Header')).toBeInTheDocument();
      expect(screen.getByText('Article Content')).toBeInTheDocument();
      expect(screen.getByText('Sidebar')).toBeInTheDocument();
    });
  });

  describe('modal state management', () => {
    it('keeps modal closed by default', () => {
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('handles multiple modal open/close cycles', async () => {
      const user = userEvent.setup();
      render(
        <PageLayout onNavigateToSecret={mockOnNavigateToSecret}>
          <div>Test Content</div>
        </PageLayout>,
        { wrapper: RouterWrapper },
      );

      const secretButton = screen.getByRole('button', { name: /secret button/i });

      await user.click(secretButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(secretButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const dialog = screen.getByRole('dialog');
      const backdrop = dialog.firstChild as Element;
      await user.click(backdrop);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
