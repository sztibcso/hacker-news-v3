import { NavLink } from 'react-router-dom';
import { LogoMark } from '../icons/LogoMark';

interface AppHeaderProps {
  className?: string;
}

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/news', label: 'News' },
  { to: '/top', label: 'Top' },
  { to: '/saved', label: 'Saved' },
];

const BASE_LINK_CLASSES =
  'px-3 py-2 rounded-md text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hn-orange focus-visible:ring-offset-2';

const INACTIVE_LINK_CLASSES =
  'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800';

const ACTIVE_LINK_CLASSES = 'bg-gray-300 dark:bg-gray-700 text-hn-orange shadow-sm';

export function AppHeader({ className = '' }: AppHeaderProps) {
  return (
    <header
      className={`bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800 ${className}`}
    >
      <section
        className="
          bg-gradient-to-r from-hn-orange via-orange-400 to-yellow-100 text-white py-8
          dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-950
        "
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LogoMark
              className="w-20 h-20 text-white/95 dark:text-gray-100 drop-shadow"
              showBraces={false}
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white dark:text-gray-100">
                Hacker News
              </h1>
              <p className="text-xl text-orange-100 dark:text-gray-200/80 mt-1">
                Discover the latest in tech, programming, and innovation
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-6xl opacity-70">
            <span>💻</span>
            <span>🚀</span>
            <span>⚡</span>
          </div>
        </div>
      </section>

      <nav
        className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-row justify-between">
          <ul className="flex gap-2 sm:gap-4 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${BASE_LINK_CLASSES} ${isActive ? ACTIVE_LINK_CLASSES : INACTIVE_LINK_CLASSES}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
