import { fetchItem, fetchStoryIds } from '../hnClient'


describe('HnClient', () => {
  it('fetchStoryIds returns array of numbers for top stories', async () => {
    const ids = await fetchStoryIds('top')
    expect(Array.isArray(ids)).toBe(true)
    expect(ids.length).toBeGreaterThan(0)
    expect(ids.every(id => typeof id === 'number')).toBe(true)
  })

  it('fetchItem returns story object with correct structure', async () => {
    const ids = await fetchStoryIds('top')
    const item = await fetchItem(ids[0])
    
    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('title')
    expect(item).toHaveProperty('by')
    expect(item).toHaveProperty('score')
    expect(item).toHaveProperty('time')
  })
})