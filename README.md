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




### Customizing the look of the frontend

To customize the look of the frontend there are two things you may want to change: the logo and the colors.
The following section will help you with each of those sections to change it accordingly.

#### Logo

1. Add your new logo for the frontend in the `assets/images` folder. A svg or png image is recommended. The height of the logo used in the frontend is currently limited to 40px, while the width is left to auto, so logos that are rectangular with the horizontal side longer than vertical side are recommended. Square images will also work, but images that are vertically higher than horizontally may scale down unexpectedly much and may require tweaking the styling.
2. Navigate to the component MDZSidebar, found in `assets/components`. You will find the div-element with class "logo" and within is an image element. The link in the image element should be replaced to point to your newly uploaded asset. Please keep the part before the file name the same to ensure the image is found in the different environments.
    ```html
    <div class="logo">
        <img src="~/assets/images/<filename.fileending>" />
   <!-- replace <filename.fileending> with your filename including its ending, e.g. logo.svg -->
    </div>
    ```
3. If you need to adjust the look, sizing or otherwise, it is recommended to overwrite the current styling via inline-styling to retain old styling, or adjust the styling within the above component, targeting the `.logo` class or its image within via `.logo > img`


#### Colors
To customize the colors used in the application, you will have to go through the application and replace the colors. To refer to colors, we use both *.scss as well as *.vue files.

Main theming settings are possible to set in the file `assets/styles/color/themes/default.scss`, respectively `assets/styles/color/color-definitions.scss` and `assets/styles/color/global-colors.scss`.

An example: To change the orange color of a button, you can use your web developer tools and identify if the color is given through a custom var (typically inferred from scss files) or given as a hex/rgba value (typically defined within the code).
You might be able to find a color definition set to ``var(--color-action-primary-default)``. You can then search for occurrences of `--color-action-primary-default` in the project and therefore trace it back to the variable `$color-action-primary-default` which points to the theming variable --color-action-primary-default that is set in the main theming file (see above).



## Setup of first/default advisor

To create an advisor, you can easily send a POST request to the api: (url)/api/advisors with the JSON body as follows:
```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max.mustermann@mail.de"
}
```

An example script to accomplish this via cURL in the shell could be like this:
```shell
curl --request POST \
  --url https://(url)/api/advisors \
  --header 'Content-Type: application/json' \
  --data '{
	"firstName": "Max",
	"lastName": "Mustermann",
	"email": "max.mustermann@mail.de"
}'
```

Please note that you must replace (url) with the url to your running server.

In the success case, you should receive an answer from the server with 200 OK, containing the newly created advisor object as response body data.


