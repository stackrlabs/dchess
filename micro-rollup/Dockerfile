FROM node:lts-bookworm-slim

ARG PRIVATE_KEY
ARG DATABASE_URI
ARG VULCAN_RPC
ARG REGISTRY_CONTRACT

RUN npm install -g npm@latest

# Install bun globally
RUN npm install -g bun

WORKDIR /app

# Create .env file
RUN echo "NODE_ENV=development" >.env
RUN echo "PORT=3000" >>.env
RUN echo "PRIVATE_KEY=$PRIVATE_KEY" >>.env
RUN echo "DATABASE_URI=$DATABASE_URI" >>.env
RUN echo "VULCAN_RPC=$VULCAN_RPC" >>.env
RUN echo "REGISTRY_CONTRACT=$REGISTRY_CONTRACT" >>.env

# Copy package.json and tsconfig.json
COPY package.json package.json
COPY tsconfig.json tsconfig.json

# Copy Stackr files
COPY deployment.json deployment.json
COPY genesis-state.json genesis-state.json
COPY stackr.config.ts stackr.config.ts

# Copy source code
COPY src src

# Install dependencies
RUN npm install

# Command to run the application
CMD ["npm", "start"]
