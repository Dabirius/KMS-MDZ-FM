# MDZ Process Automation

This project is based on Nuxt 3 with Vue for the UI. For the backend and server capabilities we are using Node with Prisma database schemas. 

## Requirements

To run this project and contribute to the development, you need to have Node, NPM and Docker installed. 

Node should be used in version 20.

## Setup

Make sure to install the dependencies and setup the project:

```bash
# npm
npm run setup
```

## Development Server

Start the development server of the UI on `http://localhost:3000`:

```bash
# npm
npm run dev
```

### Environment Variables Setup

For local development you will need to setup environment variables in an `.env` file. This is a template for a possible configuration.

```text
HOST=0.0.0.0
DATABASE_SSL=false

NODE_ENV=development

DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432

POSTGRES_DB=project-assistant
POSTGRES_USER=project-assistant
POSTGRES_PASSWORD=mdz

PGADMIN_DEFAULT_EMAIL=mail@address.com
PGADMIN_DEFAULT_PASSWORD=test

DATABASE_URL=postgres://project-assistant:mdz@localhost:5432/project-assistant?schema=public

MIDDLEWARE_API_BASEPATH=(URL to middleware for api calls)

EXT_PORT_DB=5432
EXT_PORT_PGADMIN=1339
EXT_PORT_NODE=3000
```

### Database in development server

To start a local database and admin database user interface, please use the dev version of the docker compose. 

To start this environment and start the postgres database server on the local port `5432` and pgAdmin on Port `1339`: 

```bash
# docker
docker compose -f docker-compose.dev.yaml up -d
```


## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

### Database in production server

To start a production database and admin database user interface, please use the prod version of the docker compose.

To start this environment and start the postgres database server on the ports defined in the environment file :

```bash
# docker
docker compose -f docker-compose.prod.yaml up -d
```
