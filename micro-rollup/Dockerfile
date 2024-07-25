FROM node:lts-bookworm-slim

ARG NPM_TOKEN
ENV NPM_TOKEN $NPM_TOKEN

RUN npm install -g npm@latest

# Install bun globally
RUN npm install -g bun

WORKDIR /app

# Set the NPM token for private package access
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

# Copy env files
COPY .env .env

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
