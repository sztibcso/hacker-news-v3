import { useState } from 'react'
import { Navigation } from '../components/Navigation'
import { StoryList } from '../components/StoryList'
import { useStories } from '../hooks/useStories'
import type { StoryType } from '../types'

export function HnPage() {
  const [storyType, setStoryType] = useState<StoryType>('top')
  const { items, loading, error, hasMore, loadMore, refresh } = useStories(storyType)

  const handleTypeChange = (newType: StoryType) => {
    setStoryType(newType)
  }

  const handleLoadMore = async () => {
    await loadMore()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Stories
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center sm:text-left">
            Hacker News
          </h1>
          <Navigation
            currentType={storyType}
            onTypeChange={handleTypeChange}
            loading={loading}
          />
        </header>
        
        <main>
          <StoryList
            stories={items}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </main>
      </div>
    </div>
  )
}