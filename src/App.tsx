import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { PageLayout } from './shared/components/PageLayout';
import { HomePage } from './features/hn/pages/HomePage';
import { NewsPage } from './features/hn/pages/NewsPage';
import { TopPage } from './features/hn/pages/TopPage';
import { SavedPage } from './features/hn/pages/SavedPage';
import { SecretPage } from './features/hn/pages/SecretPage';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { SavedProvider } from './shared/contexts/SavedContext';

function AppRoutes() {
  const navigate = useNavigate();

  const handleNavigateToSecret = () => {
    navigate('/secret');
  };

  return (
    <Routes>
      {/* Main pages with header/footer layout */}
      <Route
        path="/"
        element={
          <PageLayout onNavigateToSecret={handleNavigateToSecret}>
            <HomePage />
          </PageLayout>
        }
      />
      <Route
        path="/news"
        element={
          <PageLayout onNavigateToSecret={handleNavigateToSecret}>
            <NewsPage />
          </PageLayout>
        }
      />
      <Route
        path="/top"
        element={
          <PageLayout onNavigateToSecret={handleNavigateToSecret}>
            <TopPage />
          </PageLayout>
        }
      />
      <Route
        path="/saved"
        element={
          <PageLayout onNavigateToSecret={handleNavigateToSecret}>
            <SavedPage />
          </PageLayout>
        }
      />

      {/* Secret page without header/footer */}
      <Route path="/secret" element={<SecretPage />} />

      {/* Fallback to home for unknown routes */}
      <Route
        path="*"
        element={
          <PageLayout onNavigateToSecret={handleNavigateToSecret}>
            <HomePage />
          </PageLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <SavedProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </ErrorBoundary>
    </SavedProvider>
  );
}

export default App;
