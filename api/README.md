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
    },
    "http": {
      "url": "http://my-nas:5000"
    },
    "ssh": {
      "offCommand": "shutdown -h now",
      "keyPath": "/home/barney/.ssh/id_rsa",
      "password": "my-nas-password",
      "port": 2122,      
      "user": "my-nas-user"
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
| `. http`| HTTP related parameters (mandatory for some diagnostics), see below: |  |
| `.. url`| URL of web page served via HTTP server | / |
| `. ssh`| SSH related parameters (mandatory for power-off feature), see below: |  |
| `.. offCommand`| Custom command to shutdown device via SSH connection | `sudo -bS shutdown -h 1;exit` |
| `.. keyPath`| Path of private key for direct access (mandatory, PEM RSA only supported) | / |
| `.. password`| Password to use when invoking a command with sudo (mandatory for sudoer) | / |
| `.. port`| Custom SSH port to be accessed | 22 |
|

### SSH Configuration

Power-off service does require a working communication via SSH; to achieve this, you should check both parts below.

*Note: SSH access to Windows 10+ devices are not officially supported for now.*

#### Client side (instance hosting cool-updown-nxt server)
- Get or generate RSA key pairs
- Connect manually at least once to managed device; to add it to known hosts.

#### Device side, for each of those to be managed
- Allow public key authentication in SSH service parameters
- Add client public key in `~/.ssh/authorized_keys` file for the user you wanna connect with.

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

### GET /logs[?maxNbEvents=<>]

Returns some or all log entries with log file size and entry count.

**Sample output**
```json
{
  "entryCount": 1,
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
  ],
  "totalEntryCount": 100,
}   
```

**Query parameters**

They are optional, default behaviour is given below:

| Name | Description | Default behaviour |
| ---- | ----------- | ----------------- |
| `maxNbEvents` | Limits returned log events to specified amount | Returns all matching events |

**Notes**

- `entryCount` will be either the total number of available events, or the fixed limit with `maxNbEvents` query parameter
- `totalEntryCount` will always be the total number of available events, no matter if a limit or filtering have been applied.

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

### GET /config/[deviceId]

Returns registered configuration for a configured device.

**Sample output**

```json
{
  "configuration": {
    "network": {
      "hostname": "my-nas"
    }
  }
}
```

**Notes**
- Please refer to `/config` documentation above for details
- `deviceId` acts as unique identifier for a configured device; it matches the 0-based rank of the device in the configuration array
- If no configuration is available for specified device, a 404 is replied with following output:

```json
{
  "errorMessage": "Specified item was not found",
  "itemType": "deviceId",
  "itemValue": "foo"
}
```

### GET /diags

Returns some diagnostics for all configured devices (ping, power state, ssh, http).

**Sample output**

```json
{
  "diagnostics": {
    "0": {
      "on": "2023-10-24T20:30:39.119Z",
      "ping": {
        "status": "ok",
        "data": {
          "packetLossRate": 0,
          "roundTripTimeMs": {
            "average": 0.012,
            "max": 0.017,
            "min": 0.008,
            "standardDeviation": 0.004            
          } 
        },
      },
      "power": {
        "lastStartAttemptOn": "2023-11-04T14:05:33.967Z",
        "lastStartAttemptReason": "api",
        "lastStopAttemptReason": "none",
        "state": "off"
      },
      "ssh": {
        "status": "ok",
      },
      "http": {
        "status": "ok",
        "data": {
          "statusCode": 200
        }
      }
    }
  }
}
```

**Notes**
- The key used for each diagnostics entry is the device identifier
- `on` field allow to track the moment where diagnostics have been processed
- Ping `status`: available values are either `ok`, `ko` or `n/a`
- Ping `data`: are collected values from the ICMP command results (only Linux with english messages are supported for now):
  - `packetLossRate` (decimal between 0 and 1) is the count of lost packets / total amount sent
  - `roundTripTimeMs` (in milliseconds) are average, maximum, minimum, standard deviation times on sent packets 
- HTTP `data`: gives status code of the last call
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
      "status": "ko"
    },
    "power": {
      "state": "off" 
    }
    "ssh": {
      "state": "n/a",
    },
    "http": {
      "state": "n/a",
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

### POST /power-off/[deviceId]

Attempts to shutdownspecified device up through commands sent via SSH.

**Sample output**

This service does not provide any output in nominal case (HTTP code being 204).

**Notes**
- This feature relies on SSH, thus missing device SSH configuration will make a NO-OP
- `deviceId` acts as unique identifier for a configured device; it matches the 0-based rank of the device in the configuration array
- If no device exists with this identifier, a 404 is replied with following output:

```json
{
  "errorMessage": "Specified item was not found",
  "itemType": "deviceId",
  "itemValue": "foo"
}
```

- If for some reason either the SSH connection or issued command fail, a 500 is replied with following output: 

```json
{
  "errorMessage": "<...>",
}
```

## Monitoring cool-updown-nxt server instance

### Logs

To display logs from a terminal, issue following command: `npm run logs`.

Server logs are written to the *api/logs/cool-updown-nxt.log* file and sent to the standard/error outputs as well.


## Processing details: context

Application context, being the whole data required by the application at run-time, has its own processor, to:
- reload persisted context (written to disk) at application start
- regularly update persisted context with the current data, every 1 hour by design.


## Processing details: diagnostics

Diagnostics processor stores the N-1 results in a `previous` field for the device-specific context, and updates current results.

Here are the diagnostics that are actually processed:

### Ping

A `ping` command will be issued to the configured device hostname; 4 ICMP PING packets will be sent.

Diag results:

- `ok` status when the command terminates with success (exit code = 0)
- `ko` status when the command terminates with failure (exit code not 0)
- message attribute is available with the error description caught from error output, if any
- data attribute contains some statistics, such as packet loss, round trip times.

### Power

*Note: By design, the power state of a device is determined by the results of the ping diagnostic above; while working on most cases, that approach might not be 100% reliable, especially when device encounters network issues; besides, there's latency between the real status change and the moment when it comes detected by the diagnostics. So... be aware of the limitations!*

The application actually records the power ON/OFF attempts and thus is able to store:

- date on which the attempt has been made
- reason (source) of this attempt; it can be via api, scheduling, external (e.g power button, supply lost, etc.), or none if no power state change has been detected at all.

At time of every diagnostics processing, it can track the power state change and register external attempts:

- if power state switched from `off` to `on` and last start attempt date is older than 10 minutes (should it be tweakable?), an external start attempt is registered and attempt date is updated to current moment
- if power state switched from `on` to `off` and last stop attempt date is older than 10 minutes (should it be tweakable?), an external stop attempt is registered and attempt date is updated to current moment.

### SSH connectivity

Diagnostics also include asserting the SSH connectivity state, when SSH settings are set into device configuration.

It tries connecting via SSH to issue the `exit` command; this way it can guarantee that service is properly up on the device, user having access, and accepting commands.

Diag results:

- `ok` status when the issued command terminates with success (exit code = 0)
- `ko` status when either SSH connectivity is broken or the command terminates with failure (exit code not 0)
- `n/a` if device SSH parameters are not properly set, or if the current ping diagnostics are ko (meaning it's no use testing SSH connectivity, as the device cannot be found LAN-wise already)
- message attribute is available with the error description caught from error output, if any.

### HTTP test

A GET request is sent to configured URL, when specified. Feature status depends on the HTTP status code:

- `ok` with a status code < 400
- `ko` with a status code >= 400, or any error during HTTP request execution
- `n/a` if device HTTP parameters are not properly set, or if the current ping diagnostics are ko (meaning it's no use testing HTTP, as the device cannot be found LAN-wise already).

## Processing details: statistics

Stats are computed everytime diagnostics processing gets achieved.

For now, uptime has a WIP computation and is in beta state:

- Global: concerning application itself (`current` = from last start, or `overall`  = since the beginning)
- Per configured device (also supporting `current` and `overall` information).
