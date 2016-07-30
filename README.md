stack-in-a-box
===
This stack is built on:

* [Caddy][1] - reverse proxy and JWT auth for static assets and admin interface
* [RethinkDB][2] - "real-time" database
* [Horizon][3] - "real-time" javascript client and server interface for RethinkDB
* [Express][4] - add REST endpoints through Horizon client on server side
* [Vue][5] - front end framework

The jury is still out, but some sort of [feathers-horizon][6] may be a good solution one day. Though it doesn't exist currently.

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

You may need to [apply a patch][7] for Horizon version `1.1.3`:

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
* Authentication
* Authorization
* Users/permissions example
* Schema enforcment
* Map JWT claims to Horizon client connections
* Maintain a Horizon client connection pool server side?
* Volume mount `.caddy` folder to save ACME certs between restarts.

## Issues
* You need custom builds of Caddy to support sweet addons like JWT auth.
* `messages` REST service doesn't return on first call. Hit it twice.

## References
* [1]: https://caddyserver.com/
* [2]: https://www.rethinkdb.com/
* [3]: http://horizon.io/docs/getting-started/
* [4]: https://expressjs.com/
* [5]: https://github.com/rethinkdb/horizon/tree/next/examples/vue-chat-app
* [6]: http://feathersjs.com/
* [7]: https://github.com/joshwnj/knowledge/blob/master/horizon-in-node/index.md
