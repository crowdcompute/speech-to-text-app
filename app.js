var express = require('express');

var cors = require('cors')

const DeepSpeech = require('deepspeech');
const Fs = require('fs');
const Sox = require('sox-stream');
const MemoryStream = require('memory-stream');
const Duplex = require('stream').Duplex;
const Wav = require('node-wav');

const BEAM_WIDTH = 1024;
const N_FEATURES = 26;
const N_CONTEXT = 9;
let modelPath = './models/output_graph.pbmm';
let alphabetPath = './models/alphabet.txt';

let model = new DeepSpeech.Model(modelPath, N_FEATURES, N_CONTEXT, alphabetPath, BEAM_WIDTH);

const LM_ALPHA = 0.75;
const LM_BETA = 1.85;
let lmPath = './models/lm.binary';
let triePath = './models/trie';

model.enableDecoderWithLM(alphabetPath, lmPath, triePath, LM_ALPHA, LM_BETA);

function bufferToStream(buffer) {
	let stream = new Duplex();
	stream.push(buffer);
	stream.push(null);
	return stream;
}


// const bodyParser= require('body-parser')
const multer = require('multer')

var upload = multer({  dest: 'uploads/' })
var app = express();

app.use(cors())

// app.use(bodyParser.urlencoded({extended: true}))
const execSync = require('child_process').execSync;

app.post('/', upload.single('data'), function(req, res, next){
    execSync(`ffmpeg -i ${req.file.path}  ${req.file.path + ".wav"}`)
    // Fs.renameSync(req.file.path, req.file.path + ".wav")
    const buffer = Fs.readFileSync(req.file.path + ".wav")
    let audioStream = new MemoryStream();
    bufferToStream(buffer).
    pipe(Sox({
        global: {
            'no-dither': true,
        },
        output: {
            bits: 16,
            rate: 16000,
            channels: 1,
            encoding: 'signed-integer',
            endian: 'little',
            compression: 0.0,
            type: 'wav'
        }
    })).
    pipe(audioStream);
    audioStream.on('finish', () => {
	
        let audioBuffer = audioStream.toBuffer();
        
        const audioLength = (audioBuffer.length / 2) * ( 1 / 16000);
        console.log('audio length', audioLength);
        
        let result = model.stt(audioBuffer.slice(0, audioBuffer.length / 2), 16000);
        
        // console.log('result:', result);
        res.json({ result: result })
    });
    
    
});

app.listen(3000);