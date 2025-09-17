import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppHeader } from './AppHeader';

// Wrapper component for React Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('AppHeader', () => {
  describe('rendering', () => {
    it('renders the main title and description', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hacker News V3.0');
      expect(screen.getByText('Discover the latest in tech, programming, and innovation')).toBeInTheDocument();
    });

    it('displays the logo emoji', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      expect(screen.getByText('📰')).toBeInTheDocument();
    });

    it('shows decorative elements on large screens', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      expect(screen.getByText('💻')).toBeInTheDocument();
      expect(screen.getByText('🚀')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('renders all navigation links', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Top' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Saved' })).toBeInTheDocument();
    });

    it('sets correct href attributes for navigation links', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
      expect(screen.getByRole('link', { name: 'Top' })).toHaveAttribute('href', '/top');
      expect(screen.getByRole('link', { name: 'Saved' })).toHaveAttribute('href', '/saved');
    });

    it('applies active styling to the current page', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      // Home should be active by default when on root path
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('bg-hn-orange', 'text-white');
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA navigation labels', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('menubar')).toBeInTheDocument();
    });

    it('provides proper menuitem roles for navigation items', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(4);
    });

    it('has keyboard focus support', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-hn-orange');
    });
  });

  describe('styling and layout', () => {
    it('applies custom className when provided', () => {
      const { container } = render(<AppHeader className="custom-class" />, { wrapper: RouterWrapper });
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has gradient hero section styling', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      const heroSection = screen.getByText('Hacker News V3.0').closest('.bg-gradient-to-r');
      expect(heroSection).toHaveClass('from-hn-orange', 'to-orange-600', 'text-white');
    });

    it('applies hover effects to navigation links', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      const newsLink = screen.getByRole('link', { name: 'News' });
      expect(newsLink).toHaveClass('hover:text-hn-orange', 'hover:bg-orange-50');
    });
  });

  describe('responsive design', () => {
    it('hides decorative elements on small screens', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      const decorativeContainer = screen.getByText('💻').closest('.hidden.lg\\:flex');
      expect(decorativeContainer).toHaveClass('hidden', 'lg:flex');
    });

    it('uses responsive spacing and layout', () => {
      render(<AppHeader />, { wrapper: RouterWrapper });
      
      const navigation = screen.getByRole('menubar');
      expect(navigation).toHaveClass('flex', 'space-x-8', 'py-4');
    });
  });
});