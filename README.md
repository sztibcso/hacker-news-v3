# Hacker News V3.0

A modern, redesigned Hacker News web application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Top & New Stories** - Switch between top-rated and newest stories
- **Infinite Loading** - Load more stories with smooth UX
- **Responsive Design** - Works on all devices
- **Accessibility** - Full keyboard navigation and screen reader support
- **Fast Performance** - Optimized API calls with concurrency limiting
- **Error Handling** - Graceful error states with retry functionality

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest (unit), React Testing Library, Playwright (E2E)
- **Mocking**: MSW (Mock Service Worker)
- **Package Manager**: pnpm

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd hacker-news-v3

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🧪 Testing

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 🏗 Architecture

```
src/
├── features/hn/          # Hacker News feature module
│   ├── components/       # UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   └── types.ts         # TypeScript interfaces
├── services/            # API layer
├── shared/              # Reusable utilities
└── test/               # Test configuration
```

## 🔧 Key Design Decisions

### API Strategy
- **Batch fetching** of story details to minimize API calls
- **Concurrency limiting** (8 parallel requests) to avoid overwhelming the API
- **AbortController** for proper cleanup on route changes

### State Management
- React hooks for local state management
- Custom `useStories` hook for data fetching logic
- No external state library needed for this scope

### UI/UX Decisions
- **Progressive loading** with skeleton states
- **Load more** button instead of infinite scroll for better UX control
- **Error boundaries** with retry functionality
- **Focus management** for accessibility

### Testing Strategy
- **Unit tests**: 84%+ coverage on business logic
- **Integration tests**: Component + hook interactions
- **E2E tests**: Critical user journeys
- **MSW mocking**: Reliable API simulation

## 🌐 Assumptions Made

1. **API Reliability**: HackerNews API occasionally returns null items - handled gracefully
2. **Performance**: 20 items per page provides good balance of performance vs UX
3. **Browser Support**: Modern browsers with ES2020 support
4. **Accessibility**: WCAG 2.1 AA compliance targeted
5. **Mobile First**: Responsive design prioritizes mobile experience

## 🚀 Production Deployment

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📈 Performance Optimizations

- **Batch API requests** with concurrency control
- **Skeleton loading states** prevent layout shift
- **Memoized components** for expensive renders
- **Efficient re-renders** with proper dependency arrays

## 🧭 Future Enhancements

- **Virtual scrolling** for very long lists
- **Service Worker** for offline support
- **Story caching** with timestamp invalidation
- **Dark mode** theme support
- **Keyboard shortcuts** for power users

## 📊 Test Coverage

Current test coverage: **84.29%**

- **Statements**: 84.29%
- **Branches**: 80%
- **Functions**: 91.66%
- **Lines**: 84.29%

## 🏆 Project Goals Achieved

✅ **Top/New story switching** with smooth transitions  
✅ **Pagination** via load more functionality  
✅ **Clean code** with proper separation of concerns  
✅ **DRY principles** with reusable components  
✅ **TDD approach** with comprehensive test suite  
✅ **Accessibility** with ARIA support and keyboard navigation  
✅ **Responsive design** for all screen sizes  
✅ **Professional documentation** with clear assumptions  

## 📄 License

MIT License - see LICENSE file for details.