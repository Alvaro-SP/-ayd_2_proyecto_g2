FROM node
WORKDIR /frontend

COPY package.json ./
COPY package-lock.json ./
COPY .env ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]

# FROM node:18.14.0-buster-slim
# # Copy app
# COPY . /opt/app

# WORKDIR /opt/app

# # Npm install
# RUN npm install

# RUN npm run build

# RUN npm install -g serve

# EXPOSE 3000

# Container Startup
# CMD ["serve", "-s", "build"]


# sudo docker build -t alvarosp24/ayd2_frontend . --no-cache --force-rm
# sudo docker push alvarosp24/ayd2_frontend

# sudo docker run -p 3000:3000 alvarosp24/ayd2_frontend
