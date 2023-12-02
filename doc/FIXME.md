FIXMEs/BUGs
===========

- [X] External power attempt registers: if external OFF is already registered, and device turned ON, an upcoming OFF attempt is not registered properly (obsolete 'on' date kept)
- [X] date-fns won't accept strings as Date args anymore => use parseISO (must be taken into account when restoring context from file!)
- [X] Diags processor: model simplification with previous results (instead of current/previous)
- [X] Diags: model simplification with removing unnecessary 'on' dates per individual items
- [X] graceful shutdown plugin crashes (?) on dev server with vite => only use plugin in prod mode
- [X] Refactor: extract routes from app to dedicated scripts
- [X] (stats BUG) Possibly wrong per-device uptimes after app start, same for global overall uptime
- [] Diags processor: more reliable ping feature (currently depends on OS implem)
- [] ViteJS dev + API: No loader is configured for ".node" files: (ssh2). Minor issue.
✘ [ERROR] No loader is configured for ".node" files: node_modules/ssh2/lib/protocol/crypto/build/Release/sshcrypto.node

    node_modules/ssh2/lib/protocol/crypto.js:30:20:
      30 │   binding = require('./crypto/build/Release/sshcrypto.node');
         ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

✘ [ERROR] No loader is configured for ".node" files: node_modules/cpu-features/build/Release/cpufeatures.node

    node_modules/cpu-features/lib/index.js:3:24:
      3 │ const binding = require('../build/Release/cpufeatures.node');
        ╵                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

