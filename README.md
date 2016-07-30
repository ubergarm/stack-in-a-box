stack-in-a-box
===
## BUG TESTING
I ran into a problem getting this project off the ground so I pushed
this branch just for bug/issue reporting.

* [Caddy Reverse Proxy Issue #938](https://github.com/mholt/caddy/issues/938)


### 1. What version of Caddy are you running (caddy -version)?

    $ docker --version
    Docker version 1.11.2, build b9f10c9
    $ docker-compose --version
    docker-compose version 1.8.0-rc1, build 9bf6bc6
    $ docker run --rm -it ubergarm/caddy --version
    Caddy 0.9.0
    $ cat /proc/version
    Linux version 3.10-2-amd64 (debian-kernel@lists.debian.org) (gcc version 4.7.3 (Debian 4.7.3-6) ) #1 SMP Debian 3.10.7-1 (2013-08-17)
    # also confirmed the problem exists on new Ubuntu 16.04 desktop

### 2. What are you trying to do?

Reverse proxy [rethinkdb](https://www.rethinkdb.com/docs/security/#via-a-reverse-proxy) Admin interface.

### 3. What is your entire Caddyfile?

    http://localhost {
        redir https://localhost{uri}
    }

    https://localhost {
        root /html

        proxy /admin rdb:8080 {
            without /admin
        }

        log stdout
        errors stderr

        tls self_signed
    }

### 4. How did you run Caddy (give the full command and describe the execution environment)?
From the `Dockerfile.caddy` you can see it is calling `caddy_linux_amd64 -agree`. The `rethinkdb` is linked to the Caddy container so it can find it at hostname `rdb`.

### 5. What did you expect to see?
I expected to see all `200` responses.

### 6. What did you see instead (give full error messages and/or log)?
Sometimes I would get a `502` error instead, but this never happens when hitting
the service directly instead of through the reverse proxy.

    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:49 +0000] "POST /admin/ajax/reql/?conn_id=G+r4LTLCk3MAw0arPi4GAQ== HTTP/2.0" 200 86
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:50 +0000] "POST /admin/ajax/reql/?conn_id=G+r4LTLCk3MAw0arPi4GAQ== HTTP/2.0" 200 86
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:52 +0000] "POST /admin/ajax/reql/?conn_id=G+r4LTLCk3MAw0arPi4GAQ== HTTP/2.0" 200 86
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:52 +0000] "POST /admin/ajax/reql/?conn_id=BhMc83y3tIBZ3hAEbwakVg== HTTP/2.0" 200 308
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:52 +0000] "POST /admin/ajax/reql/?conn_id=fOvF/MDLQxOqZ2CzXClMUA== HTTP/2.0" 200 451
    caddy_1  | 30/Jul/2016:17:30:52 +0000 [ERROR 502 /ajax/reql/] unreachable backend
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:52 +0000] "POST /admin/ajax/reql/?conn_id=ZLD9NCq4/ytwEolR8YHn4Q== HTTP/2.0" 502 16
    caddy_1  | 30/Jul/2016:17:30:53 +0000 [ERROR 502 /admin/ajax/reql/] unreachable backend
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:53 +0000] "POST /admin/ajax/reql/?conn_id=G+r4LTLCk3MAw0arPi4GAQ== HTTP/2.0" 502 16
    caddy_1  | 30/Jul/2016:17:30:57 +0000 [ERROR 502 /admin/ajax/reql/] unreachable backend
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:57 +0000] "POST /admin/ajax/reql/?conn_id=BhMc83y3tIBZ3hAEbwakVg== HTTP/2.0" 502 16
    caddy_1  | 30/Jul/2016:17:30:57 +0000 [ERROR 502 /admin/ajax/reql/] unreachable backend
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:30:57 +0000] "POST /admin/ajax/reql/?conn_id=fOvF/MDLQxOqZ2CzXClMUA== HTTP/2.0" 502 16
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:20 +0000] "POST /admin/ajax/reql/close-connection?conn_id=fOvF/MDLQxOqZ2CzXClMUA== HTTP/2.0" 200 0
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:20 +0000] "POST /admin/ajax/reql/close-connection?conn_id=G+r4LTLCk3MAw0arPi4GAQ== HTTP/2.0" 200 0
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:21 +0000] "POST /admin/ajax/reql/open-new-connection?cacheBuster=0.8526856273987615 HTTP/2.0" 200 24
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:21 +0000] "POST /admin/ajax/reql/?conn_id=JR35LdPBV83pMJiV+ulBew== HTTP/2.0" 200 136
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:21 +0000] "POST /admin/ajax/reql/close-connection?conn_id=JR35LdPBV83pMJiV+ulBew== HTTP/2.0" 200 0
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:21 +0000] "POST /admin/ajax/reql/open-new-connection?cacheBuster=0.06600066906892221 HTTP/2.0" 200 24
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:21 +0000] "POST /admin/ajax/reql/open-new-connection?cacheBuster=0.3583739526723704 HTTP/2.0" 200 24
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:21 +0000] "POST /admin/ajax/reql/open-new-connection?cacheBuster=0.9304607503322764 HTTP/2.0" 200 24
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:22 +0000] "POST /admin/ajax/reql/?conn_id=JmLkP3jf4Xfc7MEr6Lyyyw== HTTP/2.0" 200 308
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:22 +0000] "POST /admin/ajax/reql/?conn_id=WQdrwkyUaT+BZB1z3lKxbg== HTTP/2.0" 200 86
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:22 +0000] "POST /admin/ajax/reql/?conn_id=HisapNMBfQhcmne46hqqPg== HTTP/2.0" 200 450
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:23 +0000] "POST /admin/ajax/reql/?conn_id=WQdrwkyUaT+BZB1z3lKxbg== HTTP/2.0" 200 86
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:24 +0000] "POST /admin/ajax/reql/?conn_id=WQdrwkyUaT+BZB1z3lKxbg== HTTP/2.0" 200 86
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:25 +0000] "POST /admin/ajax/reql/?conn_id=WQdrwkyUaT+BZB1z3lKxbg== HTTP/2.0" 200 86
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:26 +0000] "POST /admin/ajax/reql/?conn_id=WQdrwkyUaT+BZB1z3lKxbg== HTTP/2.0" 200 85
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:27 +0000] "POST /admin/ajax/reql/?conn_id=JmLkP3jf4Xfc7MEr6Lyyyw== HTTP/2.0" 200 308
    caddy_1  | 172.18.0.1 - [30/Jul/2016:17:31:27 +0000] "POST /admin/ajax/reql/?conn_id=HisapNMBfQhcmne46hqqPg== HTTP/2.0" 200 451

### 7. How can someone who is starting from scratch reproduce this behavior as minimally as possible?o reproduce the issue do:

    git clone https://github.com/ubergarm/stack-in-a-box
    cd stack-in-a-box
    git checkout proxy-issue
    docker-compose build
    docker-compose up

Keep an eye on TCP port status (see how TIME WAIT (tw) increases):

    watch -n.5 -d cat /proc/net/sockstat

Open a browser to [https://localhost/admin](https://localhost/admin).

Each reload of the main page adds just under 100 to tw.


### Hypothesis
Reload the main page and click around on the UI or just wait and it
seems that as the number of TCP tw sockets grows it will eventually miss
a request.  Then after the default 10 seconds timeout the OS might have
recycled some sockets and it will start working again.

Also setting `fail_timeout 0` and `max_fails 0` alleviates the symptoms.
