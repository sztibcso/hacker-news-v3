import { KeyboardEvent } from 'react'
import type { StoryType } from '../types'

interface NavigationProps {
  currentType: StoryType
  onTypeChange: (type: StoryType) => void
  loading: boolean
}

const STORY_TYPES: readonly StoryType[] = ['top', 'new'] as const

const getTypeLabel = (type: StoryType): string => 
  type === 'top' ? 'Top Stories' : 'New Stories'

export function Navigation({ currentType, onTypeChange, loading }: NavigationProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, type: StoryType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onTypeChange(type)
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const nextType = currentType === 'top' ? 'new' : 'top'
      const targetButton = document.querySelector(`[data-type="${nextType}"]`) as HTMLButtonElement
      targetButton?.focus()
    }
  }

  return (
    <nav className="mb-6">
      <div 
        role="tablist" 
        className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 max-w-xs mx-auto sm:mx-0"
        aria-label="Story categories"
      >
        {STORY_TYPES.map((type) => (
          <button
            key={type}
            role="tab"
            data-type={type}
            aria-selected={currentType === type}
            disabled={loading}
            onClick={() => onTypeChange(type)}
            onKeyDown={(e) => handleKeyDown(e, type)}
            className={`
              flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-hn-orange focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${currentType === type 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }
            `}
          >
            {getTypeLabel(type)}
          </button>
        ))}
      </div>
    </nav>
  )
}