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

Default configuration is defined in `api/config/default.json` file.

```json
{
  "app": {
    "port": 3001,
    "host": "127.0.0.1",
    "diagnosticsIntervalMs": "60000"
  },
  "devices": [{
    "network": {
      "hostname": "my-nas",
      "macAddress": "aa:bb:cc:dd:ee:ff",
      "broadcastIpAddress": "255.255.255.255"
    }
  }]
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
| `devices` | List of monitored devices as configured below |  |
| `. network`| Network related parameters, see below: |  |
| `.. broadcastIpAddress`| Broadcast IP address (mandatory for WOL) | / |
| `.. hostname`| Device name or IP address (mandatory) | / |
| `.. macAddress`| MAC address for this device (mandatory for WOL) | / |

## Start production server

`npm start`

To run as a service, PM2 is strongly recommended. See https://pm2.keymetrics.io for details.

## HOSTED WEB UI

The integrated web application is available under the `/ui/` path.

For more information, please refer to its own documentation, located under the `<root>/web` path.

## API usage

### GET / (home)

Returns name, version and current context of the server; it is not advised to use context directly to get stats/diags etc. as dedicated services are made for this.

**Sample output**
```json
{
  "package": {
    "name": "cool-updown-nxt-api",
    "version": "1.0.0-alpha"
  },
  "context": {...}
}
```

### GET /logs

Returns all log entries with log file size and entry count.

**Sample output**
```json
{
  "entryCount": 100,
  "logs": [
    {
      "level": "info",
      "message": "incoming request",
      "time": 1698047863548,
      "requestId": "req-3",
      "request": {
        "method": "GET",
        "url": "/logs",
        "hostname": "localhost:3000",
        "remoteAddress": "127.0.0.1",
        "remotePort": 56906
      }
    }
  ]
}   
```

### GET /config

Returns loaded configuration.

**Sample output**
```json
{
  "configuration": {
    "app": {
      "port": 3001,
      "host": "127.0.0.1",
      "diagnosticsIntervalMs": 60000
    },
    "devices": [{
      "network": {
        "hostname": "my-nas"
      }
    }]
  }
}
```

### GET /diags

Returns some diagnostics for all configured devices (ping, power state).

**Sample output**

```json
{
  "diagnostics": {
    "0": {
      "on": "2023-10-24T20:30:39.119Z",
      "ping": {
        "on": "2023-10-24T20:30:39.119Z",
        "status": "ko"
      },
      "power": {
        "lastStartAttemptOn": "2023-11-04T14:05:33.967Z",
        "lastStartAttemptReason": "api",
        "lastStopAttemptReason": "none",
        "state": "off"
      }
    }
  }
}
```

**Notes**
- The key used for each diagnostics entry is the device identifier
- `on` fields allow to track the moment where diagnostics have been processed
- Ping `status`: available values are either `ok`, `ko` or `n/a`
- Power `state`: available values are either `on`, `off` or `n/a`.
- Power `lastStartAttemptReason` or `lastStartAttemptReason`: available values are one of the following: `none`, `api`, `scheduled` or `external`.

### GET /diags/[deviceId]

Returns some diagnostics for a configured device.

**Sample output**

```json
{
  "diagnostics": {
    "on": "2023-10-24T20:30:39.119Z",
    "ping": {
      "on": "2023-10-24T20:30:39.119Z",
      "status": "ko"
    },
    "power": {
      "state": "off" 
    }
  }
}
```

**Notes**
- Please refer to `/diags` documentation above for details
- `deviceId` acts as unique identifier for a configured device; it matches the 0-based rank of the device in the configuration array
- If no diagnostics are available for specified device (or no device exists with this identifier), a 404 is replied with following output:

```json
{
  "errorMessage": "Specified item was not found",
  "itemType": "deviceId",
  "itemValue": "foo"
}
```

### GET /stats

Returns some statistics for all configured devices.

**Sample output**
```json
{
  "statistics": {
    "app": {
      "uptimeSeconds": {
        "current": 27,
        "overall": 27
      }
    },
    "perDevice": {
      "0": {
        "uptimeSeconds": {
          "current": 0,
          "overall": 0
        }
      }
    }
  }
}
```

**Notes**
- `app` section is related to cool-updown-nxt API server itself
- `current` uptime is computed from the last start of app/device
- `overall` uptime is the total amount for app/device
- The key used for each `perDevice` sub-entry is the device identifier.

### GET /stats/[deviceId]

Returns some statistics for a configured device.

**Sample output**

```json
{
  "statistics": {
    "uptimeSeconds": {
      "current": 0,
      "overall": 0
    }
  }
}
```

**Notes**
- Please refer to `/stats` documentation above for details
- `deviceId` acts as unique identifier for a configured device; it matches the 0-based rank of the device in the configuration array
- If no statistics are available for specified device (or no device exists with this identifier), a 404 is replied with following output:

```json
{
  "errorMessage": "Specified item was not found",
  "itemType": "deviceId",
  "itemValue": "foo"
}
```

### POST /power-on/[deviceId]

Attempts to wake specified device up through Wake On Lan.

**Sample output**

This service does not provide any output in nominal case (HTTP code being 204).

**Notes**
- `deviceId` acts as unique identifier for a configured device; it matches the 0-based rank of the device in the configuration array
- If no device exists with this identifier, a 404 is replied with following output:

```json
{
  "errorMessage": "Specified item was not found",
  "itemType": "deviceId",
  "itemValue": "foo"
}
```

- If for some reason the WOL fails, a 500 is replied with following output: 

```json
{
  "errorMessage": "Unable to perform wake on LAN: <...>",
}
```

## Monitoring

### Logs

To display logs from a terminal, issue following command: `npm run logs`.

Server logs are written to the *api/logs/cool-updown-nxt.log* file and sent to the standard/error outputs as well.


## Processing details: context

Application context, being the whole data required by the application at run-time, has its own processor, to:
- reload persisted context (written to disk) at application start
- regularly update persisted context with the current data, every 1 hour by design.


## Processing details: diagnostics

Here are the diagnostics that are currently processed:

### Ping

A `ping` command will be issued to the configured device hostname; 2 ICMP PING packets will be sent.

Diag results:

- `ok` status when the command terminates with success (exit code = 0)
- `ko` status when the command terminates with failure (exit code not 0)
- message attribute is available with the error description caught from error output.

### Power

Note: By design, the power state of a device is determined by the results of the ping diagnostic above; while working on most cases, that approach might not be 100% reliable, especially when device encounters network issues; besides, there's latency between the real status change and the moment when it comes detected by the diagnostics.

The application actually records the power ON/OFF attempts and thus is able to store:

- date on which the attempt has been made
- reason (source) of this attempt; it can be via api, scheduling, external (e.g power button, supply lost), or none if no power state change has been detected at all.

At time of every diagnostics processing, it can track the power state change and register external attempts:

- if power state switched from `off` to `on` and last start attempt date is older than 10 minutes (should it be tweakable?), an external start attempt is registered and attempt date is updated to current moment
- if power state switched from `on` to `off` and last stop attempt date is older than 10 minutes (should it be tweakable?), an external stop attempt is registered and attempt date is updated to current moment.


## Processing details: statistics

Stats are computed everytime diagnostics processing gets achieved.

For now, uptime has a WIP computation.
