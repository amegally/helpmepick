const AMAZON_AFFILIATE_ID = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID;
if (!AMAZON_AFFILIATE_ID) {
  console.warn('Warning: NEXT_PUBLIC_AMAZON_AFFILIATE_ID is not set');
}

export function generateAmazonAffiliateUrl(productName: string, url?: string): string {
  if (!AMAZON_AFFILIATE_ID) {
    console.warn('Warning: NEXT_PUBLIC_AMAZON_AFFILIATE_ID is not set when generating affiliate URL');
  }

  if (url) {
    // If a direct Amazon URL is provided, ensure it has https:// and append the affiliate ID
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      const urlObj = new URL(fullUrl);
      if (urlObj.hostname.includes('amazon')) {
        // For search URLs, ensure we don't duplicate the tag parameter
        if (urlObj.pathname === '/s' && urlObj.searchParams.has('k')) {
          urlObj.searchParams.set('tag', AMAZON_AFFILIATE_ID || '');
          console.log('Generated search URL with affiliate ID:', urlObj.toString());
          return urlObj.toString();
        }
        // For other Amazon URLs, append the tag parameter
        const finalUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tag=${AMAZON_AFFILIATE_ID}`;
        console.log('Generated product URL with affiliate ID:', finalUrl);
        return finalUrl;
      }
      return fullUrl;
    } catch {
      // If URL parsing fails, treat as a search term
      const searchQuery = encodeURIComponent(url);
      const searchUrl = `https://www.amazon.com/s?k=${searchQuery}&tag=${AMAZON_AFFILIATE_ID}`;
      console.log('Generated search URL from failed parse:', searchUrl);
      return searchUrl;
    }
  }

  // If no URL is provided, create a search URL with the product name
  const searchQuery = encodeURIComponent(productName);
  const searchUrl = `https://www.amazon.com/s?k=${searchQuery}&tag=${AMAZON_AFFILIATE_ID}`;
  console.log('Generated search URL from product name:', searchUrl);
  return searchUrl;
}

export function generateAmazonProductUrl(productUrl: string): string {
  if (!AMAZON_AFFILIATE_ID) {
    console.warn('Warning: NEXT_PUBLIC_AMAZON_AFFILIATE_ID is not set when generating product URL');
  }

  try {
    // Ensure URL has https:// prefix
    const fullUrl = productUrl.startsWith('http') ? productUrl : `https://${productUrl}`;
    const url = new URL(fullUrl);
    
    if (url.hostname.includes('amazon.com')) {
      // For search URLs, ensure we don't duplicate the tag parameter
      if (url.pathname === '/s' && url.searchParams.has('k')) {
        url.searchParams.set('tag', AMAZON_AFFILIATE_ID || '');
        console.log('Generated search URL with affiliate ID:', url.toString());
        return url.toString();
      }
      // For other Amazon URLs, append the tag parameter
      const finalUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tag=${AMAZON_AFFILIATE_ID}`;
      console.log('Generated product URL with affiliate ID:', finalUrl);
      return finalUrl;
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