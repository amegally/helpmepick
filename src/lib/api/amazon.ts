const AMAZON_AFFILIATE_ID = process.env.AMAZON_AFFILIATE_ID || '';

export function generateAmazonAffiliateUrl(productName: string): string {
  // Clean and encode the product name for the URL
  const searchQuery = encodeURIComponent(productName.trim());
  
  // Create the Amazon search URL with affiliate tag
  const baseUrl = 'https://www.amazon.com/s';
  const params = new URLSearchParams({
    k: searchQuery,
    tag: AMAZON_AFFILIATE_ID,
  });

  return `${baseUrl}?${params.toString()}`;
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