FROM tensorflow/tensorflow:latest-py3

RUN apt install curl -y && curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN pip3 install deepspeech && apt install -y sox ffmpeg nodejs

COPY . /home/app/

WORKDIR /home/app

RUN npm install

ENTRYPOINT ["node", "app.js"]

EXPOSE 3000