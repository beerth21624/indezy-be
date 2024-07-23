# Use an official Node runtime as the parent image
FROM node:19.7.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json, yarn.lock, and tsconfig.json
COPY package.json yarn.lock tsconfig.json ./

# Copy the entire src directory
COPY src ./src

# Copy prisma directory
COPY prisma ./prisma

# Install dependencies
RUN yarn install --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build