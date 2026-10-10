FROM node:22-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server/src ./src
USER node
ENV NODE_ENV=production PORT=8787 TRUST_PROXY=1
EXPOSE 8787
HEALTHCHECK --interval=15s --timeout=4s --start-period=20s CMD wget -qO- http://127.0.0.1:8787/health || exit 1
CMD ["node", "src/server.js"]
