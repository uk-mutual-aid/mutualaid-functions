FROM node:10-alpine

RUN mkdir -p /src/functions
RUN mkdir -p /tmp/keys

RUN npm install nodemon -g firebase-tools @google-cloud/functions-emulator

WORKDIR /src/functions
ADD src/functions/package*.json src/functions/
# WARNING: the below line assumes that we are not hosting the built image, because the key is built into the image
# COPY src/tmp/keys/google-key.json src/temp/keys/google-key.json
RUN npm i
CMD npm start