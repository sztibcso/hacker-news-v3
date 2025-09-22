import { Link } from 'react-router-dom';

export function SecretPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-950 dark:to-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <Link
        to="/"
        className="absolute top-8 left-8 bg-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:hover:bg-gray-700/60 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label="Back to home"
      >
        ← Back to Home
      </Link>

      <div className="text-center text-white max-w-2xl mx-auto">
        <div className="text-6xl mb-8 animate-bounce">🤫</div>

        <div className="space-y-6 text-xl leading-relaxed">
          <p className="text-3xl font-bold text-yellow-300 dark:text-yellow-400">Oooh-ooh..</p>

          <p className="text-2xl">You clicked where you shouldn't have!</p>

          <p className="text-lg text-gray-300 dark:text-gray-400">(Probably again)</p>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>

          <p className="text-xl font-semibold text-blue-300 dark:text-blue-400">
            You know what to do!
          </p>
        </div>

        <div className="mt-16 space-y-4">
          <p className="text-lg font-bold text-orange-300 dark:text-orange-400">Made by Tibcsó</p>
        </div>
      </div>
    </div>
  );
}
