/* Ping diag item */

import { ping } from '../../../helpers/systemGateway';
import { FeatureStatus } from '../../../models/common';

import type { DeviceConfig } from '../../../models/configuration';
import type { FeatureDiagnostics, PingFeatureData } from '../models/diag';

/**
 * @returns Promise with all ping diagnostics
 */
export async function pingDiag(_deviceId: string, deviceConfig: DeviceConfig): Promise<FeatureDiagnostics> {
  const pingPacketCount = 4;
  const result = await ping(deviceConfig.network.hostname, pingPacketCount);

  return {
    data: result.status === FeatureStatus.OK ? collectDataFromOutput(result.standardOutput, pingPacketCount) : undefined,
    status: result.status,
    message: result.errorOutput,
  };
}

// Only compatible with Linux output so far, as well as the ping command parameters
function collectDataFromOutput(standardOutput: string, pingPacketCount: number): PingFeatureData {
  const outputLines = standardOutput.split('\n');

  console.log({ outputLines });

  const lossStats = outputLines[pingPacketCount + 3];
  const rttStats = outputLines[pingPacketCount + 4];

  console.log({ lossStats, rttStats });

  return {
    packetLossRate: extractPacketLoss(lossStats) / 100,
    roundTripTimeMs: extractRoundTripTime(rttStats),
  };
}

// lossStats sample: '2 packets transmitted, 2 received, 0% packet loss, time 1032ms'
function extractPacketLoss(lossStats: string) {
  const rateEndPosition = lossStats.indexOf('% packet loss');
  const rateStartPosition = rateEndPosition - 3;
  const extractedRate = lossStats.substring(rateStartPosition, rateEndPosition);
  const [hundreds, tens, units] = extractedRate;

  // console.log('ping::extractPackedLoss', { hundreds, tens, units });

  if (hundreds === '1') {
    return 100;
  } else if (tens !== ' ') {
    return Number(`${tens}${units}`);
  }
  return Number(units);
}

// rttStats sample: 'rtt min/avg/max/mdev = 0.007/0.010/0.013/0.003 ms'
function extractRoundTripTime(rttStats: string) {
  const [, rttValuesPart] = rttStats.split(' = ');
  const [rawValues] = rttValuesPart.split(' ');
  const [rawMin, rawAvg, rawMax, rawMdev] = rawValues.split('/');

  // console.log('ping::extractRoundTripTime', { rttValuesPart, rawValues, rawMin, rawAvg, rawMax, rawMdev });

  return {
    average: Number(rawAvg),
    max: Number(rawMax),
    min: Number(rawMin),
    standardDeviation: Number(rawMdev),
  };
}