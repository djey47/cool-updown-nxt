import type { ExecException } from 'child_process';
import { WriteFileOptions } from 'fs';
import { Config, SSHExecCommandOptions } from 'node-ssh';
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

// cron
const mockCronStart = jest.fn<void,[]>();
const mockCronJob = jest.fn<unknown, [string, () => void] >(() => ({
  start: () => mockCronStart(),
}));
jest.mock('cron', () => ({
  CronJob: mockCronJob,
}));

// node-fetch
const mockNodeFetch = jest.fn();
jest.mock('node-fetch', () => mockNodeFetch);

// node-ssh
const mockSSHConnect = jest.fn();
const mockSSHExecCommand = jest.fn();
const mockSSHDispose = jest.fn();
jest.mock('node-ssh', () => ({
  NodeSSH: jest.fn(() => ({
    connect: (config: Config) => mockSSHConnect(config),
    execCommand: (c: string, co: SSHExecCommandOptions) => mockSSHExecCommand(c, co),
    dispose: () => mockSSHDispose(),
  })),
}));

// pino
const mockPino = jest.fn(() => ({ pino: 'foo' }));
jest.mock('pino', () => mockPino); 

// wake_on_lan
const mockWOLWake = jest.fn<void, [string, WakeOptions, () => void]> ();
jest.mock('wake_on_lan', () => ({
  wake: (a: string, o: WakeOptions, f: () => void) => mockWOLWake(a, o, f),
}));


// CUSTOM
const mockAuthReadPrivateKey = jest.fn();

export default {
  appRootDirMock: {
    get: mockAppRootDirGet,
  },
  authMock: {
    readPrivateKey: mockAuthReadPrivateKey,
  },
  cronMock: {
    Job: mockCronJob,
    start: mockCronStart,
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
  nodefetchMock: mockNodeFetch,
  nodesshMock: {
    connect: mockSSHConnect,
    execCommand: mockSSHExecCommand,
    dispose: mockSSHDispose,
  },
  pinoMock: mockPino,
  wakeonlanMock: {
    wake: mockWOLWake,
  },
};
