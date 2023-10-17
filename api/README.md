# cool-updown-nxt API

Here are the main components behind it:
  - 💚node v18+
  - ⚡[vite](https://vitejs.dev) & [vite-plugin-node](https://github.com/axe-me/vite-plugin-node)
  - 🐆[fastify](https://fastify.dev/) as express alternative.

## Install

Be sure to `cd` into this current folder, then issue `npm install`.

## Develop

...with HMR:

`npm run dev`

## Build for production

`npm run build`

## Configuration

Default configuration is given as example in `api/config/default.json` file.

```json
{
  "app": {
    "port": 3001,
    "host": "127.0.0.1"
  }
}
```

To override settings, create a `api/config/local.json` file and add changes to your liking.

### Available settings

| Setting | Description | Default value |
| ------- | ----------- | ------------- |
| `app` | Set of application config items as described below |  |
| `. port`| TCP port to be used by the service in production mode | 3001 |
| `. host`| IP address to which the server will listen from requests in production mode | 127.0.0.1 |

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

Server logs are written to the *api/logs/cool-updown-nxt.log* file and sent to the standard/error outputs as well.
