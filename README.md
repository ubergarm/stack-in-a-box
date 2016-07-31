stack-in-a-box
===
This stack is built on:

* Caddy [1](https://caddyserver.com/) - reverse proxy and JWT auth for static assets and admin interface
* RethinkDB [2](https://www.rethinkdb.com/) - "real-time" database
* Horizon [3](http://horizon.io/docs/getting-started/) - "real-time" javascript client and server interface for RethinkDB
* Express [4](https://expressjs.com/) - add REST endpoints through Horizon client on server side
* Vue [5](https://github.com/rethinkdb/horizon/tree/next/examples/vue-chat-app) - front end framework

## Purpose
The goal of this project is to provide all the parts necessary to create a "real-time" web-app while still providing good old REST endpoints to the same data.

This project is a proof of concept based on [this Horizon issue](https://github.com/rethinkdb/horizon/pull/507#issuecomment-234624156)

#### There may be better ways to do this kind of thing as it is still evolving:

1. A `feathers-horizon` [6](http://feathersjs.com/) might do the trick if someone writes it.
2. Can [Redux](https://github.com/shanecav/horizon-redux) provide Horizon across multiple transports?
3. [Horizon Plugins](https://github.com/rethinkdb/horizon/pull/588)?

#### This still leaves other questions like:

1. Should my async tasks access the database directly through ReQL?
2. Can I rely on change-feeds and ditch message queues?
3. If I `dog-food` my APIs then I can never use ReQL and that stinks...
4. What about HTTP/2 SSE transports?

## Requirements

* `docker`
* `docker-compose` > v1.6 to support version: '2' `docker-compose.yml` format

## Get Started

    # cone this repo
    git clone https://github.com/ubergarm/stack-in-a-box
    cd stack-in-a-box
    # build docker images
    docker-compose build
    # install rest services dependencies
    docker run --rm -it -v $PWD/rest:/app \
               --entrypoint=/bin/sh \
               ubergarm/horizon -c "npm install"
    # fixup permissions
    sudo chown -R $UID:$UID ./rest

You may need to apply a patch [7](https://github.com/joshwnj/knowledge/blob/master/horizon-in-node/index.md) for Horizon version `1.1.3`:

    # check your horizon version
    docker run --rm -it ubergarm/horizon version
    # if it is 1.1.3 then do the next step
    sed -e "/require('imports?this/ s/^#*/\/\//" -i \
        ./rest/node_modules/@horizon/client/lib/util/fetch.js

Now you're ready to run!

## Usage
_NOTE:_ `docker-config.yml` defaults will attempt to bind to your Docker hosts public network iterface on ports 80 and 443.

    # bring up the stack
    docker-compose up

Now you can do a few things:

1. [RethinkDB admin interface](http://localhost/admin)
1. [Static Files](http://localhost/static)
1. [Realtime Chat Demo](http://localhost)
1. [REST interface](http://localhost/messages)

Use the REST interface:

    # GET some data
    curl http://localhost/messages
    # POST some data
    curl -H 'Content-Type: application/json' -d '{"text":"hello"}' http://localhost/messages
    # TODO
    # JWT example
    curl -H "Authorization: Bearer MY_TOKEN" http://localhost/messages

## Horizon CLI
An example of initializing a Horizon app.

    docker run --rm -it -v `pwd`:/app ubergarm/horizon init realtime
    sudo chown -R $UID:$UID ./realtime

## TODO

- [x] Caddy basic config and static files
- [x] RethinkDB admin ui behind proxy
- [x] Horizon chat app working behind proxy
- [x] Express route behind proxy exposing Horizon client through REST
- [x] GET/POST example for REST API CRUD
- [ ] Authentication
- [ ] Authorization mapping JWT claims to Horizon users
- [ ] Configure permissions running horizon without --dev
- [ ] Secure RethinkDB admin ui with JWT auth
- [ ] Full CRUD support
- [ ] REST CRUD Schema enforcment middleware
- [ ] Maintain a Horizon client connection pool server side?
- [ ] Volume mount `.caddy` folder to save ACME certs between restarts.
- [ ] Test for websockets and HTTP/2 proper behavior over TLS

## Issues
* You need custom builds of Caddy to support sweet addons like JWT auth.
* `messages` REST service doesn't return on first call. Hit it twice.

## References
* [1](https://caddyserver.com/): https://caddyserver.com/
* [2](https://www.rethinkdb.com/): https://www.rethinkdb.com/
* [3](http://horizon.io/docs/getting-started/): http://horizon.io/docs/getting-started/
* [4](https://expressjs.com/): https://expressjs.com/
* [5](https://github.com/rethinkdb/horizon/tree/next/examples/vue-chat-app): https://github.com/rethinkdb/horizon/tree/next/examples/vue-chat-app
* [6](http://feathersjs.com/): http://feathersjs.com/
* [7](https://github.com/joshwnj/knowledge/blob/master/horizon-in-node/index.md): https://github.com/joshwnj/knowledge/blob/master/horizon-in-node/index.md
