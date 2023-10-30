import { stats } from './stats';

jest.mock('../../common/logger', () => ({
  coreLogger: {
    info: jest.fn(),
  },
}));

describe('statistics processor', () => {
  describe('stats function', () => {
    it('?', async () => {
      // when
      await stats();
    });
  });
});