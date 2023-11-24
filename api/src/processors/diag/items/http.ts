import fetch from 'node-fetch';
import type { DeviceConfig } from '../../../models/configuration';
import type { FeatureDiagnostics } from '../models/diag';
import { FeatureStatus } from '../../../models/common';

/**
 * @returns results of HTTP diagnostics as Promise
 */
export async function httpDiag(deviceId: string, deviceConfig: DeviceConfig): Promise<FeatureDiagnostics> {
  const { http: httpConfiguration } = deviceConfig;
  if (!httpConfiguration) {
    return {
      status: FeatureStatus.UNAVAILABLE,
      message: `Device with id=${deviceId} has no configured HTTP capability.`
    };
  }

  console.log('http::httpDiag', { deviceId, httpConfiguration });

  try {
    const { status, statusText } = await fetch(httpConfiguration.url);

    if (status >= 400) {
      return {
        status: FeatureStatus.KO,
        data: {
          statusCode: status,
        },
        message: statusText,
      };
    }

    return {
      status: FeatureStatus.OK,
      data: {
        statusCode: status,
      },
      message: statusText,
    };
  } catch (error) {
    const fetchError = error as Error;
    return {
      data: fetchError,
      status: FeatureStatus.KO,
      message: fetchError.message,
    }
  }
}
