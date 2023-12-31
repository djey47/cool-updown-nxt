FIXMEs/BUGs
===========

## API/BACKEND

- [X] External power attempt registers: if external OFF is already registered, and device turned ON, an upcoming OFF attempt is not registered properly (obsolete 'on' date kept)
- [X] date-fns won't accept strings as Date args anymore => use parseISO (must be taken into account when restoring context from file!)
- [X] Diags processor: model simplification with previous results (instead of current/previous)
- [X] Diags: model simplification with removing unnecessary 'on' dates per individual items
- [X] graceful shutdown plugin crashes (?) on dev server with vite => only use plugin in prod mode
- [X] Refactor: extract routes from app to dedicated scripts
- [X] (stats BUG) Possibly wrong per-device uptimes after app start, same for global overall uptime
- [] Diags processor: more reliable ping feature (currently depends on OS implem)
  - See if NPM lib is available
- [] ViteJS dev + API: No loader is configured for ".node" files: (ssh2). Minor issue.
✘ [ERROR] No loader is configured for ".node" files: node_modules/ssh2/lib/protocol/crypto/build/Release/sshcrypto.node

    node_modules/ssh2/lib/protocol/crypto.js:30:20:
      30 │   binding = require('./crypto/build/Release/sshcrypto.node');
         ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

✘ [ERROR] No loader is configured for ".node" files: node_modules/cpu-features/build/Release/cpufeatures.node

    node_modules/cpu-features/lib/index.js:3:24:
      3 │ const binding = require('../build/Release/cpufeatures.node');
        ╵                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
- [ ] SSH shutdown command does not give hand back immediately
  => force or do not wait for promise resolution? 'exit' does not seem to work
- [X] Refactor to use deviceId validator in every service which needs it
- [X] authentication helper: remove success message or use debug log level, fix interpolation to display user name on success) failure
- [X] issue when adding new device with just hostname as configuration:
4|cud-nxt  | TypeError: Cannot read properties of undefined (reading 'state')
4|cud-nxt  |     at powerDiag (file:///home/pi/app/cool-updown-nxt/api/dist/app.mjs:600:18)
4|cud-nxt  |     at file:///home/pi/app/cool-updown-nxt/api/dist/app.mjs:684:25
4|cud-nxt  |     at Array.forEach (<anonymous>)
4|cud-nxt  |     at diagForAllDevices (file:///home/pi/app/cool-updown-nxt/api/dist/app.mjs:668:14)
4|cud-nxt  |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
4|cud-nxt  |     at async diagProcessor (file:///home/pi/app/cool-updown-nxt/api/dist/app.mjs:659:3)
4|cud-nxt  |     at async app (file:///home/pi/app/cool-updown-nxt/api/dist/app.mjs:1171:3)

## WEB

- [X] Power OFF is still blocking as Promise resolution only occurs after SSH connection is closed (caused by shutdown) 
- [ ] power state change notifications don't appear
- [ ] click on power button should not have effect when power state is ON and ssh is unavailable
