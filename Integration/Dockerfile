FROM node:alpine

WORKDIR /Integration

COPY package.json ./
COPY package-lock.json ./

RUN npm install -f

COPY . .

CMD ["npm","test"]
