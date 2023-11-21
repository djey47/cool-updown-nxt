import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { home } from './home';

import type { HomeResponse } from './models/home';

jest.mock('../../common/api');
jest.mock('../../../package.json', () => ({
  name: 'package-name',
  version: 'package-version',
}));

const replyWithJsonMock = replyWithJson as jest.Mock;

describe('Home service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  beforeEach(() => {
    replyWithJsonMock.mockReset();
  })

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
        context: AppContext.get(),
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });
  });
});
