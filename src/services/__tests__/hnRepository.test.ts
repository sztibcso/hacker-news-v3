import { getTopStories, getNewStories, batchFetchItems } from '../hnRepository'

describe('HnRepository', () => {
  describe('getTopStories', () => {
    it('returns limited number of stories with metadata', async () => {
      const result = await getTopStories({ limit: 5 })
      
      expect(result.items.length).toBeLessThanOrEqual(5) // Lehet kevesebb is
      expect(result.items.length).toBeGreaterThan(0)     // De valaminek lennie kell
      expect(result.hasMore).toBeDefined()               // Boolean érték
      expect(result.total).toBeGreaterThan(0)
      
      // Ha van item, akkor legyen megfelelő struktúrája
      if (result.items.length > 0) {
        expect(result.items[0]).toHaveProperty('title')
        expect(result.items[0]).toHaveProperty('score')
        expect(result.items[0]).toHaveProperty('id')
      }
    })

    it('handles offset for pagination', async () => {
      const first = await getTopStories({ limit: 3, offset: 0 })
      const second = await getTopStories({ limit: 3, offset: 3 })
      
      expect(first.items.length).toBeGreaterThan(0)
      expect(second.items.length).toBeGreaterThan(0)
      
      // Ha mindkettőben van item, akkor különböznie kell
      if (first.items[0] && second.items[0]) {
        expect(first.items[0].id).not.toBe(second.items[0].id)
      }
    })
  })

  describe('batchFetchItems', () => {
    it('fetches available items with concurrency limit', async () => {
      const ids = [1, 8863] // Csak biztos létező ID-k
      const items = await batchFetchItems(ids, { concurrency: 2 })
      
      expect(items.length).toBeGreaterThan(0)
      expect(items.length).toBeLessThanOrEqual(2)
      expect(items.every(item => item && item.id)).toBe(true)
    })

    it('filters out null/undefined items gracefully', async () => {
      const ids = [1, 999999999, 8863] // Középen valószínűleg nem létező
      const items = await batchFetchItems(ids)
      
      expect(items.length).toBeLessThanOrEqual(3)
      expect(items.every(item => item !== null && item !== undefined)).toBe(true)
    })
  })

  describe('getNewStories', () => {
    it('returns new stories with different IDs than top stories', async () => {
      const topStories = await getTopStories({ limit: 3 })
      const newStories = await getNewStories({ limit: 3 })
      
      expect(newStories.items.length).toBeGreaterThan(0)
      expect(newStories.total).toBeGreaterThan(0)
      
      // Ha mindkettőben van story, valószínűleg különbözők lesznek
      if (topStories.items[0] && newStories.items[0]) {
        const topIds = topStories.items.map(item => item.id)
        const newIds = newStories.items.map(item => item.id)
        expect(topIds[0]).not.toBe(newIds[0]) // Első elemek különböznek
      }
    })
  })
})