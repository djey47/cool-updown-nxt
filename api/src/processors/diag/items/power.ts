import differenceInMinutes from 'date-fns/differenceInMinutes/index.js';
import { FeatureStatus, PowerStatus } from '../../../models/common';
import type { DeviceDiagnosticsContext } from '../../../models/context';
import { LastPowerAttemptDiagnostics, LastPowerAttemptReason, type PowerDiagnostics } from '../models/diag';

export function powerDiag(diags: DeviceDiagnosticsContext): PowerDiagnostics {
    const { power: powerDiags, ping: { status: currentPingStatus }} = diags;
  
    // TODO See if still necessary
    if (!powerDiags) {
      diags.power = {
        state: PowerStatus.UNAVAILABLE,
        lastStartAttempt: {
          reason: LastPowerAttemptReason.NONE,
        },
        lastStopAttempt: {
          reason: LastPowerAttemptReason.NONE,
        },
      };
    }
  
    let newPowerState: PowerStatus = PowerStatus.UNAVAILABLE;
    if (currentPingStatus === FeatureStatus.OK) {
      newPowerState =  PowerStatus.ON;
    }
    if (currentPingStatus === FeatureStatus.KO) {
      newPowerState = PowerStatus.OFF;
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
    const {on: lastAttemptOn, reason: lastReason } = powerDiags[lastAttemptType];
  
    const now = new Date();
    const isPowerChangeValid = !lastAttemptOn || differenceInMinutes(now, lastAttemptOn) > 10; // TODO see to tweak this value

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
  