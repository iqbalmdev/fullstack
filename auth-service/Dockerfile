# Use official Node.js image with Alpine
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install necessary system dependencies for bcrypt
RUN apk add --no-cache python3 make g++

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose ports
EXPOSE 5001

# Set environment variables
ENV HTTP_PORT=5001
ENV TCP_PORT=5002

# Start the service
CMD ["npm", "run", "start"]