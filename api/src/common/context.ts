import type { Context } from '../models/context';

/**
 * Singleton for application context
 */
export class AppContext {
  private static ctx: Context;

  public static get() {
    if (!AppContext.ctx) {
      AppContext.ctx = AppContext.createDefault();
    }
    return AppContext.ctx;
  }

  private static createDefault(): Context {
    return {
      diagnostics: {},
    };
  }
}
