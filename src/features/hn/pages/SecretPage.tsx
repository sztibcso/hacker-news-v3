import { Link } from 'react-router-dom';

export function SecretPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-8 left-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label="Back to home"
      >
        ← Back to Home
      </Link>

      {/* Main content */}
      <div className="text-center text-white max-w-2xl mx-auto">
        
        {/* Emoji header */}
        <div className="text-6xl mb-8 animate-bounce">
          🤫
        </div>

        {/* Main message */}
        <div className="space-y-6 text-xl leading-relaxed">
          <p className="text-3xl font-bold text-yellow-300">
            Oooh-ooh..
          </p>
          
          <p className="text-2xl">
            You clicked where you shouldn't have!
          </p>
          
          <p className="text-lg text-gray-300">
            (Probably again)
          </p>
          
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
          
          <p className="text-xl font-semibold text-blue-300">
            You know what to do!
          </p>
        </div>

        {/* Footer credits */}
        <div className="mt-16 space-y-4">
          <p className="text-lg font-bold text-orange-300">
            Made by Tibcsó
          </p>
          
          <p className="text-base text-gray-400 italic">
            Still waiting for you to hire me 😉
          </p>
        </div>

        {/* Fun interactive element */}
        <div className="mt-12">
          <div className="inline-block p-4 bg-white bg-opacity-10 rounded-full backdrop-blur-sm">
            <div className="text-4xl animate-spin-slow">
              💼
            </div>
          </div>
        </div>
      </div>

      {/* Additional styling for custom animation */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}