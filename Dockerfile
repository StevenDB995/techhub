# Stage 1: Build React client
FROM node:20.17.0-bookworm AS build-client

WORKDIR /app/client

# Install client dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the client code and build the React app
COPY client/ .
RUN npm run build

# Stage 2: Build and run Express server
FROM node:20.17.0-bookworm

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./
RUN npm install

# Copy server code
COPY server/ .

# Copy the built React client from the first stage
COPY --from=build-client /app/client/dist ./dist

# Expose port 3000 of the container to the host machine
EXPOSE 3000

# Start the Express server
CMD ["npm", "start"]
