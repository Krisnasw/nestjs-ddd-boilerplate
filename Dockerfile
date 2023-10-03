# Base image
FROM node:18-alpine

# Set environment variables
ENV DB_URL=<your_db_url>
ENV MONGO_URL=<your_mongo_url>

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

# Install and configure Prisma
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN yarn build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]