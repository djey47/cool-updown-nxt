import { FastifyReply } from 'fastify/types/reply';
import globalMocks from '../../../config/jest/globalMocks';
import resetMocks from '../../../config/jest/resetMocks';
import { replyWithInternalError, replyWithItemNotFound, replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getDefaultDeviceConfig, getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { PowerStatus } from '../../models/common';
import { DeviceConfig } from '../../models/configuration';
import { validateDeviceIdentifier } from '../common/validators';
import { powerOnForDevice, powerOnForDevicesScheduled } from './powerOn';

import type { WakeOptions } from 'wake_on_lan';

const { wakeonlanMock } = globalMocks;

jest.mock('../../common/api');
jest.mock('../../common/logger', () => ({
  coreLogger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));
jest.mock('../common/validators');

const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithInternalErrorMock = replyWithInternalError as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;
const validateDeviceIdentifierMock = validateDeviceIdentifier as jest.Mock<DeviceConfig | undefined, [string, FastifyReply?]>;

beforeEach(() => {
  wakeonlanMock.wake.mockImplementation((_a, _o, cb) => {
    cb();
  });  
  validateDeviceIdentifierMock.mockReturnValue(getDefaultDeviceConfig());
});

afterEach(() => {
  resetMocks();
  replyWithJsonMock.mockReset();
  replyWithInternalErrorMock.mockReset();
  replyWithItemNotFoundMock.mockReset();
  validateDeviceIdentifierMock.mockReset();
});

describe('powerOn service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  describe('powerOnForDevice async function', () => {

    beforeEach(() => {
      AppContext.resetAll();
      codeMock.mockReset();
      sendMock.mockReset();
    });

    it('should awake specified device, update diags context and return 204 with empty contents', async () => {
      // given
      wakeonlanMock.wake.mockImplementation((_a: string, _o: WakeOptions, cb: () => void) => {
        cb();
      });

      // when
      await powerOnForDevice('0', defaultReply);

      // then
      const { power: { lastStartAttempt }} = AppContext.get().diagnostics['0'];
      expect(lastStartAttempt.reason).toBe('api');
      expect(lastStartAttempt.on).not.toBeUndefined();
      expect(wakeonlanMock.wake).toHaveBeenCalledTimes(1);
      const [[address, options]] = wakeonlanMock.wake.mock.calls;
      expect(address).toBe('aa:bb:cc:dd:ee:ff');
      expect(options).toEqual({ address: '255.255.255.255' });
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);
    });    
    
    it('should handle wol error, update diags context and return 500 with message', async () => {
      // given
      codeMock.mockReturnValue(defaultReply);
      wakeonlanMock.wake.mockImplementation((_a: string, _o: WakeOptions, cb: (error: string) => void) => {
        cb('WOL error');
      });

      // when
      await powerOnForDevice('0', defaultReply);

      // then
      const { power: { lastStartAttempt }} = AppContext.get().diagnostics['0'];
      expect(lastStartAttempt.reason).toBe('api');
      expect(lastStartAttempt.on).not.toBeUndefined();
      expect(wakeonlanMock.wake).toHaveBeenCalledTimes(1);
      expect(replyWithInternalErrorMock).toHaveBeenCalledWith(defaultReply, 'Unable to perform wake on LAN: WOL error');
    });    
    
    it('should return 404 when device is not found', async () => {
      // given
      validateDeviceIdentifierMock.mockReturnValue(undefined);

      // when
      await powerOnForDevice('foo', defaultReply);

      // then
      expect(wakeonlanMock.wake).not.toHaveBeenCalled();
      expect(replyWithJsonMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFoundMock).not.toHaveBeenCalled();
    });    
    
    it('should not attempt to wake device nor update diags context and return 204 when already powered ON', async () => {
      // given
      AppContext.get().diagnostics['0'].power.state = PowerStatus.ON;

      // when
      await powerOnForDevice('0', defaultReply);

      // then
      const { power: { lastStartAttempt }} = AppContext.get().diagnostics['0'];
      expect(lastStartAttempt.reason).toBe('none');
      expect(lastStartAttempt.on).toBeUndefined();
      expect(wakeonlanMock.wake).not.toHaveBeenCalled();
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);
    });
  });

  describe('powerOnForDevicesScheduled async function', () => {
    it('should awake specified device', async () => {
      // given
      AppContext.get().diagnostics['0'].power.state = PowerStatus.OFF;

      // when
      await powerOnForDevicesScheduled(['0']);

      // then
      const { power: { lastStartAttempt }} = AppContext.get().diagnostics['0'];
      expect(lastStartAttempt.reason).toBe('scheduled');
      expect(wakeonlanMock.wake).toHaveBeenCalledTimes(1);
    });
 
    it('should handle invalid device identifier', async () => {
      // given
      validateDeviceIdentifierMock.mockReturnValue(undefined);

      // when
      await powerOnForDevicesScheduled(['0']);

      // then
      expect(wakeonlanMock.wake).not.toHaveBeenCalled();
    });
  });
});
