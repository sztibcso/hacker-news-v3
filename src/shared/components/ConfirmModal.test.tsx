import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('does not render when isOpen is false', () => {
      render(
        <ConfirmModal 
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Are You sure?')).toBeInTheDocument();
    });

    it('displays both action buttons', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Hell yea!' })).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onConfirm when Yes button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      await user.click(screen.getByRole('button', { name: 'Yes' }));
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm when Hell yea! button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      await user.click(screen.getByRole('button', { name: 'Hell yea!' }));
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const backdrop = screen.getByRole('dialog').querySelector('.bg-black.bg-opacity-50');
      await user.click(backdrop!);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      await user.keyboard('{Escape}');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('has accessible heading with proper ID', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('id', 'modal-title');
      expect(heading).toHaveTextContent('Are You sure?');
    });

    it('focuses first button on open', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const firstButton = screen.getByRole('button', { name: 'Yes' });
      expect(firstButton).toHaveFocus();
    });

    it('traps focus within modal', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const yesButton = screen.getByRole('button', { name: 'Yes' });
      const hellYeaButton = screen.getByRole('button', { name: 'Hell yea!' });
      
      // Tab should move between buttons
      await user.tab();
      expect(hellYeaButton).toHaveFocus();
      
      // Tab at last element should cycle back to first
      await user.tab();
      expect(yesButton).toHaveFocus();
      
      // Shift+Tab should move backwards
      await user.tab({ shift: true });
      expect(hellYeaButton).toHaveFocus();
    });
  });

  describe('styling and layout', () => {
    it('applies custom className when provided', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          className="custom-modal"
        />
      );
      
      expect(screen.getByRole('dialog')).toHaveClass('custom-modal');
    });

    it('has proper modal overlay styling', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center');
    });

    it('styles buttons with different colors', () => {
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const yesButton = screen.getByRole('button', { name: 'Yes' });
      const hellYeaButton = screen.getByRole('button', { name: 'Hell yea!' });
      
      expect(yesButton).toHaveClass('bg-hn-orange');
      expect(hellYeaButton).toHaveClass('bg-red-600');
    });
  });

  describe('keyboard interactions', () => {
    it('supports Enter key on buttons', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const yesButton = screen.getByRole('button', { name: 'Yes' });
      yesButton.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('supports Space key on buttons', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      const hellYeaButton = screen.getByRole('button', { name: 'Hell yea!' });
      hellYeaButton.focus();
      await user.keyboard(' ');
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('body scroll prevention', () => {
    it('prevents body scroll when modal is open', () => {
      const originalOverflow = document.body.style.overflow;
      
      render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(document.body.style.overflow).toBe('hidden');
      
      // Cleanup
      document.body.style.overflow = originalOverflow;
    });

    it('restores body scroll when modal is closed', () => {
      const originalOverflow = document.body.style.overflow;
      
      const { rerender } = render(
        <ConfirmModal 
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(
        <ConfirmModal 
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      
      expect(document.body.style.overflow).toBe('unset');
      
      // Cleanup
      document.body.style.overflow = originalOverflow;
    });
  });
});