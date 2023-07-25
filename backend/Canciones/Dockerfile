FROM node:alpine

WORKDIR /canciones

COPY package.json ./
COPY package-lock.json ./
COPY .env ./

RUN npm install -f

COPY . .

EXPOSE 3003

CMD ["npm","run","serve"]

# sudo docker build -t alvarosp24/ayd2_canciones . --no-cache --force-rm
# sudo docker login
# sudo docker push alvarosp24/ayd2_canciones

# sudo docker run -p 3003:3003 alvarosp24/ayd2_canciones.