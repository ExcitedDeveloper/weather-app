import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CurrentCard from '../CurrentCard/CurrentCard'

// Mock the hooks
vi.mock('../../hooks/useLocation', () => ({
  useLocation: vi.fn(),
}))

vi.mock('../../hooks/useWeatherContext', () => ({
  useWeatherContext: vi.fn(),
}))

describe('CurrentCard', () => {
  const mockCurrentWeather = {
    description: 'Clear Sky',
    icon: '01d',
    temp: '72°F',
    wind: '10',
    winddirection: 'N',
  }

  const mockLocation = {
    label: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.006,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state', async () => {
    const { useLocation } = await import('../../hooks/useLocation')
    const { useWeatherContext } = await import('../../hooks/useWeatherContext')

    vi.mocked(useLocation).mockReturnValue({
      currLocation: mockLocation,
      setCurrLocation: vi.fn(),
      setLocationFromCoords: vi.fn(),
      clearLocation: vi.fn(),
      hasValidLocation: vi.fn(),
    })

    vi.mocked(useWeatherContext).mockReturnValue({
      currentWeather: undefined,
      dailyWeather: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    })

    render(<CurrentCard />)

    expect(screen.getByText('Loading weather...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
  })

  it('should show error state', async () => {
    const { useLocation } = await import('../../hooks/useLocation')
    const { useWeatherContext } = await import('../../hooks/useWeatherContext')

    vi.mocked(useLocation).mockReturnValue({
      currLocation: mockLocation,
      setCurrLocation: vi.fn(),
      setLocationFromCoords: vi.fn(),
      clearLocation: vi.fn(),
      hasValidLocation: vi.fn(),
    })

    vi.mocked(useWeatherContext).mockReturnValue({
      currentWeather: undefined,
      dailyWeather: [],
      loading: false,
      error: 'API Error',
      refetch: vi.fn(),
    })

    render(<CurrentCard />)

    expect(screen.getByText('Error loading weather')).toBeInTheDocument()
    expect(screen.getByText('API Error')).toBeInTheDocument()
  })

  it('should render weather data correctly', async () => {
    const { useLocation } = await import('../../hooks/useLocation')
    const { useWeatherContext } = await import('../../hooks/useWeatherContext')

    vi.mocked(useLocation).mockReturnValue({
      currLocation: mockLocation,
      setCurrLocation: vi.fn(),
      setLocationFromCoords: vi.fn(),
      clearLocation: vi.fn(),
      hasValidLocation: vi.fn(),
    })

    vi.mocked(useWeatherContext).mockReturnValue({
      currentWeather: mockCurrentWeather,
      dailyWeather: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CurrentCard />)

    expect(screen.getByText('New York, NY')).toBeInTheDocument()
    expect(screen.getByText('clear sky')).toBeInTheDocument()
    expect(screen.getByText('72°F')).toBeInTheDocument()
    expect(screen.getByText('10 mph')).toBeInTheDocument()
    expect(screen.getByText('N')).toBeInTheDocument()
    expect(screen.getByAltText('Clear Sky weather icon')).toBeInTheDocument()
  })

  it('should return null when no weather data or location', async () => {
    const { useLocation } = await import('../../hooks/useLocation')
    const { useWeatherContext } = await import('../../hooks/useWeatherContext')

    vi.mocked(useLocation).mockReturnValue({
      currLocation: undefined,
      setCurrLocation: vi.fn(),
      setLocationFromCoords: vi.fn(),
      clearLocation: vi.fn(),
      hasValidLocation: vi.fn(),
    })

    vi.mocked(useWeatherContext).mockReturnValue({
      currentWeather: undefined,
      dailyWeather: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    const { container } = render(<CurrentCard />)
    expect(container.firstChild).toBeNull()
  })

  it('should have accessible weather icon', async () => {
    const { useLocation } = await import('../../hooks/useLocation')
    const { useWeatherContext } = await import('../../hooks/useWeatherContext')

    vi.mocked(useLocation).mockReturnValue({
      currLocation: mockLocation,
      setCurrLocation: vi.fn(),
      setLocationFromCoords: vi.fn(),
      clearLocation: vi.fn(),
      hasValidLocation: vi.fn(),
    })

    vi.mocked(useWeatherContext).mockReturnValue({
      currentWeather: mockCurrentWeather,
      dailyWeather: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CurrentCard />)

    const weatherIcon = screen.getByAltText('Clear Sky weather icon')
    expect(weatherIcon).toHaveAttribute(
      'src',
      expect.stringContaining('01d.png')
    )
  })
})
