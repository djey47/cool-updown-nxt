import globalMocks from './globalMocks';

const {
  appRootDirMock, authMock, pinoMock, node: { childProcessMock, fsMock }, wakeonlanMock
} = globalMocks;

export default function () {
  appRootDirMock.get.mockReset();
  authMock.readPrivateKey.mockReset();
  pinoMock.mockReset();
  childProcessMock.exec.mockReset();
  fsMock.readFile.mockReset();
  fsMock.stat.mockReset();
  fsMock.writeFile.mockReset();
  wakeonlanMock.wake.mockReset();
}
