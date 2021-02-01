# --------------------------
# Build stage
# --------------------------
FROM node:12.16 as builder

USER node

ADD --chown=node ./package*.json /app/
WORKDIR /app

RUN npm ci

COPY --chown=node . /app
RUN npm run build
#RUN npm prune --production

# --------------------------
# Copy to target image
# --------------------------
FROM node:12.16-alpine

USER node

COPY --from=builder --chown=node /app/package.json /app/package.json
COPY --from=builder --chown=node /app/dist /app/dist
COPY --from=builder --chown=node /app/node_modules /app/node_modules
COPY --from=builder --chown=node /app/docs /app/docs

WORKDIR /app

CMD ["node", "/app/dist/main.js"]
