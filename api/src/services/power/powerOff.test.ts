import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { powerOffForDevice } from './powerOff';
import resetMocks from '../../../config/jest/resetMocks';
import { sshExec } from '../../helpers/ssh';

import type { SSHExecCommandResponse } from 'node-ssh';
import { DeviceConfig } from '../../models/configuration';
import { getDeviceConfig } from '../../common/configuration';

jest.mock('../../common/api');
jest.mock('../../helpers/ssh');

const replyWithJsonMock = replyWithJson as jest.Mock;
const sshExecMock = sshExec as jest.Mock<Promise<SSHExecCommandResponse>, [c: string, dc: DeviceConfig, wp: boolean]>;

describe('powerOff service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  beforeEach(() => {
    resetMocks();
    replyWithJsonMock.mockReset();
    sshExecMock.mockReset();
  });

  describe('powerOffForDevice async function', () => {
    it('should shutdown specified device, update diags context and return 204', async () => {
      // given
      const deviceConfig = getDeviceConfig('0');
      sshExecMock.mockResolvedValue({
        stdout: 'stdout',
        stderr: 'stderr',
        code: 0,
        signal: null,
      });

      // when
      await powerOffForDevice('0', defaultReply);

      // then
      const { power: { lastStopAttempt } } = AppContext.get().diagnostics['0'];
      expect(lastStopAttempt.reason).toBe('api');
      expect(lastStopAttempt.on).not.toBeUndefined();

      expect(sshExecMock).toHaveBeenCalledWith('sudo -bS shutdown -h 1;exit', deviceConfig);

      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);
    });

    // TODO add tests cases to improve coverage
  });
});
