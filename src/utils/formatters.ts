/**
 * Utility formatters for UI presentation
 */

/**
 * Formats large numbers into readable compact formats (e.g. 1.2k, 45.1M)
 */
export function formatCompactNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString();
}

/**
 * Formats sentiment score with explicit plus/minus signs
 */
export function formatSentimentScore(score: number, decimals: number = 2): string {
  if (typeof score !== 'number' || isNaN(score)) return '0.00';
  const formatted = score.toFixed(decimals);
  if (score > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

/**
 * Formats raw UTC timestamp into human-readable relative time (e.g. "3h ago")
 */
export function formatRelativeTime(utcMs: number): string {
  if (!utcMs) return '';
  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - utcMs) / 1000));

  if (diffInSeconds < 60) {
    return 'just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

/**
 * Formats full date and time
 */
export function formatFullDateTime(utcMs: number): string {
  if (!utcMs) return '';
  return new Date(utcMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate long strings with ellipsis
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
