import formatDistance from 'date-fns/formatDistance/index.js';

export function prettyFormatDuration(seconds: number) {
  return formatDistance(0, seconds * 1000, { includeSeconds: true })
}
