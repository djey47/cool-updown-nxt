FIXMEs/BUGs
===========

- [X] External power attempt registers: if external OFF is already registered, and device turned ON, an upcoming OFF attempt is not registered properly (obsolete 'on' date kept)
- [X] date-fns won't accept strings as Date args anymore => use parseISO (must be taken into account when restoring context from file!)
- [] Diags processor: model simplification with previous results (instead of current/previous)
- [] graceful shutdown plugin crashes (?) on dev server with vite => only use plugin in prod mode
- [] (stats) Possibly wrong per-device uptimes after app start, same for global overall uptime
