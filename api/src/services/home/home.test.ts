import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { Context } from '../../models/context';
import { home } from './home';

import type { HomeResponse } from './models/home';

jest.mock('../../common/api');
jest.mock('../../../package.json', () => ({
  name: 'package-name',
  version: 'package-version',
}));
jest.mock('../../common/context');

const replyWithJsonMock = replyWithJson as jest.Mock;
const contextGetMock = AppContext.get as jest.Mock<Context, []>;
const contextGetWithoutInternalsMock = AppContext.getWithoutInternals as jest.Mock<Context, []>;

describe('Home service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  const defaultContext: Context = {
    appInfo: {},
    diagnostics: {},
    statistics: {
      global: {},
      perDevice: {},
    },
    schedules: [],
  };

  beforeEach(() => {
    replyWithJsonMock.mockReset();
    contextGetMock.mockReset();
    contextGetWithoutInternalsMock.mockReset();

    contextGetMock.mockReturnValue(defaultContext);
    contextGetWithoutInternalsMock.mockReturnValue(defaultContext);
  });

  describe('home function', () => {
    it('should reply with package info and context as JSON', () => {
      // given-when
      home(defaultReply);

      // then
      const expectedOutput: HomeResponse = {
        package: {
          name: 'package-name',
          version: 'package-version',
        },
        context: defaultContext,
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
      expect(contextGetWithoutInternalsMock).toHaveBeenCalled();
    });
  });
});
