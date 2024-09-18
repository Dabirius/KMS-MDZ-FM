# MDZ Process Automation

The Process Automation Software runs as a docker stack.

## Installation

Copy the `docker-compose.prod.yaml` onto your server and create a `.env` with the following contents besides it.

```text
HOST=0.0.0.0
DATABASE_SSL=false

NODE_ENV=production

DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432

POSTGRES_DB=project-assistant
POSTGRES_USER=project-assistant
POSTGRES_PASSWORD=mdz

PGADMIN_DEFAULT_EMAIL=mail@address.com
PGADMIN_DEFAULT_PASSWORD=test

DATABASE_URL=postgres://project-assistant:mdz@localhost:5432/project-assistant?schema=public

EXT_PORT_DB=5432
EXT_PORT_PGADMIN=1339
EXT_PORT_NODE=3000

COMPOSE_PROJECT_NAME=rpa
```

## Startup

Upon complete Setup, the Software can be start with docker compose

```bash
docker compose pull
docker compose up -d
```
