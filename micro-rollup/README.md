# dchess

Initialized using [@stackr/sdk](https://www.stackrlabs.xyz/)

## How to run?

### Run using Node.js :rocket:

```bash
npm start
```

### Run using Docker :whale:

- Build the image using the following command: (make sure you replace \`<NPM_TOKEN>\` with the actual value)

```bash
# For Linux
docker build -t dchess:latest . --build-arg NPM_TOKEN=<NPM_TOKEN>

# For Mac with Apple Silicon chips
docker buildx build --platform linux/amd64,linux/arm64 -t dchess:latest . --build-arg NPM_TOKEN=<NPM_TOKEN>
```

- Run the Docker container using the following command:

```bash
# If using SQLite as the datastore
docker run -v ./db.sqlite:/app/db.sqlite -p <HOST_PORT>:<CONTAINER_PORT> --name=dchess -it dchess:latest

# If using other URI based datastores
docker run -p <HOST_PORT>:<CONTAINER_PORT> --name=dchess -it dchess:latest
```
