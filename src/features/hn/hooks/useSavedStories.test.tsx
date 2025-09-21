import { renderHook, act, waitFor } from '@testing-library/react';
import { useSavedStories } from './useSavedStories';
import type { HnItem } from '../types';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
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
    mockLocalStorage.clear();
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
      mockLocalStorage.setItem('hn-saved-stories', JSON.stringify(savedStories));
      
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.savedStories).toEqual(savedStories);
      expect(result.current.savedCount).toBe(2);
      expect(result.current.isSaved(1)).toBe(true);
      expect(result.current.isSaved(2)).toBe(true);
    });

    it('handles corrupted localStorage data gracefully', () => {
      mockLocalStorage.setItem('hn-saved-stories', 'invalid-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const { result } = renderHook(() => useSavedStories());
      
      expect(result.current.savedStories).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('saving stories', () => {
    it('saves a new story', async () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
      });
      
      await waitFor(() => {
        expect(result.current.savedStories).toEqual([mockStory]);
        expect(result.current.savedCount).toBe(1);
        expect(result.current.isSaved(mockStory.id)).toBe(true);
      });
      
      const stored = mockLocalStorage.getItem('hn-saved-stories');
      expect(JSON.parse(stored!)).toEqual([mockStory]);
    });

    it('does not duplicate stories', async () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
        result.current.saveStory(mockStory);
      });
      
      await waitFor(() => {
        expect(result.current.savedStories).toEqual([mockStory]);
        expect(result.current.savedCount).toBe(1);
      });
    });

    it('adds new stories to the beginning', async () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
        result.current.saveStory(mockStory2);
      });
      
      await waitFor(() => {
        expect(result.current.savedStories).toEqual([mockStory2, mockStory]);
      });
    });
  });

  describe('unsaving stories', () => {
    it('removes a saved story', async () => {
      mockLocalStorage.setItem('hn-saved-stories', JSON.stringify([mockStory, mockStory2]));
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.unsaveStory(mockStory.id);
      });
      
      await waitFor(() => {
        expect(result.current.savedStories).toEqual([mockStory2]);
        expect(result.current.savedCount).toBe(1);
        expect(result.current.isSaved(mockStory.id)).toBe(false);
      });
    });

    it('handles unsaving non-existent story', async () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.unsaveStory(999);
      });
      
      await waitFor(() => {
        expect(result.current.savedStories).toEqual([]);
      });
    });
  });

  describe('toggle functionality', () => {
    it('saves story when not saved', async () => {
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.toggleSave(mockStory);
      });
      
      await waitFor(() => {
        expect(result.current.isSaved(mockStory.id)).toBe(true);
      });
    });

    it('unsaves story when already saved', async () => {
      mockLocalStorage.setItem('hn-saved-stories', JSON.stringify([mockStory]));
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.toggleSave(mockStory);
      });
      
      await waitFor(() => {
        expect(result.current.isSaved(mockStory.id)).toBe(false);
      });
    });
  });

  describe('clear all', () => {
    it('clears all saved stories', async () => {
      mockLocalStorage.setItem('hn-saved-stories', JSON.stringify([mockStory, mockStory2]));
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.clearAllSaved();
      });
      
      await waitFor(() => {
        expect(result.current.savedStories).toEqual([]);
        expect(result.current.savedCount).toBe(0);
      });
    });
  });

  describe('error handling', () => {
    it('handles localStorage write errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalSetItem = mockLocalStorage.setItem;
      
      mockLocalStorage.setItem = () => {
        throw new Error('Storage full');
      };
      
      const { result } = renderHook(() => useSavedStories());
      
      act(() => {
        result.current.saveStory(mockStory);
      });
      
      expect(consoleSpy).toHaveBeenCalled();
      
      mockLocalStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });
});