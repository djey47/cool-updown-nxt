# cool-updown-nxt API

Provides REST services and processors for the 'cool-updown' front-end applications.

Here are the main components behind it:
  - 💚 [node](https://nodejs.org/en) v18+
  - 🟦 [typescript](https://www.typescriptlang.org) as main language
  - ⚡ [vite](https://vitejs.dev) & [vite-plugin-node](https://github.com/axe-me/vite-plugin-node)
  - 🐆 [fastify](https://fastify.dev/) as express alternative
  - 🔩 [eslint](https://eslint.org) & 🃏 [jest](https://jestjs.io) for code quality and reliability.

## Install

Be sure to `cd` into this `api` folder, then issue `npm install`.

## Develop

...with HMR:

`npm run dev`

ESlint is used to lint code during dev server execution.

### Unit tests

- `npm test` will launch Jest
- `npm run test:coverage` will also analyze code coverage.

## Build for production

`npm run build`

ESlint is used to lint code during this build phase.

## Manual linting

To perform manual linting, issue `npm run lint` command.

## Configuration

Default configuration is given as example in `api/config/default.json` file.

```json
{
  "app": {
    "port": 3001,
    "host": "127.0.0.1",
    "diagnosticsIntervalMs": "60000"
  }
}
```

To override settings, create a copy to `api/config/production.json` file and make changes to your liking.

### Available settings

| Setting | Description | Default value |
| ------- | ----------- | ------------- |
| `app` | Set of application config items as described below |  |
| `. port`| TCP port to be used by the service in production mode | 3001 |
| `. host`| IP address to which the server will listen from requests in production mode | 127.0.0.1 |
| `. diagnosticsIntervalMs`| Specifies time interval (in milliseconds) between a completed diagnostics processing and the next one | 60000 |

## Start production server

`npm start`

To run as a service, PM2 is strongly recommended. See https://pm2.keymetrics.io for details.

## API usage

### GET / (home)

Returns name, version and current context of the server.

### GET /logs

Returns all log entries with log file size and entry count.

### GET /config

Returns loaded configuration.

## Monitoring

### Logs

To display logs from a terminal, issue following command: `npm run logs`.

Server logs are written to the *api/logs/cool-updown-nxt.log* file and sent to the standard/error outputs as well.
