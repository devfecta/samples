const http = require('http');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
const fileSystem = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/result', (request, response) => {


    if(!request.files) {
        response.send("File was not found");
        return;
    }
    else {

        let galaxies = [];

        let readData = request.files.csvDocument.data.toString();

        galaxies = readData.split('\r');

        console.log(galaxies);

        // console.log(request.files.csvDocument.data.toString());
        

        //const readData = request.files.csvDocument.data.toString('utf-8');
        /*
        const readData = fileSystem.createReadStream(request.files.csvDocument.data).pipe(csv());
        readData.on('data', function(rowData) {
            galaxies = [...galaxies, rowData];
        })
        .on('end', () => { console.log(galaxies) });
        */       
    }

    
    response.write('<h1>Hello World</h1>');
    response.end();
});

app.get('/', (request, response) => {
    fileSystem.readFile('index.html', (error, data) => {
        let contents = data ? data : error;
        response.write(contents);
        response.end();
    });
});

let listener = app.listen(3000, () => {
    console.log('Listening on port ' + listener.address().port);
});
