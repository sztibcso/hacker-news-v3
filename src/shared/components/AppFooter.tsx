// src/shared/components/AppFooter.tsx

import { Link } from 'react-router-dom';

interface AppFooterProps {
  onSecretButtonClick: () => void;
  className?: string;
}

export function AppFooter({ onSecretButtonClick, className = '' }: AppFooterProps) {
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/news', label: 'News' },
    { to: '/top', label: 'Top' },
    { to: '/saved', label: 'Saved' }
  ];

  return (
    <footer className={`bg-gray-50 border-t border-gray-200 py-8 mt-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={onSecretButtonClick}
              className="bg-red-600 hover:bg-red-700 text-black font-bold px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
              type="button"
              aria-label="Secret button - do not click"
            >
              Do not click here!
            </button>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">
              Made by <span className="text-hn-orange font-bold text-xl italic">Tibcsó</span>
            </p>
          </div>

          <nav className="flex justify-center lg:justify-end" role="navigation" aria-label="Footer navigation">
            <ul className="flex flex-col flex-wrap justify-center gap-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-hn-orange transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-hn-orange focus:ring-offset-2 rounded px-2 py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}