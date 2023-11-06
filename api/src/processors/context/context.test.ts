import { AppContext } from '../../common/context';
import { recall } from '../../helpers/recaller';
import { contextProcessor } from './context';

jest.mock('../../common/logger', () => ({
  coreLogger: {
    info: jest.fn(),
  }
}));
jest.mock('../../helpers/recaller');

const recallMock = recall as jest.Mock<void>;
const persistMock = jest.spyOn(AppContext, 'persist');
const restoreMock = jest.spyOn(AppContext, 'restore');

beforeEach(() => {
  AppContext.resetAll();
  persistMock.mockReset();
  restoreMock.mockReset();
  recallMock.mockReset();
});

describe('context processor', () => {
  describe('contextProcessor function', () => {
    it('should restore then persist context to file then recall itself in 1h when initializing', async () => {
      // given-when
      await contextProcessor(true);

      // then
      expect(restoreMock).toHaveBeenCalledTimes(1);
      expect(persistMock).toHaveBeenCalledTimes(1);
      expect(recallMock).toHaveBeenCalledWith(contextProcessor, 3600000);
    });

    it('should persist context to file initially then recall itself in 1h', async () => {
      // given-when
      await contextProcessor();

      // then
      expect(persistMock).toHaveBeenCalledTimes(1);
      expect(restoreMock).toHaveBeenCalledTimes(0);
      expect(recallMock).toHaveBeenCalledWith(contextProcessor, 3600000);
    });

  });
});
