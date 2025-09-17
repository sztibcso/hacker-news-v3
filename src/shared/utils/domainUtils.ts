export interface DomainInfo {
  category: string;
  color: string;
  icon: string;
}

export function getDomainInfo(url?: string): DomainInfo {
  if (!url) {
    return {
      category: 'discussion',
      color: 'bg-gray-100',
      icon: '💬'
    };
  }

  const domain = url.toLowerCase();

  // Code & Development
  if (domain.includes('github.com') || domain.includes('gitlab.com') || domain.includes('bitbucket.org')) {
    return { category: 'code', color: 'bg-purple-100', icon: '💻' };
  }

  // Video & Media
  if (domain.includes('youtube.com') || domain.includes('vimeo.com') || domain.includes('twitch.tv')) {
    return { category: 'video', color: 'bg-red-100', icon: '📺' };
  }

  // Social Media
  if (domain.includes('twitter.com') || domain.includes('x.com') || domain.includes('linkedin.com') || domain.includes('facebook.com')) {
    return { category: 'social', color: 'bg-blue-100', icon: '🐦' };
  }

  // News & Media
  if (domain.includes('nytimes.com') || domain.includes('bbc.com') || domain.includes('reuters.com') || domain.includes('techcrunch.com')) {
    return { category: 'news', color: 'bg-green-100', icon: '📰' };
  }

  // Academic & Research
  if (domain.includes('arxiv.org') || domain.includes('.edu') || domain.includes('scholar.google.com') || domain.includes('pubmed.ncbi.nlm.nih.gov')) {
    return { category: 'academic', color: 'bg-indigo-100', icon: '🎓' };
  }

  // Technology & Startups
  if (domain.includes('ycombinator.com') || domain.includes('producthunt.com') || domain.includes('angellist.com')) {
    return { category: 'startup', color: 'bg-orange-100', icon: '🚀' };
  }

  // Documentation & Blogs
  if (domain.includes('medium.com') || domain.includes('dev.to') || domain.includes('hashnode.com') || domain.includes('substack.com')) {
    return { category: 'blog', color: 'bg-yellow-100', icon: '📝' };
  }

  // Default for unknown domains
  return {
    category: 'web',
    color: 'bg-gray-100',
    icon: '🌐'
  };
}

export function getFaviconUrl(url?: string): string | null {
  if (!url) return null;
  
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

export function getScoreColor(score: number): string {
  if (score >= 500) return 'text-green-600 font-bold';
  if (score >= 100) return 'text-orange-600 font-semibold';
  if (score >= 50) return 'text-blue-600';
  return 'text-gray-600';
}