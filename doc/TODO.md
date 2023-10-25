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
    - [] Scheduling service
    - [] ON/OFF service
  - Processors
    - [] Diags
      - [X] Skeleton with configured diag interval
      - [X] Ping support
      - [] Web server (page)
      - [] SSH connectivity
      - [] ?
    - [] Stats
  - Transversal
    - [] Config: validation at startup
    - [] Config : App => debugMode
    - [] Context persistence
