import { getDeviceConfig } from '../../common/configuration';
import { getDefaultDeviceConfig, getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { validateDeviceIdentifier } from './validators';

import type { DeviceConfig } from '../../models/configuration';

jest.mock('../../common/configuration');

const codeMock = jest.fn();
const sendMock = jest.fn();
const getDeviceConfigMock = getDeviceConfig as jest.Mock<DeviceConfig, [string]>;

beforeEach(() => {
  codeMock.mockReset();
  sendMock.mockReset();
  getDeviceConfigMock.mockReset();
});

describe('validators common functions', () => {
  const defaultDeviceConfig = getDefaultDeviceConfig();

  describe('validateDeviceIdentifier function', () => {
    const defaultReply = getMockedFastifyReply(codeMock, sendMock);

    it('should return configuration when available', () => {
      // given
      getDeviceConfigMock.mockReturnValue(defaultDeviceConfig);

      // when
      const actual = validateDeviceIdentifier('0', defaultReply);

      // then
      expect(actual).toEqual(defaultDeviceConfig);
      expect(defaultReply.send).not.toHaveBeenCalled();
    });    
    
    it('should return undefined when unavailable, without reply', () => {
      // given-when
      const actual = validateDeviceIdentifier('0');

      // then
      expect(actual).toBe(undefined);
    });    
    
    it('should return undefined when unavailable, with 404 reply', () => {
      // given
      codeMock.mockReturnValue(defaultReply);

      // when
      const actual = validateDeviceIdentifier('0', defaultReply);

      // then
      expect(actual).toBe(undefined);
      expect(codeMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({
        errorMessage: 'Specified item was not found',
        itemType: 'deviceId',
        itemValue: '0',
      });
    });
  });
});