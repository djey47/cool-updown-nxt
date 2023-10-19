/**
 * Just a wrapper for NodeJS 'setTimeout' function
 */
export function recall(which: Function, inMs: number, catcher?: (ref: number) => void) {
  console.log('recaller::recall Will recall in milliseconds:', inMs);

  const timeout = setTimeout(which, inMs);
  if (catcher) {
    catcher(timeout);
  }
}
