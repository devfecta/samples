const http = require('http');
const csv = require('csv');

const csvJson = require('csvtojson')


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

        let readData = request.files.csvDocument.data.toString().trim();

        // console.log(readData);


        csv.parse(readData, {columns: true}, function(err, data) {
            /*
            A = 1  B = 2  C = 3  D = 4  E = 5  F = 6  G = 7  H = 8
            I = 9  J = 10  K = 11  L = 12  M = 13  N = 14  O = 15
            P = 16  Q = 17  R = 18  S = 19  T = 20  U = 21  V = 22
            W = 23  X = 24  Y = 25  Z = 26
            */

            galaxies = JSON.parse(JSON.stringify(data, null, 2));

            // console.log(galaxies);

            response.writeHead(200, {'Content-Type': 'text/html','Content-Length':galaxies.length});

            let oddFileNames = galaxies
            .map((g) => {
                if (g.file_name.charCodeAt(0) % 2) {
                    // console.log(g.file_name.charCodeAt(0) + ' - ' + g.file_name.charAt(0));
                    return g.file_name;
                }
            })
            .filter(name => name != undefined);
            console.log(oddFileNames);

            let uniqueTitles = galaxies
            .map(galaxy => galaxy.title)
            .filter((name, index, galaxyNames) => 
                {
                    if (galaxyNames.indexOf(name) == index) {
                        return name;
                    }
                }
            );
            console.log(uniqueTitles);

            let nestedGalaxies = galaxies
            .map(galaxy => { return {'id': galaxy.file_id, 'name': galaxy.file_name} })
            .map(parents => 
                {
                    //console.log(parent.id + '-' + galaxies[index].parent_id);
                    let children = galaxies.filter(galaxy => {
                        if (galaxy.parent_id == parents.id) {
                            //console.log(galaxy.parent_id + '=' + parents.id);
                            //console.log(parents.name + ">" + galaxy.title);
                            return galaxy.title;
                        }
                    })
                    .map(g => g.title);

                    return {'parent': parents.name, 'children': children};
                }
            );
            

            console.log(nestedGalaxies);

            response.write('test');

            
            response.end();
            
        });

        //console.log(galaxies);

        /*
        csvJson().fromStream(request.files.csvDocument.data)
        .then((json) => {
            console.log(json);
        });
        */
        // galaxies = readData.split('\r');
        // console.log(galaxies);

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

    
    //response.write('<h1>Hello World</h1>');
    //response.end();
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
