import { getConfig } from '../../common/configuration';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';

const DIAGS_INTERVAL = getConfig().app.diagnosticsIntervalMs;

export function diag() {
  // Will log to console only as using core logger (pino)
  coreLogger.info('diag::diag Performing...');

  coreLogger.info('diag::diag Done!');

  recall(diag, DIAGS_INTERVAL);
}