import globalMocks from '../../config/jest/globalMocks';
import resetMocks from '../../config/jest/resetMocks';
import { readPrivateKey } from './auth';

const { node: { fsMock: nodeFSMock }} = globalMocks;

describe('authentication helper functions', () => {
  describe('readPrivateKey asynchronous function', () => {
    beforeEach(() => {
      resetMocks();
    });

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
});
