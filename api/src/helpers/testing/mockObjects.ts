/**
 * Provide convenient mocks for complex objects
 */

import { CronJob } from 'cron';
import type { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyReplyContext, FastifyRequest } from 'fastify';
import type { Stats } from 'fs';
import type { ServerResponse } from 'http';
import type { Context } from '../../models/context';
import type { DeviceConfig } from '../../models/configuration';

export function getMockedFastifyReply(codeMock: jest.Mock, sendMock: jest.Mock): FastifyReply {
  return {
    raw: jest.fn() as unknown as ServerResponse,
    context: jest.fn() as unknown as FastifyReplyContext,
    getSerializationFunction: jest.fn(),
    log: {      
      debug: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      info: jest.fn(),
      silent: jest.fn(),
      trace: jest.fn(),
      warn: jest.fn(),      
    } as unknown as FastifyBaseLogger,
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

export function getMockedRequestWithDeviceIdParameter(deviceId: string) {
  return {
    params: {
      deviceId,
    },
  };
}

export function getMockedRequestWithLogsQueryParameters(maxNbEvents?: number) {
  return {
    query: {
      maxNbEvents,
    },
  };
}

export function getMockedFastifyApp(): FastifyInstance {
  return {
    server: {
      setTimeout: jest.fn(),
      maxHeadersCount: null,
      maxRequestsPerSocket: null,
      timeout: 0,
      headersTimeout: 0,
      keepAliveTimeout: 0,
      requestTimeout: 0,
      closeAllConnections: jest.fn(),
      closeIdleConnections: jest.fn(),
      addListener: jest.fn(),
      emit: jest.fn(),
      on: jest.fn(),
      once: jest.fn(),
      prependListener: jest.fn(),
      prependOnceListener: jest.fn(),
      listen: jest.fn(),
      close: jest.fn(),
      address: jest.fn(),
      getConnections: jest.fn(),
      ref: jest.fn(),
      unref: jest.fn(),
      maxConnections: 0,
      connections: 0,
      listening: false,
      [Symbol.asyncDispose]: jest.fn(),
      removeListener: jest.fn(),
      off: jest.fn(),
      removeAllListeners: jest.fn(),
      setMaxListeners: jest.fn(),
      getMaxListeners: jest.fn(),
      listeners: jest.fn(),
      rawListeners: jest.fn(),
      listenerCount: jest.fn(),
      eventNames: jest.fn()
    },
    pluginName: '',
    prefix: '',
    version: '',
    log: {
      child: jest.fn(),
      level: 'error',
      fatal: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
      silent: jest.fn()
    },
    listeningOrigin: '',
    addresses: jest.fn(),
    withTypeProvider: jest.fn(),
    addSchema: jest.fn(),
    getSchema: jest.fn(),
    getSchemas: jest.fn(),
    after: jest.fn(),
    close: jest.fn(),
    decorate: jest.fn(),
    decorateRequest: jest.fn(),
    decorateReply: jest.fn(),
    hasDecorator: jest.fn(),
    hasRequestDecorator: jest.fn(),
    hasReplyDecorator: jest.fn(),
    hasPlugin: jest.fn(),
    addConstraintStrategy: jest.fn(),
    hasConstraintStrategy: jest.fn(),
    inject: jest.fn(),
    listen: jest.fn(),
    ready: jest.fn(),
    register: jest.fn(),
    routing: jest.fn(),
    getDefaultRoute: jest.fn(),
    setDefaultRoute: jest.fn(),
    route: jest.fn(),
    get: jest.fn(),
    head: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    options: jest.fn(),
    patch: jest.fn(),
    all: jest.fn(),
    hasRoute: jest.fn(),
    addHook: jest.fn(),
    setNotFoundHandler: jest.fn(),
    errorHandler: jest.fn(),
    setErrorHandler: jest.fn(),
    childLoggerFactory: jest.fn(),
    setChildLoggerFactory: jest.fn(),
    validatorCompiler: jest.fn(),
    setValidatorCompiler: jest.fn(),
    serializerCompiler: jest.fn(),
    setSerializerCompiler: jest.fn(),
    setSchemaController: jest.fn(),
    setReplySerializer: jest.fn(),
    setSchemaErrorFormatter: jest.fn(),
    addContentTypeParser: jest.fn(),
    hasContentTypeParser: jest.fn(),
    removeContentTypeParser: jest.fn(),
    removeAllContentTypeParsers: jest.fn(),
    getDefaultJsonParser: jest.fn(),
    defaultTextParser: jest.fn(),
    printRoutes: jest.fn(),
    printPlugins: jest.fn(),
    initialConfig: {},
    gracefulShutdown: jest.fn(),
    [Symbol.asyncDispose]: jest.fn(),
    basicAuth: jest.fn(),
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

export function getDefaultContext(): Context {
  return {
    appInfo: {},
    diagnostics: {},
    statistics: {
      global: {},
      perDevice: {},
    },
    schedules: [],
  };
}

export function getDefaultDeviceConfig(): DeviceConfig {
  return {
    network: {
      broadcastIpAddress: '255.255.255.255',
      hostname: 'host-name',
      macAddress: 'aa:bb:cc:dd:ee:ff',
    },
  };
}

export function getMockedCronJob(): CronJob {
  const jobCallback = jest.fn();
  const mockedJob = new CronJob('* * * * *', () => jobCallback());
  mockedJob.lastDate = jest.fn<Date | null, []>();
  mockedJob.nextDate = jest.fn();
  return mockedJob;
}