FROM node:alpine

WORKDIR /loginflow

COPY package.json ./
COPY package-lock.json ./
COPY .env ./

RUN npm install -f

COPY . .

EXPOSE 4000

CMD ["npm","run","server"]
# sudo docker build -t alvarosp24/ayd2_loginflow . --no-cache --force-rm
# sudo docker login
# sudo docker push alvarosp24/ayd2_loginflow

# sudo docker run -p 4000:4000 alvarosp24/ayd2_loginflow.