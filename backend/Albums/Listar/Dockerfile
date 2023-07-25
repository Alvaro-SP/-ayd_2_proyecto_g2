FROM node:18.7.0-alpine

WORKDIR /src/app
COPY package*.json /src/app/
RUN npm install
COPY . .
COPY .env .
EXPOSE 3002
CMD ["npm","run","dev"]
# sudo docker build -t alvarosp24/ayd2_listar . --no-cache --force-rm
# sudo docker login
# sudo docker push alvarosp24/ayd2_listar

# sudo docker run -p 3002:3002 alvarosp24/ayd2_listar.