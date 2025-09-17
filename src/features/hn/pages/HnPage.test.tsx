import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HnPage } from './HnPage'

describe('HnPage', () => {
  it('renders navigation and story list', async () => {
    render(<HnPage />)
    
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByText(/loading stories/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
    }, { timeout: 10000 })
  })

  it('switches between top and new stories', async () => {
    const user = userEvent.setup()
    render(<HnPage />)
    
    // Várjuk meg hogy betöltődjenek az első story-k
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
    
    // Váltás new-ra
    await user.click(screen.getByRole('tab', { name: /new stories/i }))
    
    // Ellenőrizzük hogy változott a selection
    expect(screen.getByRole('tab', { name: /new stories/i })).toHaveAttribute('aria-selected', 'true')
    
    // Várjuk meg az új story-kat
    await waitFor(() => {
      const newStories = screen.getAllByRole('article')
      expect(newStories.length).toBeGreaterThan(0)
    })
  })
})