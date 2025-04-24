// Debug logging for environment variables
console.log('Amazon URL Generation Environment Check:', {
  NEXT_PUBLIC_AMAZON_AFFILIATE_ID: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID,
  AMAZON_AFFILIATE_ID: process.env.AMAZON_AFFILIATE_ID,
  NODE_ENV: process.env.NODE_ENV
});

// Try both environment variables, with a fallback
const AMAZON_AFFILIATE_ID = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID || process.env.AMAZON_AFFILIATE_ID || 'helpmepick09-20';

console.log('Using affiliate ID:', AMAZON_AFFILIATE_ID);

export function generateAmazonAffiliateUrl(productName: string, url?: string): string {
  // Debug log the inputs and final affiliate ID being used
  console.log('generateAmazonAffiliateUrl called with:', {
    productName,
    url,
    AMAZON_AFFILIATE_ID,
    env: process.env.NODE_ENV
  });

  if (!AMAZON_AFFILIATE_ID) {
    console.warn('Warning: No affiliate ID available');
  }

  if (url) {
    // If a direct Amazon URL is provided, ensure it has https:// and append the affiliate ID
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      const urlObj = new URL(fullUrl);
      if (urlObj.hostname.includes('amazon')) {
        // Always create a new URL object to manipulate parameters
        const finalUrl = new URL(fullUrl);
        // Remove any existing tag parameter
        finalUrl.searchParams.delete('tag');
        // Add our affiliate tag
        finalUrl.searchParams.append('tag', AMAZON_AFFILIATE_ID);
        const result = finalUrl.toString();
        console.log('Generated Amazon URL:', result);
        return result;
      }
      return fullUrl;
    } catch (error) {
      console.error('URL parsing error:', error);
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
  // Debug log the inputs
  console.log('generateAmazonProductUrl input:', { productUrl, AMAZON_AFFILIATE_ID });

  if (!AMAZON_AFFILIATE_ID) {
    console.warn('Warning: NEXT_PUBLIC_AMAZON_AFFILIATE_ID is not set when generating product URL');
  }

  try {
    // Ensure URL has https:// prefix
    const fullUrl = productUrl.startsWith('http') ? productUrl : `https://${productUrl}`;
    const urlObj = new URL(fullUrl);
    
    if (urlObj.hostname.includes('amazon.com')) {
      // Always create a new URL object to manipulate parameters
      const finalUrl = new URL(fullUrl);
      // Remove any existing tag parameter
      finalUrl.searchParams.delete('tag');
      // Add our affiliate tag
      finalUrl.searchParams.append('tag', AMAZON_AFFILIATE_ID || '');
      const result = finalUrl.toString();
      console.log('Generated Amazon URL:', result);
      return result;
    }
    
    // If it's not an Amazon URL, treat it as a search term
    return generateAmazonAffiliateUrl(productUrl);
  } catch (error) {
    console.error('URL parsing error:', error);
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