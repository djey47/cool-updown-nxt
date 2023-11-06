import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';

/**
 * Context processor implementation: calls itself to execute every hour.
 */
export async function contextProcessor() {
  // Will log to console only as using core logger (pino)
  coreLogger.info('context::contextProcessor Performing...');

  if (AppContext.get().isContextPersisted) {
    // Save context to file
    await AppContext.persist();
  } else {
    // Load context from file
    await AppContext.restore();
  }

  coreLogger.info('context::contextProcessor Done!');

  recall(contextProcessor, 3_600_000);
}
