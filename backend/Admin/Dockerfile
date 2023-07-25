FROM node:alpine

WORKDIR /admin

COPY package.json ./
COPY package-lock.json ./
COPY .env ./

RUN npm install -f

COPY . .

EXPOSE 4001

CMD ["npm","run","server"]
# sudo docker build -t alvarosp24/ayd2_admin . --no-cache --force-rm
# sudo docker login
# sudo docker push alvarosp24/ayd2_admin

# sudo docker run -p 4001:4001 alvarosp24/ayd2_admin.