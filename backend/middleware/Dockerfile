FROM node:alpine

WORKDIR /middleware

COPY package.json ./
COPY package-lock.json ./
COPY .env ./

RUN npm install -f

COPY . .

EXPOSE 3010

CMD ["npm","run","start"]
# sudo docker build -t alvarosp24/ayd2_middleware . --no-cache --force-rm
# sudo docker login
# sudo docker push alvarosp24/ayd2_middleware

# sudo docker run -p 3010:3010 alvarosp24/ayd2_middleware.