import { timeAgo } from './format';

describe('timeAgo', () => {
  it('returns minutes for values < 1h', () => {
    const now = Math.floor(Date.now()/1000);
    expect(timeAgo(now - 5 * 60)).toMatch(/5 min/);
  });
});
