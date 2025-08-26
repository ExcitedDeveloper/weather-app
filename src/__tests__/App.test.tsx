import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock all the components
vi.mock('../components/Search/Search', () => ({
  default: () => <div data-testid="search-component">Search Component</div>,
}))

vi.mock('../components/CurrentCard/CurrentCard', () => ({
  default: () => (
    <div data-testid="current-card-component">Current Card Component</div>
  ),
}))

vi.mock('../components/CardList/CardList', () => ({
  default: () => (
    <div data-testid="card-list-component">Card List Component</div>
  ),
}))

vi.mock('../hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({ theme: 'dark', toggleTheme: vi.fn() })),
}))

describe('App', () => {
  it('should render all main components', () => {
    render(<App />)

    expect(screen.getByTestId('search-component')).toBeInTheDocument()
    expect(screen.getByTestId('current-card-component')).toBeInTheDocument()
    expect(screen.getByTestId('card-list-component')).toBeInTheDocument()
  })

  it('should have proper semantic structure', () => {
    render(<App />)

    const header = screen.getByRole('banner')
    const main = screen.getByRole('main')

    expect(header).toBeInTheDocument()
    expect(main).toBeInTheDocument()

    // Search and Current Card should be in header
    expect(header).toContainElement(screen.getByTestId('search-component'))
    expect(header).toContainElement(
      screen.getByTestId('current-card-component')
    )

    // Card List should be in main
    expect(main).toContainElement(screen.getByTestId('card-list-component'))
  })

  it('should apply proper CSS classes for layout', () => {
    const { container } = render(<App />)

    const appContainer = container.firstChild as HTMLElement
    expect(appContainer).toHaveClass(
      'min-h-screen',
      'transition-all',
      'duration-500'
    )
  })
})
