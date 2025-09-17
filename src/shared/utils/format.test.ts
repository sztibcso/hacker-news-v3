import { timeAgo, domainFromUrl, pluralize } from './format';

describe('timeAgo', () => {
  it('returns minutes for values < 1h', () => {
    const now = Math.floor(Date.now()/1000);
    expect(timeAgo(now - 5 * 60)).toMatch(/5 min/);
  });

  it('returns hours for values >= 1h', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(timeAgo(now - 2 * 60 * 60)).toMatch(/2 h/);
  });

  it('returns days for values >= 24h', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(timeAgo(now - 25 * 60 * 60)).toMatch(/1 d/);
  });
});

describe('domainFromUrl', () => {
  it('extracts domain from valid URL', () => {
    expect(domainFromUrl('https://example.com/path')).toBe('example.com');
    expect(domainFromUrl('http://news.ycombinator.com')).toBe('news.ycombinator.com');
  });

  it('returns empty string for invalid URL', () => {
    expect(domainFromUrl('not-a-url')).toBe('');
    expect(domainFromUrl('')).toBe('');
    expect(domainFromUrl(undefined)).toBe('');
  });
});

describe('pluralize', () => {
  it('returns singular for count of 1', () => {
    expect(pluralize(1, 'point')).toBe('point');
  });

  it('returns plural for other counts', () => {
    expect(pluralize(0, 'point')).toBe('points');
    expect(pluralize(5, 'point')).toBe('points');
  });
});