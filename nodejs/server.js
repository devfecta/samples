const http = require('http');
const https = require('https');
const fileSystem = require('fs');

https.get("https://swapi.co/api/people/", response => {

    let swData = '';
    
    response.setEncoding("utf8");

    response.on('data', data => {
        swData += data.toString();
    })
    .on('end', () => {

        let json = JSON.stringify(JSON.parse(swData).results, null, 2);

        fileSystem.writeFile('sw.json', json, (error) => {
            if (error) throw error;
            console.log('File Created');
        });
        
        fileSystem.readFile('sw.json', (error, data) => {
            if (error) throw error;
            getCharacters(JSON.parse(data));
            console.log(JSON.parse(data).length);
        });

    });

});

let characters = [];

const getCharacters = (data) => {
    characters = data;
}

/*
const getCharacters = async () => {
    await fetch("https://swapi.co/api/people/", {
        "method": "GET",
        "headers": {
            "Content-Type": "text/json"
        }
    })
    .then(response => response.json())
    .then(json => {

        const characters = json.results.map(character => character.name);

        fileSystem.writeFile('sw.json', characters, (error) => {

            if(error) {
                throw error;
            }
        
            console.log('File Created');
        
        });


    })
    .catch(error => {
        console.error(error);
    });
}
*/

const server = http.createServer((request, response) => {
/*
    setTimeout(function() {
        const delay = Date.now() - timeoutScheduled;
      
        console.log(`${delay}ms have passed since I was scheduled`);
      }, 2000);
*/
    let responseCode = response.statusCode;

    if (responseCode === 200) {

        response.setHeader('Content-Type', 'text/plain');

        characters.forEach(character => {
            console.log(character.name);
        });

        //console.log(characters);

        //response.setHeader('Cache-Control', 'max-age=10, must-revalidate=20');
        
        response.end(JSON.stringify(response.getHeaders()));
        
    }

});

// server.setTimeout(3000, console.log('timed out'));

server.listen(3000, () => {
    console.log('Server is Running');
});

