## Getting started with codespaces

First install [localtunnel](https://github.com/localtunnel/localtunnel):

```bash
npm install -g localtunnel
```

## Server

After running server, on a separate terminal run:

```bash
lt --port [server port] --subdomain [subdomain name]
```

.env file configuration:

```bash
CLIENT_URL=https://[client subdomain name].loca.lt
BASE_DOMAIN=.loca.lt
```

## Web

After running web, on a separate terminal run:

```bash
lt --port [web port] --subdomain [subdomain name]
```

.env file configuration:

```bash
API_URI=https://[server subdomain name].loca.lt
```

Open the browser and go to https://[client subdomain name].loca.lt to see client.

If error occurs on the web try deleting .next folder and run `yarn dev` again
