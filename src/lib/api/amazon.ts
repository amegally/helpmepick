const AMAZON_AFFILIATE_ID = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID || '';

export function generateAmazonAffiliateUrl(productName: string, url?: string): string {
  const affiliateId = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID;

  if (url) {
    // If a direct Amazon URL is provided, ensure it has https:// and append the affiliate ID
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      const urlObj = new URL(fullUrl);
      if (urlObj.hostname.includes('amazon')) {
        // For search URLs, ensure we don't duplicate the tag parameter
        if (urlObj.pathname === '/s' && urlObj.searchParams.has('k')) {
          urlObj.searchParams.set('tag', affiliateId || '');
          return urlObj.toString();
        }
        // For other Amazon URLs, append the tag parameter
        return `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tag=${affiliateId}`;
      }
      return fullUrl;
    } catch {
      // If URL parsing fails, treat as a search term
      const searchQuery = encodeURIComponent(url);
      return `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateId}`;
    }
  }

  // If no URL is provided, create a search URL with the product name
  const searchQuery = encodeURIComponent(productName);
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateId}`;
}

export function generateAmazonProductUrl(productUrl: string): string {
  try {
    // Ensure URL has https:// prefix
    const fullUrl = productUrl.startsWith('http') ? productUrl : `https://${productUrl}`;
    const url = new URL(fullUrl);
    
    if (url.hostname.includes('amazon.com')) {
      // For search URLs, ensure we don't duplicate the tag parameter
      if (url.pathname === '/s' && url.searchParams.has('k')) {
        url.searchParams.set('tag', AMAZON_AFFILIATE_ID);
        return url.toString();
      }
      // For other Amazon URLs, append the tag parameter
      return `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tag=${AMAZON_AFFILIATE_ID}`;
    }
    
    // If it's not an Amazon URL, treat it as a search term
    return generateAmazonAffiliateUrl(productUrl);
  } catch {
    // If URL parsing fails, treat it as a search term
    return generateAmazonAffiliateUrl(productUrl);
  }
}

export function validateAmazonUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('amazon.com');
  } catch {
    return false;
  }
} 