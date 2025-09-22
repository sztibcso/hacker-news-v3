import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppHeader } from './AppHeader';

vi.mock('../icons/LogoMark', () => ({
  LogoMark: () => <div data-testid="logo-mark">Logo</div>,
}));

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('AppHeader', () => {
  it('renders the main title and description', () => {
    render(<AppHeader />, { wrapper: RouterWrapper });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hacker News');
    expect(
      screen.getByText(/Discover the latest in tech, programming, and innovation/i),
    ).toBeInTheDocument();
  });

  it('displays LogoMark component', () => {
    render(<AppHeader />, { wrapper: RouterWrapper });

    expect(screen.getByTestId('logo-mark')).toBeInTheDocument();
  });

  it('shows decorative emojis', () => {
    render(<AppHeader />, { wrapper: RouterWrapper });

    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<AppHeader />, { wrapper: RouterWrapper });

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
    expect(screen.getByRole('link', { name: 'Top' })).toHaveAttribute('href', '/top');
    expect(screen.getByRole('link', { name: 'Saved' })).toHaveAttribute('href', '/saved');
  });

  it('applies active styling to current page', () => {
    render(<AppHeader />, { wrapper: RouterWrapper });

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveClass('bg-gray-300', 'text-hn-orange');
  });

  it('has proper ARIA navigation label', () => {
    render(<AppHeader />, { wrapper: RouterWrapper });

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('has semantic HTML structure', () => {
    render(<AppHeader />, { wrapper: RouterWrapper });

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AppHeader className="custom-header" />, {
      wrapper: RouterWrapper,
    });

    expect(container.firstChild).toHaveClass('custom-header');
  });
});
