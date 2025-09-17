export function timeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) {
    return 'just now';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}m ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h ago`;
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return `${days}d ago`;
  } else if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months}mo ago`;
  } else {
    const years = Math.floor(diff / 31536000);
    return `${years}y ago`;
  }
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

export function domainFromUrl(url?: string): string | null {
  if (!url) return null;
  
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}