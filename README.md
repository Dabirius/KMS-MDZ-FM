# MDZ Process Automation

The Process Automation Software runs as a docker stack.

## Installation

Copy the `docker-compose.yaml` onto your server and create a `.env` and a `data.json` with the following contents besides it.

`.env`
```shell
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
EXT_PORT_NODE=3000 # public port, application will be served at http://localhost:3000

COMPOSE_PROJECT_NAME=rpa
```

`data.json`
```json
{
  "open_ai_api_key": "",
  "llm": {
    "open_ai_llm": false,
    "llm_url": "https://your-custom-llm.com/api/v1/chat/completions",
    "llm_post_body": {
      "comment": "<Should be adjusted to your API endpoint. If open_ai_llm is true, model is needed.>",
      "model": "your-model"
    },
    "llm_post_header": {
      "comment": "<Should be adjusted to your API endpoint. If open_ai_llm is true, the bearer is needed.>",
      "Content-Type": "application/json",
      "comment2": "<Optional, depending on your setup>",
      "Authorization": "Bearer your_custom_api_key" 
    },
    "system_prompt": "You are a highly knowledgeable AI assistant.",
    "pre_prompt": "You are an assistant designed to help with document searches. Answer the questions based on the documents."
  },
  "embeddings": {
    "comment": "<Set to false for own embedding model>",
    "open_ai_embeddings": false,
    "comment2": "<Needed when open_ai_embeddings is true>",
    "embedding_model": "",
    "comment3": "<Adjust to the input dimension of your embedding model>",
    "embedding_dimension": 3072, 
    "qdrant_collection": "your_collection_name",
    "comment4": "<Add own embedding endpoint here if open_ai_embeddings is false. Example endpoint is in multilingual_e5.py>",
    "url_embeddings": "https://your-custom-embedding-service.com/api/embeddings"
  },
  "search": {
    "comment": "<Can be adjusted, however it depends on the max context length of your LLM.>",
    "top_k": 5
  }
}
```

## Startup

Upon complete Setup, the Software can be start with docker compose

```bash
docker compose pull
docker compose up -d
```

The Application will be running at `http://localhost:3000`.
