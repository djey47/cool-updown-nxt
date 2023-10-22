// NODE API //
// fs
const mockFSReadFile = jest.fn();
const mockFSStat = jest.fn();
jest.mock('fs/promises', () => ({
  readFile: async (p: string, o: unknown) => mockFSReadFile(p, o),
  stat: async (p: string) => mockFSStat(p),
}));


// NODE MODULES //
// app-root-dir
const mockAppRootDirGet = jest.fn(() => './test');
jest.mock('app-root-dir', () => ({
  get: () => mockAppRootDirGet(),
}));

// pino
const mockPino = jest.fn(() => ({ pino: 'foo' }));
jest.mock('pino', () => mockPino); 


export default {
  appRootDirMock: {
    get: mockAppRootDirGet,
  },
  node: {
    fsMock: {
      readFile: mockFSReadFile,
      stat: mockFSStat,
    }
  },
  pinoMock: mockPino,
};
