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

## Start production server

`npm start`

To run as a service, PM2 is strongly recommended. See https://pm2.keymetrics.io for details.

## API usage

### GET / (home)

Returns name, version and current context of the server.
