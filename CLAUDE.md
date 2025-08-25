# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Development server**: `npm run dev` - starts Vite dev server
- **Build**: `npm run build` - compiles TypeScript and builds for production
- **Preview**: `npm run preview` - preview production build locally
- **Lint**: `npm run lint` - runs ESLint on TypeScript/TSX files
- **Type checking**: `tsc --noEmit` - run TypeScript compiler for type checking only
- **Tests**: `npm test` - runs unit tests with Vitest
- **Test UI**: `npm run test:ui` - opens Vitest UI for interactive testing
- **Test Coverage**: `npm run test:coverage` - runs tests with coverage report

## Architecture Overview

This is a React weather application built with TypeScript, Vite, and Tailwind CSS. The architecture follows a component-context pattern:

### Core Structure
- **React Context for State Management**: Two main contexts handle application state:
  - `LocationContext` - manages selected location data with `useLocation` hook
  - `WeatherContext` - provides weather data with loading/error states using `useWeatherContext` hook
- **Custom Hooks**: Business logic extracted into reusable hooks:
  - `useWeather` - weather data fetching and transformation
  - `useGeoSearch` - city search functionality 
  - `useLocation` and `useLocationUtils` - location management utilities
- **Component Architecture**: Clean separation with components in dedicated folders
- **Utility Functions**: DRY principle applied with shared utilities for weather, date, and API operations

### Key Components  
- **Search**: City search with async autocomplete, error handling, and loading states
- **CurrentCard**: Displays current weather with loading/error states and accessibility features
- **CardList**: Shows forecast cards with expandable details and responsive design
- **Sub-components**: `DailyWeatherCard` and `WeatherDetailRow` for better component composition

### Data Flow
1. User searches for city in Search component using `useGeoSearch` hook
2. Selected location updates via `useLocation` hook 
3. `useWeather` hook observes location changes and fetches weather data from Open Meteo API
4. Weather data is processed using utility functions and distributed via WeatherContext
5. Components consume data through `useWeatherContext` with loading/error handling

### Styling
- **Tailwind CSS** with custom responsive breakpoints (mobile-first, max-width approach)
- **Component-level CSS** files for specific styling needs
- **Responsive design** with custom screen configurations

### Code Quality & Testing
- **ESLint** configured with Airbnb TypeScript rules and Prettier
- **TypeScript** strict mode enabled
- **Vitest** for unit testing with jsdom environment
- **React Testing Library** for component testing
- **Test Coverage**: Comprehensive tests for utilities, hooks, and components
- **Custom rules**: Semi-colons disabled, React import not required for JSX

### Refactoring Improvements
- **DRY Principle**: Eliminated code duplication through utility functions
- **Custom Hooks**: Business logic extracted from components for reusability  
- **Error Handling**: Proper error states and loading indicators throughout
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Type Safety**: Comprehensive TypeScript interfaces and proper error handling
- **Component Composition**: Sub-components for better maintainability

### External APIs
- **Open Meteo API**: Primary weather data source (free, no API key required)  
- **GeoDB Cities API**: Location search and geocoding (requires RapidAPI key in VITE_RAPIDAPI_KEY env var)