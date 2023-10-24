import childProcess, { ExecException } from 'child_process';
import { FeatureStatus } from '../models/common';

/*
 * Mockable system gateway for command line calls
 */

export interface SysCommandOutput {
  error?: ExecException;
  errorOutput?: string;
  standardOutput: string;
  status: FeatureStatus;
} 

/**
 * ICMP Ping command wrapper
 * @returns Promise with the normalized result of the ping command
 */
export async function ping(host: string): Promise<SysCommandOutput> {
  return new Promise((resolve) => {
    childProcess.exec(`ping -c 2 ${host}`, (err, stdout, stderr) => {
      const isPingSuccess = !err;
      if (isPingSuccess) {
        resolve({
          standardOutput: stdout,
          status: FeatureStatus.OK,
        });
      } else {
        resolve({
          error: err,
          errorOutput: stderr,
          standardOutput: stdout,
          status: FeatureStatus.KO,
        });
      }
    });
  });
}
