# dchess

Initialized using [@stackr/sdk](https://www.stackrlabs.xyz/)

## How to run?

### Run using Node.js :rocket:

```bash
npm start
```

### Run using Docker :whale:

- Build the image using the following command:

```bash
# For Linux
docker build -t dchess:latest .

# For Mac with Apple Silicon chips
docker buildx build --platform linux/amd64,linux/arm64 -t dchess:latest .
```

- Run the Docker container using the following command:

```bash
# If using SQLite as the datastore
docker run -v ./db.sqlite:/app/db.sqlite -p <HOST_PORT>:<CONTAINER_PORT> --name=dchess -it dchess:latest

# If using other URI based datastores
docker run -p <HOST_PORT>:<CONTAINER_PORT> --name=dchess -it dchess:latest
```
