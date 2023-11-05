import type { ExecException } from 'child_process';
import { WriteFileOptions } from 'fs';
import type { WakeOptions } from 'wake_on_lan';

// NODE API //
// child_process
const mockChildProcessExec = jest.fn();
jest.mock('child_process', () => ({
  exec: async (cmd: string, cb: (err: ExecException | null, stdout: string, stderr: string) => void) => mockChildProcessExec(cmd, cb),
}));
// fs
const mockFSReadFile = jest.fn();
const mockFSStat = jest.fn();
const mockFSWriteFile = jest.fn();
jest.mock('fs/promises', () => ({
  readFile: async (p: string, opts: unknown) => mockFSReadFile(p, opts),
  stat: async (p: string) => mockFSStat(p),
  writeFile: async (p: string, c: string, opts: WriteFileOptions) => mockFSWriteFile(p, c, opts),
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

// wake_on_lan
const mockWOLWake = jest.fn();
jest.mock('wake_on_lan', () => ({
  wake: (a: string, o: WakeOptions, f: () => void) => mockWOLWake(a, o, f),
}));

export default {
  appRootDirMock: {
    get: mockAppRootDirGet,
  },
  node: {
    childProcessMock: {
      exec: mockChildProcessExec,
    },
    fsMock: {
      readFile: mockFSReadFile,
      stat: mockFSStat,
      writeFile: mockFSWriteFile,
    }
  },
  pinoMock: mockPino,
  wakeonlanMock: {
    wake: mockWOLWake,
  },
};
