/**
 * Validates if a URL is a valid Instagram URL
 */
export function isValidInstagramURL(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Check if it's an Instagram domain
    const validDomains = [
      'instagram.com',
      'www.instagram.com',
      'm.instagram.com',
      'web.instagram.com'
    ];
    
    if (!validDomains.includes(hostname)) {
      return false;
    }
    
    // Check if it's a valid Instagram content path
    const path = parsedUrl.pathname;
    const validPaths = [
      /^\/p\/[A-Za-z0-9_-]+\/?/, // Posts
      /^\/reel\/[A-Za-z0-9_-]+\/?/, // Reels
      /^\/tv\/[A-Za-z0-9_-]+\/?/, // IGTV
      /^\/stories\/[A-Za-z0-9_.-]+\/[0-9]+\/?/, // Stories
      /^\/[A-Za-z0-9_.-]+\/?$/, // Profile
    ];
    
    return validPaths.some(pattern => pattern.test(path));
  } catch {
    return false;
  }
}

/**
 * Normalizes Instagram URL to a standard format
 */
export function normalizeInstagramURL(url: string): string {
  try {
    const parsedUrl = new URL(url);
    
    // Remove query parameters and fragments
    parsedUrl.search = '';
    parsedUrl.hash = '';
    
    // Ensure we use www.instagram.com
    parsedUrl.hostname = 'www.instagram.com';
    
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

/**
 * Extracts content type from Instagram URL
 */
export function getInstagramContentType(url: string): 'post' | 'reel' | 'story' | 'profile' | 'unknown' {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    
    if (path.startsWith('/p/')) return 'post';
    if (path.startsWith('/reel/')) return 'reel';
    if (path.startsWith('/tv/')) return 'reel'; // IGTV is treated as reel
    if (path.startsWith('/stories/')) return 'story';
    if (/^\/[A-Za-z0-9_.-]+\/?$/.test(path)) return 'profile';
    
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generates a safe filename from URL and metadata
 */
export function generateSafeFilename(url: string, extension: string = '', prefix: string = 'instagram'): string {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    const contentId = pathParts[pathParts.length - 1] || 'content';
    
    // Remove any invalid filename characters
    const safeName = contentId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    
    return `${prefix}_${safeName}_${timestamp}${extension}`;
  } catch {
    return `${prefix}_${Date.now()}${extension}`;
  }
}

/**
 * Debounce function for search/input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}
