# Use the official Node.js image as a base
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 8081

# Default environment
ENV NODE_ENV=production

# Command to run the app
CMD ["yarn", "start:dev"]
