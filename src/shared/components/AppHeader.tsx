import { NavLink } from "react-router-dom";

interface AppHeaderProps {
  className?: string;
}

const base =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hn-orange focus-visible:ring-offset-2";
const inactive =
  "text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800";
const active = "bg-gray-100 text-orange shadow-sm";

export function AppHeader({ className = "" }: AppHeaderProps) {
  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/news", label: "News" },
    { to: "/top", label: "Top" },
    { to: "/saved", label: "Saved" },
  ];

  return (
    <header className={`bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800 ${className}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-hn-orange to-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📰</div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Hacker News V3.0</h1>
                <p className="text-xl text-orange-100 mt-1">
                  Discover the latest in tech, programming, and innovation
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="hidden lg:flex items-center gap-2 text-6xl opacity-20">
              <span>💻</span>
              <span>🚀</span>
              <span>⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-2 sm:gap-4 py-4" role="menubar">
            {navItems.map((item) => (
              <li key={item.to} role="none">
                <NavLink
                  to={item.to}
                  end={item.end}
                  role="menuitem"
                  className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
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
