import appRootDir from 'app-root-dir';
import parseISO from 'date-fns/parseISO/index.js';
import path from 'path';
import { readFile, stat, writeFile } from 'fs/promises';
import { FeatureStatus, PowerStatus } from '../models/common';
import { getConfig } from './configuration';
import { coreLogger } from './logger';
import { initPowerCronJobs } from '../helpers/cron';

import type { DeviceConfig } from '../models/configuration';
import type { Context, DiagnosticsContext, PerDeviceStatisticsContext, PersistedContext, ScheduleContext, StatisticsContext } from '../models/context';
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
   * @returns adapted context instance, without its internals (cron jobs etc)
   */
  public static getWithoutInternals(): Context {
    const ctx = AppContext.get();
    return {
      ...ctx,
      schedules: ctx.schedules.map((sch) => ({
        ...sch,
        cronJobs: {},
      })),
    };
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
    const contextFilePath = AppContext.resolveContextFilePath();

    const persisted: PersistedContext = {
      meta: {
        persistedOn: new Date(),
      },
      contents: contextInstance,
    };

    await writeFile(contextFilePath, JSON.stringify(persisted, AppContext.contextReplacer, 2), {
      encoding: 'utf-8',
    });

    coreLogger.info('(AppContext::persist) saved context to %s', contextFilePath);
  }

  /**
   * Reads context from a file
   */
  public static async restore() {
    const contextInstance = AppContext.get();
    const contextFilePath = AppContext.resolveContextFilePath();

    try {
      const fileStat = await stat(contextFilePath);
      if (fileStat.isFile()) {
        const fileContents = await readFile(contextFilePath, { encoding: 'utf-8' });
        const persistedContents = JSON.parse(fileContents, AppContext.contextReviver) as PersistedContext;
        const { contents } = persistedContents;

        contextInstance.appInfo = contents.appInfo;
        contextInstance.diagnostics = contents.diagnostics;
        contextInstance.statistics = contents.statistics;
      }
    } catch (err) {
      coreLogger.info('(AppContext::restore) could not find persisted context in %s', contextFilePath);
    }
  }

  private static resolveContextFilePath() {
    return path.join(
      appRootDir.get(),
      'config',
      'cud-nxt-context.json');
  }

  private static createDefault(): Context {
    return {
      appInfo: {},
      diagnostics: AppContext.createDefaultDiags(),
      statistics: AppContext.createDefaultStats(),
      schedules: AppContext.createDefaultSchedules(),
    };
  }

  private static createDefaultDiags(): DiagnosticsContext {
    return AppContext.deviceConfigurations.reduce((acc: DiagnosticsContext, _dc, index) => {
      acc[String(index)] = {
        ping: {
          status: FeatureStatus.UNAVAILABLE,
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
        ssh: {
          status: FeatureStatus.UNAVAILABLE,
        },
        http: {
          status: FeatureStatus.UNAVAILABLE,
        }
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

  private static createDefaultSchedules(): ScheduleContext[] {
    const schedules =  getConfig().defaultSchedules.map((sc, i) => {
      const [powerOnJob, powerOffJob] = initPowerCronJobs(sc);
      return ({
        ...sc,
        id: `sch-${i}`,
        cronJobs: {
          powerOnJob,
          powerOffJob,
        }
      });
    });

    if (schedules.length) {
      coreLogger.info('(AppContext::createDefaultSchedules) created cron job(s) for power ON/OFF scheduling', schedules.length);
    } else {
      coreLogger.info('(AppContext::createDefaultSchedules) no cron jobs available for power ON/OFF scheduling', schedules.length);
    }

    return schedules;
  }

  private static contextReviver(key: string, value: unknown) {
    if ((key === 'on' || key.endsWith('On')) && typeof (value) === 'string') {
      return parseISO(value);
    }

    return value;
  }

  private static contextReplacer(key: string, value: unknown) {
    if (key === 'cronJobs') {
      return {};
    }

    return value;
  }
}
