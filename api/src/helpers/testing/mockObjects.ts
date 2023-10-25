/**
 * Provide convenient mocks for complex objects
 */

import type { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyReplyContext, FastifyRequest } from 'fastify';
import { Stats } from 'fs';
import type { ServerResponse } from 'http';

export function getMockedFastifyReply(codeMock: jest.Mock, sendMock: jest.Mock): FastifyReply {
  return {
    raw: jest.fn() as unknown as ServerResponse,
    context: jest.fn() as unknown as FastifyReplyContext,
    getSerializationFunction: jest.fn(),
    log: jest.fn() as unknown as FastifyBaseLogger,
    send: sendMock,
    code: codeMock,
    status: jest.fn(),
    statusCode: 0,
    sent: false,
    header: jest.fn(),
    headers: jest.fn(),
    getHeader: jest.fn(),
    getHeaders: jest.fn(),
    removeHeader: jest.fn(),
    hasHeader: jest.fn(),
    hijack: jest.fn(),
    callNotFound: jest.fn(),
    getResponseTime: jest.fn(),
    type: jest.fn(),
    serializer: jest.fn(),
    serialize: jest.fn(),
    compileSerializationSchema: jest.fn(),
    then: jest.fn(),
    trailer: jest.fn(),
    hasTrailer: jest.fn(),
    removeTrailer: jest.fn(),
    request: jest.fn() as unknown as FastifyRequest,
    server: jest.fn() as unknown as FastifyInstance,
    redirect: jest.fn(),
    serializeInput: jest.fn(),
    sendFile: jest.fn(),
    download: jest.fn(),
  };
}

export function getFileStats(size: number): Stats {
  return {
    isFile: jest.fn(),
    isDirectory: jest.fn(),
    isBlockDevice: jest.fn(),
    isCharacterDevice: jest.fn(),
    isSymbolicLink: jest.fn(),
    isFIFO: jest.fn(),
    isSocket: jest.fn(),
    dev: 0,
    ino: 0,
    mode: 0,
    nlink: 0,
    uid: 0,
    gid: 0,
    rdev: 0,
    size,
    blksize: 0,
    blocks: 0,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    atime: new Date(),
    mtime: new Date(),
    ctime: new Date(),
    birthtime: new Date()
  };
}