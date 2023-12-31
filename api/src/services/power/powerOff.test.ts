import { replyWithJson, replyWithItemNotFound, replyWithInternalError } from '../../common/api';
import { AppContext } from '../../common/context';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { powerOffForDevice, powerOffForDevicesScheduled } from './powerOff';
import resetMocks from '../../../config/jest/resetMocks';
import { type ExecOptions, sshExec } from '../../helpers/ssh';

import type { SSHExecCommandResponse } from 'node-ssh';
import { DeviceConfig } from '../../models/configuration';
import { getDeviceConfig } from '../../common/configuration';
import { PowerStatus } from '../../models/common';

jest.mock('../../common/api');
jest.mock('../../helpers/ssh');
jest.mock('../../common/logger', () => ({
  coreLogger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;
const replyWithInternalErrorMock = replyWithInternalError as jest.Mock;
const sshExecMock = sshExec as jest.Mock<Promise<SSHExecCommandResponse>, [c: string, dc: DeviceConfig, o: ExecOptions]>;

describe('powerOff service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  beforeEach(() => {
    AppContext.resetAll();

    resetMocks();
    replyWithJsonMock.mockReset();
    replyWithItemNotFoundMock.mockReset();
    replyWithInternalErrorMock.mockReset();
    sshExecMock.mockReset();

    sshExecMock.mockResolvedValue({
      stdout: 'stdout',
      stderr: 'stderr',
      code: 0,
      signal: null,
    });
  });

  describe('powerOffForDevice async function', () => {
    it('should shutdown specified device, update diags context and return 204', async () => {
      // given
      const deviceConfig = getDeviceConfig('0');

      // when
      await powerOffForDevice('0', defaultReply);

      // then
      const { power: { lastStopAttempt } } = AppContext.get().diagnostics['0'];
      expect(lastStopAttempt.reason).toBe('api');
      expect(lastStopAttempt.on).not.toBeUndefined();

      expect(sshExecMock).toHaveBeenCalledWith(
        'sudo -bS shutdown -h 1',
        deviceConfig,
        { password: 'pwd', exitOnFinished: true });

      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);
    });

    it('should return a 404 when device configuration does not exist', async () => {
      // given-when
      await powerOffForDevice('foo', defaultReply);

      // then
      expect(sshExecMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFoundMock).toHaveBeenCalledWith(defaultReply, 'deviceId', 'foo');
    });

    it('should do nothing and return a 204 when device power state is OFF', async () => {
      // given
      const deviceDiags = AppContext.get().diagnostics['0'];
      deviceDiags.power.state = PowerStatus.OFF;
      
      // when
      await powerOffForDevice('0', defaultReply);

      // then
      expect(sshExecMock).not.toHaveBeenCalled();
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);
    });

    it('should do nothing and return a 204 when device SSH conf is missing', async () => {
      // given
      const deviceConfig = getDeviceConfig('0');
      const previousSSHConfig = deviceConfig?.ssh;
      delete deviceConfig?.ssh;

      // when
      await powerOffForDevice('0', defaultReply);

      // then
      expect(sshExecMock).not.toHaveBeenCalled();
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);

      // restore SSH configuration
      if (deviceConfig) {
        deviceConfig.ssh = previousSSHConfig;
      }
    });

    it('should return a 500 on SSH error', async () => {
      // given
      sshExecMock.mockRejectedValue('SSH error');

      // when
      await powerOffForDevice('0', defaultReply);

      // then
      expect(replyWithInternalErrorMock).toHaveBeenCalledWith(defaultReply, 'Unable to perform shutdown via SSH: SSH error');
    });

    it('should return a 500 on SSH command failure', async () => {
      // given
      sshExecMock.mockResolvedValue({
        stdout: '',
        stderr: 'SSH command error',
        code: 1,
        signal: null,
      });
      
      // when
      await powerOffForDevice('0', defaultReply);

      // then
      expect(replyWithInternalErrorMock).toHaveBeenCalledWith(defaultReply, 'Unable to perform shutdown via SSH: SSH command error');
    });
  });

  describe('powerOffForDevicesScheduled async function', () => {
    it('should shutdown device and update diags context', () => {
      // given
      const deviceConfig = getDeviceConfig('0');

      // when
      powerOffForDevicesScheduled(['0']);

      // then
      const { power: { lastStopAttempt } } = AppContext.get().diagnostics['0'];
      expect(lastStopAttempt.reason).toBe('scheduled');
      expect(lastStopAttempt.on).not.toBeUndefined();
      expect(sshExecMock).toHaveBeenCalledWith(
        'sudo -bS shutdown -h 1',
        deviceConfig,
        { password: 'pwd', exitOnFinished: true });
    });
  });
});
