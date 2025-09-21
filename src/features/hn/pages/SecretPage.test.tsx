import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SecretPage } from './SecretPage';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('SecretPage', () => {
  it('renders the secret message', () => {
    render(<SecretPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('Oooh-ooh..')).toBeInTheDocument();
    expect(screen.getByText("You clicked where you shouldn't have!")).toBeInTheDocument();
    expect(screen.getByText('(Probably again)')).toBeInTheDocument();
  });

  it('displays the creator credit', () => {
    render(<SecretPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('Made by Tibcsó')).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    render(<SecretPage />, { wrapper: RouterWrapper });

    const backLink = screen.getByRole('link', { name: /back to home/i });
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('has proper gradient background classes', () => {
    const { container } = render(<SecretPage />, { wrapper: RouterWrapper });

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-purple-900');
  });

  it('displays animated emoji', () => {
    render(<SecretPage />, { wrapper: RouterWrapper });

    const emoji = screen.getByText('🤫');
    expect(emoji.closest('.animate-bounce')).toBeInTheDocument();
  });

  it('includes the "You know what to do!" message', () => {
    render(<SecretPage />, { wrapper: RouterWrapper });

    expect(screen.getByText('You know what to do!')).toBeInTheDocument();
  });

  it('has proper accessibility attributes on back link', () => {
    render(<SecretPage />, { wrapper: RouterWrapper });

    const backLink = screen.getByRole('link', { name: /back to home/i });
    expect(backLink).toHaveAttribute('aria-label', 'Back to home');
  });
});