import appRootDir from 'app-root-dir';
import path from 'path';
import { writeFile } from 'fs/promises';
import { FeatureStatus, PowerStatus } from '../models/common';
import { getConfig } from './configuration';
import { coreLogger } from './logger';

import type { DeviceConfig } from '../models/configuration';
import type { Context, DiagnosticsContext, PerDeviceStatisticsContext, PersistedContext, StatisticsContext } from '../models/context';
import { LastPowerAttemptReason } from '../processors/diag/models/diag';

/**
 * Singleton for application context
 */
export class AppContext {
  private static ctx: Context;

  private static deviceConfigurations: DeviceConfig[] = getConfig().devices;

  /**
   * @returns single context instance shared by the whole app
   */
  public static get() {
    if (!AppContext.ctx) {
      AppContext.ctx = AppContext.createDefault();
    }
    return AppContext.ctx;
  }

  /**
   * Restore context to default values
   */
  public static resetAll() {
    AppContext.get();
    AppContext.ctx = AppContext.createDefault();
  }

  /**
   * Write context to a file
   */
  public static async persist() {
    const contextInstance = AppContext.get();
    const contextFilePath = path.join(appRootDir.get(), 'config', 'cud-nxt-context.json');

    const persisted: PersistedContext = {
      meta: {
        persistedOn: new Date(),
      },
      contents: contextInstance,
    };

    await writeFile(contextFilePath, JSON.stringify(persisted, null, 2), {
      encoding: 'utf-8',
    });

    coreLogger.info('AppContext::persist saved context to {}', contextFilePath);
  }

  private static createDefault(): Context {
    return {
      appInfo: {},
      diagnostics: AppContext.createDefaultDiags(),
      statistics: AppContext.createDefaultStats()
    };
  }

  private static createDefaultDiags(): DiagnosticsContext {
    return AppContext.deviceConfigurations.reduce((acc: DiagnosticsContext, _dc, index) => {
      acc[String(index)] = {
        ping: {
          current: {
            status: FeatureStatus.UNAVAILABLE,            
          }
        },
        power: {
          state: PowerStatus.UNAVAILABLE,
          lastStartAttempt: {
            reason: LastPowerAttemptReason.NONE,
          },
          lastStopAttempt: {
            reason: LastPowerAttemptReason.NONE,
          },
        },
      };
      return acc;
    }, {});
  }

  private static createDefaultStats(): StatisticsContext {
    return {      
      global: {},
      perDevice: AppContext.createDefaultStatsPerDevice(),
    };    
  }

  private static createDefaultStatsPerDevice() {
    return AppContext.deviceConfigurations.reduce((acc: PerDeviceStatisticsContext, _dc, index) => {
      acc[String(index)] = {  
        uptimeSeconds: {
          current: 0,
          overall: 0,
        },
      };
      return acc;
    }, {});
  }
}
