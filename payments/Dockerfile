FROM node:alpine

WORKDIR /app

COPY package*.json ./
# install only production dependencies
RUN npm install --only=prod
COPY ./ ./ 

CMD ["npm", "start"]