import globalMocks from '../../config/jest/globalMocks';
import resetMocks from '../../config/jest/resetMocks';
import { AuthConfig } from '../models/configuration';
import { readPrivateKey, initAppAuthentication } from './auth';
import { getMockedFastifyApp } from './testing/mockObjects';

const { node: { fsMock: nodeFSMock }} = globalMocks;

beforeEach(() => {
  resetMocks();
});

describe('authentication helper functions', () => {
  describe('readPrivateKey asynchronous function', () => {
    it('should resolve to undefined when undefined key path', async () => {
      // given-when
      const actual = await readPrivateKey();

      // then
      expect(actual).toBeUndefined();
    });

    it('should read key contents from file system', async () => {
      // given
      nodeFSMock.readFile.mockResolvedValue('=== PRIVATE KEY ===');

      // when
      const actual = await readPrivateKey('/key-path');

      // then
      expect(actual).toBe('=== PRIVATE KEY ===');
      expect(nodeFSMock.readFile).toHaveBeenCalledWith('/key-path', 'utf-8');
    });
  });  
  
  describe('initAppAuthentication function', () => {
    const fastifyApp = getMockedFastifyApp();
    const authConfig: AuthConfig = {
      enabled: true,
      login: 'my-login',
      password: 'my-password',
    };
    const doneMock = jest.fn();

    beforeEach(() => {
      doneMock.mockReset();
    });

    it('should not register auth plugin when missing authentication configuration', () => {
      // given-when
      initAppAuthentication(fastifyApp, authConfig);

      // then
      expect(fastifyApp.register).toHaveBeenCalledWith(
        expect.any(Function),
        {
          authenticate: { realm: 'cud-nxt' },
          validate: expect.any(Function),
        });
    });     
    
    it('should not register auth plugin when disbaled in authentication configuration', () => {
      // given
      const disabledAuthConfig: AuthConfig = {
        ...authConfig,
        enabled: false,
      };

      // when
      initAppAuthentication(fastifyApp, disabledAuthConfig);

      // then
      expect(fastifyApp.register).not.toHaveBeenCalled();
    });    
    
    it('should enable authentication correctly', () => {
      // given-when
      initAppAuthentication(fastifyApp);

      // then
      expect(fastifyApp.register).not.toHaveBeenCalled();
    });

    it('should implement validate function to handle success', () => {
      // given- when
      initAppAuthentication(fastifyApp, authConfig);
      const registerMock = fastifyApp.register as unknown as jest.Mock;
      registerMock.mock.calls[0][1].validate('my-login', 'my-password', null, null, doneMock);

      // then
      expect(doneMock).toHaveBeenCalledWith();
    });

    it('should implement validate function to handle failure', () => {
      // given- when
      initAppAuthentication(fastifyApp, authConfig);
      const registerMock = fastifyApp.register as unknown as jest.Mock;
      registerMock.mock.calls[0][1].validate('my-login-2', 'my-password', null, null, doneMock);

      // then
      expect(doneMock).toHaveBeenCalledWith(new Error('Authentication failed!'));
    });
  });
});
