TODOs
=====

- WEB/FRONTEND
  - [X] ESLint
  - [] Unit tests mechanism

- API/BACKEND
  - [X] Unit tests mechanism
  - [X] ESLint
  - [X] Static file server for the web-application
  - Handle critical errors => 500?
  - Services  
    - [X] Config service
    - [] Logs service
      - [X] Basic implementation
      - Filters: time window (min/max date), log levels
    - [] Diags service
      - [X] Ping support
      - [] Per device (path param)
    - [] Stats service
      - [] Uptime (app and per device)
      - [] ....?
    - [] Scheduling service
    - [] ON/OFF service
  - Processors
    - [] Diags
      - [X] Skeleton with configured diag interval
      - [X] Ping support
        - Ping latency to be extracted from command output and available in API
      - [] Web server (page)
      - [] SSH connectivity
      - [] ?
    - [] Stats
  - Transversal
    - [] Config: validation at startup
    - [] Config : App => debugMode
    - [] Context persistence
      - At exit
      - Save overall app uptime to initialUptimeSeconds
