import globalMocks from './globalMocks';

const {
  appRootDirMock, authMock, nodefetchMock, nodesshMock, pinoMock, node: { childProcessMock, fsMock }, wakeonlanMock
} = globalMocks;

export default function () {
  appRootDirMock.get.mockReset();
  authMock.readPrivateKey.mockReset();
  nodefetchMock.mockReset();
  nodesshMock.connect.mockReset();
  nodesshMock.execCommand.mockReset();
  nodesshMock.dispose.mockReset();
  pinoMock.mockReset();
  childProcessMock.exec.mockReset();
  fsMock.readFile.mockReset();
  fsMock.stat.mockReset();
  fsMock.writeFile.mockReset();
  wakeonlanMock.wake.mockReset();
}
