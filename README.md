# Hacker News Reader

A modern, redesigned Hacker News client built with React, TypeScript, and Tailwind CSS. This project offers an enhanced user experience with improved accessibility, clean design, and dark mode support.

## Features

- **Real-time Story Feed**: Browse top and new stories from Hacker News
- **Saved Stories**: Bookmark and manage your favorite articles locally
- **Dark Mode Support**: Automatically adapts to your browser's theme preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Built with WCAG guidelines and keyboard navigation support
- **TypeScript**: Fully typed for better developer experience and fewer runtime errors

## Tech Stack

- **Frontend**: React 19, TypeScript, React Router
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks and Context API
- **Data Fetching**: Native fetch with the official Hacker News API
- **Testing**: Vitest, React Testing Library, Playwright
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, Husky

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hacker-news-v3

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run unit and integration tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier

## Dark Mode

The application automatically detects and respects your browser's theme preference. To change between light and dark mode:

1. Open your browser settings
2. Navigate to Appearance or Theme settings
3. Select your preferred theme (Light/Dark/System)
4. Refresh the Hacker News Reader page

The interface will automatically adapt to match your browser's theme.

## Project Structure

```
src/
├── features/           # Feature-based modules
│   └── hn/            # Hacker News feature
│       ├── components/ # Feature-specific components
│       ├── hooks/      # Custom hooks
│       ├── pages/      # Page components
│       └── types.ts    # TypeScript types
├── services/          # API and data layer
├── shared/            # Shared components and utilities
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts
│   ├── icons/         # Icon components
│   └── utils/         # Utility functions
└── test/              # Test configuration and setup
```

## Test Coverage

The project maintains comprehensive test coverage to ensure reliability and catch regressions early:

| Category | Statements | Branches | Functions | Lines |
|----------|-----------|----------|-----------|-------|
| Overall | 72.79% | 88.37% | 82.08% | 72.79% |
| Components | 96.9% | 94.44% | 100% | 96.9% |
| Pages | 98.98% | 92.3% | 73.33% | 98.98% |
| Services | 95.23% | 78.57% | 100% | 95.23% |

Testing is a core part of the development workflow. The test suite includes:
- Unit tests for components and utilities
- Integration tests for features
- End-to-end tests for critical user flows
- Accessibility testing

## Future Development Opportunities

### Backend Optimization

Currently, the application communicates directly with the Hacker News API, which requires multiple requests to fetch story details. This approach has some limitations:

- **Multiple API calls**: Each story requires a separate request
- **Rate limiting**: Heavy usage may hit API rate limits
- **Performance**: Initial load times can be affected by sequential requests

**Proposed solution**: Implement an intermediate backend service that:
- Aggregates story data in a single response
- Caches frequently accessed stories
- Implements pagination more efficiently
- Provides additional features like search and filtering

This optimization would significantly improve performance and user experience, especially on slower connections.

### Other Enhancements

- **Manual Theme Toggle**: Add a dedicated theme switcher in the UI
- **Story Comments**: Display and navigate comment threads
- **Advanced Filtering**: Filter by score, time, or domain
- **Offline Support**: PWA capabilities for offline reading
- **User Profiles**: View user submissions and activity

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass (`pnpm test`)
- Code is properly formatted (`pnpm format`)
- No linting errors (`pnpm lint`)
- Test coverage is maintained or improved

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Hacker News API](https://github.com/HackerNews/API) for providing the data
- The Hacker News community for creating valuable content
- All contributors who have helped improve this project

---

Made by Tibcsó