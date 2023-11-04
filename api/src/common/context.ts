import { FeatureStatus, PowerStatus } from '../models/common';
import { getConfig } from './configuration';

import type { DeviceConfig } from '../models/configuration';
import type { Context, DiagnosticsContext, PerDeviceStatisticsContext, StatisticsContext } from '../models/context';
import { LastPowerAttemptReason } from '../processors/diag/models/diag';

/**
 * Singleton for application context
 */
export class AppContext {
  private static ctx: Context;

  private static deviceConfigurations: DeviceConfig[] = getConfig().devices;

  public static get() {
    if (!AppContext.ctx) {
      AppContext.ctx = AppContext.createDefault();
    }
    return AppContext.ctx;
  }

  public static resetAll() {
    AppContext.get();
    AppContext.ctx = AppContext.createDefault();
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
