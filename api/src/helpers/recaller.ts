/**
 * Just a wrapper for NodeJS 'setTimeout' function
 */
export function recall(which: () => void, inMs: number, catcher?: (ref: NodeJS.Timeout) => void) {
  console.log(`recaller::recall Will recall '${which.name}' in milliseconds:`, inMs);

  const timeout = setTimeout(which, inMs);
  if (catcher) {
    catcher(timeout);
  }
}
