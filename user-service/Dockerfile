# Use official Node.js image as the base
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose HTTP port for the API
EXPOSE 4201

# Set the environment variables
ENV HTTP_PORT=4201
ENV TCP_AUTH_PORT=5002

# Start the user service
CMD ["npm", "run", "start"]
