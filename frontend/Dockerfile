FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build step is needed for next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
