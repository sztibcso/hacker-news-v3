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

  it('renders all three sections', () => {
    render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('Do not click here!')).toBeInTheDocument();
    expect(screen.getByText(/Made by/)).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
  });

  it('displays creator name with styling', () => {
    render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
    
    const tibcsoText = screen.getByText('Tibcsó');
    expect(tibcsoText).toHaveClass('text-hn-orange', 'font-bold', 'text-xl', 'italic');
  });

  it('renders all navigation links', () => {
    render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
    
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news');
    expect(screen.getByRole('link', { name: 'Top' })).toHaveAttribute('href', '/top');
    expect(screen.getByRole('link', { name: 'Saved' })).toHaveAttribute('href', '/saved');
  });

  it('calls onSecretButtonClick when button is clicked', async () => {
    const user = userEvent.setup();
    render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
    
    await user.click(screen.getByRole('button', { name: /secret button/i }));
    
    expect(mockOnSecretButtonClick).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<AppFooter onSecretButtonClick={mockOnSecretButtonClick} />, { wrapper: RouterWrapper });
    
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    
    const secretButton = screen.getByRole('button');
    expect(secretButton).toHaveAttribute('aria-label', 'Secret button - do not click');
  });
});