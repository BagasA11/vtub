FROM node:27.0.0-alpha.0.1.0-alpine3.24

WORKDIR /app 

COPY package.json ./ 
COPY package-lock.json ./ 
RUN npm install

COPY . .

EXPOSE 3000 

CMD ["npm", "start"]