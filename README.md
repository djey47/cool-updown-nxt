# cool-updown-nxt
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://choosealicense.com/licenses/mit)
![Build status](https://github.com/djey47/cool-updown-nxt/actions/workflows/cud-nxt.yml/badge.svg?branch=main&event=push)

Handy client/server solution to manage start and shutdown of your home PCs.

It's basically the same goal as its elder brother [cool-updown](https://github.com/djey47/cool-updown-legacy), but with more convenient UI and flexible architecture.

## Architecture

It's a WIP. Every part below has to be built as a separate project.

### Api

NodeJS server hosting services as HTTP endpoints, as well as processors (diagnostics, stats) and static resource server.

### Web

React front-end application relying upon the above API.
