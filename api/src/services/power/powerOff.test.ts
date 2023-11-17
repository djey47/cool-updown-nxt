import { NodeSSH } from 'node-ssh';
import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getSSHParameters } from '../../helpers/ssh';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { powerOffForDevice } from './powerOff';
import globalMocks from '../../../config/jest/globalMocks';
import resetMocks from '../../../config/jest/resetMocks';
import { DeviceSSHConfig } from '../../models/configuration';

jest.mock('../../common/api');
jest.mock('../../helpers/ssh');

const replyWithJsonMock = replyWithJson as jest.Mock;
const getSSHParametersMock = getSSHParameters as jest.Mock;
const {
  nodesshMock: {
    connect: connectMock,
    execCommand: execCommandMock,
  },
} = globalMocks;

describe('powerOff service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  beforeEach(() => {
    resetMocks();
    replyWithJsonMock.mockReset();
    getSSHParametersMock.mockReset();
  });

  describe('powerOffForDevice async function', () => {
    it('should shutdown specified device, update diags context and return 204', async () => {
      // given
      const sshConfig: DeviceSSHConfig = {
        keyPath: '/id_rsa',
        user: 'username',
      };
      getSSHParametersMock.mockResolvedValue(sshConfig);
      execCommandMock.mockResolvedValue({
        stdout: 'stdout',
        stderr: 'stderr',
        code: 0,
      });

      // when
      await powerOffForDevice('0', defaultReply);

      // then
      const { power: { lastStopAttempt } } = AppContext.get().diagnostics['0'];
      expect(lastStopAttempt.reason).toBe('api');
      expect(lastStopAttempt.on).not.toBeUndefined();

      expect(connectMock).toHaveBeenCalledWith(sshConfig);
      expect(execCommandMock).toHaveBeenCalledWith('sudo -bS shutdown -h 1;exit', {});

      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);
    });
  });
});
