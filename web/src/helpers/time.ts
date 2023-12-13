import formatDistance from 'date-fns/formatDistance';

export function prettyFormatDuration(seconds: number) {
  if (seconds === 0) {
    return '...';
  }
  return formatDistance(0, seconds * 1000, { includeSeconds: true });
}
