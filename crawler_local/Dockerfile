FROM node:10

RUN apt-get update
RUN apt-get install -yyq curl gnupg
RUN apt-get install -yyq ca-certificates
RUN apt-get install -yyq libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
RUN apt-get install -yyq gconf-service lsb-release wget xdg-utils
RUN apt-get install -yyq fonts-liberation

COPY package*.json ./
RUN npm install

#VOLUME ./searchresults

COPY . .

EXPOSE 5677
CMD exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"
#CMD ["node", "crawler_local.js", "./baseimage/0a0e509d384d9584557c1ac1a1e93f00.jpg", "./searchresults"]
