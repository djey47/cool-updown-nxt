import resetMocks from '../../config/jest/resetMocks';
import globalMocks from '../../config/jest/globalMocks';
import { ping } from './systemGateway';

const { node: { childProcessMock } } = globalMocks;

beforeEach(() => {
  resetMocks();
});

describe('systemGateway helper functions', () => {
  describe('ping', () => {
    it('should create child process with command and callback, for ping success', async () => {
      // given
      // Force promise resolution by invoking callback
      childProcessMock.exec.mockImplementation((_cmd, cb) => { 
        cb(null, 'std', '');
      })

      // when
      const actualOutput = await ping('host-name', 3);

      // then
      expect(actualOutput).toEqual({
        standardOutput: 'std',
        status: 'ok',
      });
      expect(childProcessMock.exec).toHaveBeenCalledWith('ping -c 3 host-name', expect.any(Function));
    });

    it('should create child process with command and callback, for ping failure', async () => {
      // given
      // Force promise resolution
      childProcessMock.exec.mockImplementation((_cmd, cb) => { 
        cb({}, '', 'An error has occurred');
      })

      // when
      const actualOutput = await ping('host-name', 2);

      // then
      expect(actualOutput).toEqual({
        error: {},
        errorOutput: 'An error has occurred',
        standardOutput: '',
        status: 'ko',
      });
    });
  });
});
