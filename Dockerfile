# Use the official Node.js image.
FROM node:14-alpine

# Set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock).
COPY package*.json ./

# Install dependencies.
RUN pnpm install

# Copy the rest of the application files.
COPY . .

# Build the application.
RUN pnpm run build

# Expose the port the app runs on.
EXPOSE 3000

# Start the application.
CMD ["pnpm", "start"]
