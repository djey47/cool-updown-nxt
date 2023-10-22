import globalMocks from './globalMocks';

const {
    appRootDirMock, pinoMock
} = globalMocks;
  
export default function() {
    appRootDirMock.get.mockReset();
    pinoMock.mockReset();
}
