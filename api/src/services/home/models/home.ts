import type { Context } from '../../../models/context';

export interface HomeResponse {
  package: {
    name: string;
    version: string;
  }
  context: Context;
}
