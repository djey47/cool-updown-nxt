import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';

/**
 * Context processor implementation: calls itself to execute every hour.
 */
export async function contextProcessor(isOnInit?: boolean) {
  // Will log to console only as using core logger (pino)
  coreLogger.info('context::contextProcessor Performing...');

  if (isOnInit) {
    // Load context from file if it exists
    await AppContext.restore();
  }

  // Save context to file
  await AppContext.persist();

  coreLogger.info('context::contextProcessor Done!');

  recall(contextProcessor, 3_600_000);
}
