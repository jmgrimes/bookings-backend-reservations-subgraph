FROM node:20-slim
LABEL maintainer=jonah.grimes@gmail.com

# Environment.
ENV MONGODB_URI=mongodb://localhost/reservations

# Image Composition.
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Image Executable.
CMD ["node", "dist/main.js"]