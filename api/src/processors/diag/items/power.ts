import differenceInMinutes from 'date-fns/differenceInMinutes/index.js';
import { FeatureStatus, PowerStatus } from '../../../models/common';
import type { DeviceDiagnosticsContext } from '../../../models/context';
import { LastPowerAttemptDiagnostics, LastPowerAttemptReason, type PowerDiagnostics } from '../models/diag';
import { coreLogger } from '../../../common/logger';
import { AppContext } from '../../../common/context';

// TODO see to tweak this value
const POWER_CHANGE_THRESHOLD_MINUTES = 10;

export function powerDiag(deviceId: string, diags: DeviceDiagnosticsContext): PowerDiagnostics {
    const { power, ping: { status: currentPingStatus }} = diags;
  
    // Handles case of added device having no diags yet
    let powerDiags = power;
    if (!powerDiags) {
      const { power: defaultPowerDiags } = AppContext.createDefaultDiagsForDevice();
      powerDiags = defaultPowerDiags;
    }
  
    let newPowerState: PowerStatus = PowerStatus.UNAVAILABLE;
    if (currentPingStatus === FeatureStatus.OK) {
      newPowerState =  PowerStatus.ON;
    }
    if (currentPingStatus === FeatureStatus.KO) {
      newPowerState = PowerStatus.OFF;
    }

    if (powerDiags.state !== newPowerState) {
      coreLogger.info(`{power::powerDiag} Power state change detected for device ${deviceId}: ${powerDiags.state} => ${newPowerState}`);
    }
  
    return {
      ...powerDiags,
      lastStartAttempt: registerAttempt('lastStartAttempt', newPowerState, powerDiags),
      lastStopAttempt: registerAttempt('lastStopAttempt', newPowerState, powerDiags),
      state: newPowerState,
    };
  }
  
  function registerAttempt(lastAttemptType: 'lastStartAttempt' | 'lastStopAttempt', newPowerState: PowerStatus, powerDiags: PowerDiagnostics): LastPowerAttemptDiagnostics {
    const { state: lastPowerState} = powerDiags;
    const { on: lastAttemptOn, reason: lastReason } = powerDiags[lastAttemptType];
  
    const now = new Date();
    const isPowerChangeValid = !lastAttemptOn || differenceInMinutes(now, lastAttemptOn) > POWER_CHANGE_THRESHOLD_MINUTES;

    // console.log('processors::diag::registerAttempt', lastAttemptOn && differenceInMinutes(now, lastAttemptOn));

    let newReason = lastReason;
    let shouldReasonChange = false;
    if (isPowerChangeValid
        && (
          lastAttemptType === 'lastStartAttempt'
            && newPowerState === PowerStatus.ON
            && lastPowerState === PowerStatus.OFF
          || lastAttemptType === 'lastStopAttempt'
            && newPowerState === PowerStatus.OFF
            && lastPowerState === PowerStatus.ON
        )) {
      newReason = LastPowerAttemptReason.EXTERNAL;
      shouldReasonChange = true;
    }
  
    // console.log('processors::diag::registerAttempt', { shouldReasonChange, lastAttemptType, isPowerChangeValid, newReason, newPowerState, oldPowerState: lastPowerState, lastAttemptOn, now });
  
    const newOn = shouldReasonChange && newReason === LastPowerAttemptReason.EXTERNAL ? now : lastAttemptOn;
  
    return {
      on: newOn,
      reason: newReason,
    };
  }
  