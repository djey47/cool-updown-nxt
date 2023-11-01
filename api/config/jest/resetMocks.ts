import globalMocks from './globalMocks';

const {
    appRootDirMock, pinoMock, node: { childProcessMock, fsMock }, wakeonlanMock
} = globalMocks;
  
export default function() {
    appRootDirMock.get.mockReset();
    pinoMock.mockReset();
    childProcessMock.exec.mockReset();
    fsMock.readFile.mockReset();
    fsMock.stat.mockReset();
    wakeonlanMock.wake.mockReset();
}
