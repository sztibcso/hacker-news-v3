import { getDomainInfo, getFaviconUrl } from '~/shared/utils/domainUtils';
import { domainFromUrl } from '~/shared/utils/format';

interface StoryVisualProps {
  url?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizes = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12', 
  large: 'w-16 h-16'
};

const iconSizes = {
  small: 'text-sm',
  medium: 'text-xl',
  large: 'text-2xl'
};

export function StoryVisual({ url, size = 'medium' }: StoryVisualProps) {
  const domain = domainFromUrl(url);
  const domainInfo = getDomainInfo(url);
  const faviconUrl = getFaviconUrl(url);

  return (
    <div className={`flex-shrink-0 ${sizes[size]} rounded-lg ${domainInfo.color} flex items-center justify-center relative overflow-hidden`}>
      {faviconUrl ? (
        <img 
          src={faviconUrl} 
          alt={`${domain} favicon`}
          className="w-6 h-6"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
      <span 
        className={`${iconSizes[size]} ${faviconUrl ? 'hidden' : 'block'}`} 
        role="img" 
        aria-label={domainInfo.category}
      >
        {domainInfo.icon}
      </span>
    </div>
  );
}