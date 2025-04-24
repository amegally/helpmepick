const AMAZON_AFFILIATE_ID = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID || '';

export function generateAmazonAffiliateUrl(productName: string, url?: string): string {
  const affiliateId = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID;

  if (url) {
    // If a direct Amazon URL is provided, append the affiliate ID
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('amazon')) {
      return `${url}${url.includes('?') ? '&' : '?'}tag=${affiliateId}`;
    }
    return url;
  }

  // If no URL is provided, create a search URL with the product name
  const searchQuery = encodeURIComponent(productName);
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateId}`;
}

export function generateAmazonProductUrl(productUrl: string): string {
  try {
    // If it's already a full URL, add the affiliate tag
    const url = new URL(productUrl);
    if (url.hostname.includes('amazon.com')) {
      url.searchParams.set('tag', AMAZON_AFFILIATE_ID);
      return url.toString();
    }
    
    // If it's just a search term, generate a search URL
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