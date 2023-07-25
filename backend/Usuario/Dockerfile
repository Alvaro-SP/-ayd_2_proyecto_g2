FROM node:alpine

WORKDIR /usuario

COPY package.json ./
COPY package-lock.json ./
COPY .env ./

RUN npm install -f

COPY . .

EXPOSE 3008

CMD ["npm","run","start"]

# sudo docker build -t alvarosp24/ayd2_usuario . --no-cache --force-rm
# sudo docker login
# sudo docker push alvarosp24/ayd2_usuario

# sudo docker run -p 3008:3008 alvarosp24/ayd2_usuario.