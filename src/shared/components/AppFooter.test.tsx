import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AppFooter } from './AppFooter';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('AppFooter', () => {
  const mockOnSecretButtonClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders all three main sections', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      expect(screen.getByText('Do not click here!')).toBeInTheDocument();
      expect(screen.getByText(/Made by/)).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    });

    it('displays the correct "Made by" text', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      expect(screen.getByText('Made by')).toBeInTheDocument();
      expect(screen.getByText('Tibcsó')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Top' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Saved' })).toBeInTheDocument();
    });
  });

  describe('secret button functionality', () => {
    it('calls onSecretButtonClick when button is clicked', async () => {
      const user = userEvent.setup();
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const secretButton = screen.getByRole('button', { name: /secret button/i });
      await user.click(secretButton);
      
      expect(mockOnSecretButtonClick).toHaveBeenCalledTimes(1);
    });

    it('has correct button styling', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const secretButton = screen.getByRole('button', { name: /secret button/i });
      expect(secretButton).toHaveClass('bg-red-600', 'text-black', 'rounded-lg');
    });

    it('supports keyboard interaction', async () => {
      const user = userEvent.setup();
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const secretButton = screen.getByRole('button', { name: /secret button/i });
      secretButton.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnSecretButtonClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('navigation links', () => {
    it('sets correct href attributes', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
      expect(screen.getByRole('link', { name: 'Top' })).toHaveAttribute('href', '/top');
      expect(screen.getByRole('link', { name: 'Saved' })).toHaveAttribute('href', '/saved');
    });

    it('applies hover effects to links', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('hover:text-hn-orange');
    });
  });

  describe('accessibility', () => {
    it('has proper semantic structure', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    });

    it('provides accessible button label', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const secretButton = screen.getByRole('button', { name: /secret button/i });
      expect(secretButton).toHaveAttribute('aria-label', 'Secret button - do not click');
    });

    it('has keyboard focus support for all interactive elements', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const secretButton = screen.getByRole('button', { name: /secret button/i });
      const homeLink = screen.getByRole('link', { name: 'Home' });
      
      expect(secretButton).toHaveClass('focus:outline-none', 'focus:ring-2');
      expect(homeLink).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('responsive layout', () => {
    it('uses responsive flexbox classes', () => {
      const { container } = render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const mainContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(mainContainer).toBeInTheDocument();
    });

    it('applies responsive positioning for sections', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const buttonSection = screen.getByText('Do not click here!').closest('.flex');
      const linksSection = screen.getByRole('navigation').closest('.flex');
      
      expect(buttonSection).toHaveClass('justify-center', 'lg:justify-start');
      expect(linksSection).toHaveClass('justify-center', 'lg:justify-end');
    });
  });

  describe('styling', () => {
    it('applies custom className when provided', () => {
      const { container } = render(
        <AppFooter onSecretButtonClick={mockOnSecretButtonClick} className="custom-footer" />, 
        { wrapper: RouterWrapper }
      );
      
      expect(container.firstChild).toHaveClass('custom-footer');
    });

    it('has proper spacing and background', () => {
      const { container } = render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      expect(container.firstChild).toHaveClass('bg-gray-50', 'border-t', 'py-8', 'mt-12');
    });

    it('styles the "Made by" section correctly', () => {
      render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
      
      const tibcsoText = screen.getByText('Tibcsó');
      expect(tibcsoText).toHaveClass('text-hn-orange', 'font-bold');
    });
  });
});