import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from './Navigation'

describe('Navigation', () => {
  it('renders top and new story options', () => {
    render(
      <Navigation 
        currentType="top" 
        onTypeChange={() => {}} 
        loading={false} 
      />
    )
    
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /top stories/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /new stories/i })).toBeInTheDocument()
  })

  it('shows current selection correctly', () => {
    render(
      <Navigation 
        currentType="new" 
        onTypeChange={() => {}} 
        loading={false} 
      />
    )
    
    expect(screen.getByRole('tab', { name: /new stories/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /top stories/i })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onTypeChange when tab is clicked', async () => {
    const user = userEvent.setup()
    const mockOnTypeChange = vi.fn()
    
    render(
      <Navigation 
        currentType="top" 
        onTypeChange={mockOnTypeChange} 
        loading={false} 
      />
    )
    
    await user.click(screen.getByRole('tab', { name: /new stories/i }))
    expect(mockOnTypeChange).toHaveBeenCalledWith('new')
  })

  it('disables tabs when loading', () => {
    render(
      <Navigation 
        currentType="top" 
        onTypeChange={() => {}} 
        loading={true} 
      />
    )
    
    expect(screen.getByRole('tab', { name: /top stories/i })).toBeDisabled()
    expect(screen.getByRole('tab', { name: /new stories/i })).toBeDisabled()
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    const mockOnTypeChange = vi.fn()
    
    render(
      <Navigation 
        currentType="top" 
        onTypeChange={mockOnTypeChange} 
        loading={false} 
      />
    )
    
    const topTab = screen.getByRole('tab', { name: /top stories/i })
    const newTab = screen.getByRole('tab', { name: /new stories/i })
    
    await user.tab() // Focus on first tab
    expect(topTab).toHaveFocus()
    
    await user.keyboard('{ArrowRight}')
    expect(newTab).toHaveFocus()
    
    await user.keyboard('{Enter}')
    expect(mockOnTypeChange).toHaveBeenCalledWith('new')
  })
})