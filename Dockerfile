FROM node:10.13-alpine

WORKDIR /app
COPY . .
RUN npm install

RUN adduser -D edtx
USER edtx

ENTRYPOINT ["npm", "start"]
