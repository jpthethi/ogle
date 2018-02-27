FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies from local
#COPY package.json /usr/src/app/

# Bundle app source
COPY . /usr/src/app

# RUN npm install

EXPOSE 3030
CMD [ "npm", "start" ]
