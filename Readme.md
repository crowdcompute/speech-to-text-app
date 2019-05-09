# Speech-To-Text engine based on Baidu's Deep Speech



## Installation

Download the pre-trained model (1.8GB):

```
wget https://github.com/mozilla/DeepSpeech/releases/download/v0.4.1/deepspeech-0.4.1-models.tar.gz
tar xvfz deepspeech-0.4.1-models.tar.gz
```
Move the contents of file to `/models`

Build the docker file :

```
$ docker build .
```

Run the docker container:

```
$ docker run -d -p 3001:3000 {id_of_container}
```

## Run API

Now you can use postman or similar tools to upload the audio/video file to the service.
Upload audio/video file to `http://localhost:3001/` using form-data file with the `data` key name and wait for the json result.
