FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npx next telemetry disable
    
EXPOSE 3000

ENTRYPOINT ["npm", "run"]
CMD ["start"]
