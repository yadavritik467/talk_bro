# Use the official Node.js version from https://hub.docker.com/
FROM node:20.9.0-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy only the package.json file to the working directory
COPY package.json .

RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev"]