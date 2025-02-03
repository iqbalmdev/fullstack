# Use official Node.js image as the base
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json  ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port that Next.js uses
EXPOSE 3000

# Set the environment variables to configure API URLs
ENV AUTH_URL=http://auth-service:5001
ENV USER_URL=http://user-service:4201

# Start the Next.js application
CMD ["npm", "run", "start"]
