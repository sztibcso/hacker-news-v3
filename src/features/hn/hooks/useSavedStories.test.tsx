import { renderHook, act } from '@testing-library/react';
import { useSavedStories } from './useSavedStories';
import type { HnItem } from '../types';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const mockStory: HnItem = {
  id: 1,
  title: 'Test Story',
  url: 'https://example.com',
  score: 100,
  by: 'testuser',
  time: Math.floor(Date.now() / 1000),
  type: 'story'
};

const mockStory2: HnItem = {
  id: 2,
  title: 'Second Story',
  score: 50,
  by: 'user2',
  time: Math.floor(Date.now() / 1000) - 3600,
  type: 'story'
};

describe('useSavedStories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('initialization', () => {
    it('initializes with empty state when localStorage is empty', () => {
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.savedStories).toEqual([]);
      expect(result.current.savedCount).toBe(0);
      expect(result.current.isSaved(1)).toBe(false);
    });

    it('loads saved stories from localStorage on mount', () => {
      const savedStories = [mockStory, mockStory2];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedStories));
      
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.savedStories).toEqual(savedStories);
      expect(result.current.savedCount).toBe(2);
      expect(result.current.isSaved(1)).toBe(true);
      expect(result.current.isSaved(2)).toBe(true);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('hn-saved-stories');
    });

    it('handles corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.savedStories).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading saved stories:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('saving stories', () => {
    it('saves a new story', () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
      });
      
      expect(result.current.savedStories).toEqual([mockStory]);
      expect(result.current.savedCount).toBe(1);
      expect(result.current.isSaved(mockStory.id)).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'hn-saved-stories',
        JSON.stringify([mockStory])
      );
    });

    it('does not duplicate stories when saving same story twice', () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
        result.current.saveStory(mockStory);
      });
      
      expect(result.current.savedStories).toEqual([mockStory]);
      expect(result.current.savedCount).toBe(1);
    });

    it('adds new stories to the beginning of the list', () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
        result.current.saveStory(mockStory2);
      });
      
      expect(result.current.savedStories).toEqual([mockStory2, mockStory]);
    });
  });

  describe('unsaving stories', () => {
    it('removes a saved story', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockStory, mockStory2]));
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.unsaveStory(mockStory.id);
      });
      
      expect(result.current.savedStories).toEqual([mockStory2]);
      expect(result.current.savedCount).toBe(1);
      expect(result.current.isSaved(mockStory.id)).toBe(false);
      expect(result.current.isSaved(mockStory2.id)).toBe(true);
    });

    it('handles unsaving non-existent story gracefully', () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.unsaveStory(999);
      });
      
      expect(result.current.savedStories).toEqual([]);
      expect(result.current.savedCount).toBe(0);
    });
  });

  describe('toggle functionality', () => {
    it('saves story when not already saved', () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.toggleSave(mockStory);
      });
      
      expect(result.current.isSaved(mockStory.id)).toBe(true);
      expect(result.current.savedStories).toEqual([mockStory]);
    });

    it('unsaves story when already saved', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockStory]));
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.toggleSave(mockStory);
      });
      
      expect(result.current.isSaved(mockStory.id)).toBe(false);
      expect(result.current.savedStories).toEqual([]);
    });
  });

  describe('clear all functionality', () => {
    it('clears all saved stories', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockStory, mockStory2]));
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.clearAllSaved();
      });
      
      expect(result.current.savedStories).toEqual([]);
      expect(result.current.savedCount).toBe(0);
      expect(result.current.isSaved(mockStory.id)).toBe(false);
      expect(result.current.isSaved(mockStory2.id)).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('hn-saved-stories', '[]');
    });
  });

  describe('localStorage synchronization', () => {
    it('saves to localStorage when stories are updated', () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'hn-saved-stories',
        JSON.stringify([mockStory])
      );
    });

    it('handles localStorage write errors gracefully', () => {
      // Mock console.error to suppress error logs in test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Don't throw error in the test - we're testing error handling
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage is full');
      });
      
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
      });
      
      // Story should still be saved in memory even if localStorage fails
      expect(result.current.savedStories).toEqual([mockStory]);
      expect(consoleSpy).toHaveBeenCalledWith('Error saving stories to localStorage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('isSaved function', () => {
    it('returns true for saved stories', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockStory]));
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.isSaved(mockStory.id)).toBe(true);
    });

    it('returns false for non-saved stories', () => {
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.isSaved(mockStory.id)).toBe(false);
    });

    it('updates correctly when stories are added/removed', () => {
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.isSaved(mockStory.id)).toBe(false);
      
      act(() => {
        result.current.saveStory(mockStory);
      });
      
      expect(result.current.isSaved(mockStory.id)).toBe(true);
      
      act(() => {
        result.current.unsaveStory(mockStory.id);
      });
      
      expect(result.current.isSaved(mockStory.id)).toBe(false);
    });
  });

  describe('savedCount', () => {
    it('reflects correct count of saved stories', () => {
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.savedCount).toBe(0);
      
      act(() => {
        result.current.saveStory(mockStory);
      });
      
      expect(result.current.savedCount).toBe(1);
      
      act(() => {
        result.current.saveStory(mockStory2);
      });
      
      expect(result.current.savedCount).toBe(2);
      
      act(() => {
        result.current.unsaveStory(mockStory.id);
      });
      
      expect(result.current.savedCount).toBe(1);
    });
  });
});