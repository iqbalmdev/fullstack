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
ENV NEXT_PUBLIC_AUTH_URL=http://auth-service:5001
ENV NEXT_PUBLIC_USER_URL=http://user-service:4001

# Start the service
CMD ["npm", "run", "start"]