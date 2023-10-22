import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { diag } from './diag';

jest.mock('../../common/logger', () => ({
  coreLogger: {
    info: jest.fn(),
  },
}));
jest.mock('../../helpers/recaller', () => ({
  recall: jest.fn(),
}))

const coreLoggerInfoMock = coreLogger.info as jest.Mock;
const recallMock = recall as jest.Mock;

describe('diagnostics processor', () => {
  describe('diag function', () => {
    it('should write logs and invoke recaller to call itself again', () => {
      // given-when
      diag();

      // then
      expect(coreLoggerInfoMock).toHaveBeenCalledTimes(2);
      expect(recallMock).toHaveBeenCalledWith(diag, 0);
    });
  });
});