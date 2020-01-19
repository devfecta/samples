const http = require('http');
const https = require('https');
const fileSystem = require('fs');

/**
 * When the server start it will get data from swapi and create a JSON file
 * containing the returned data, then reads the file to put the data into an array.
 */
https.get("https://swapi.co/api/people/", async response => {

    let swData = '';
    
    response.setEncoding("utf8");

    await response.on('data', data => {
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

const server = http.createServer((request, response) => {
/*
    setTimeout(function() {
        const delay = Date.now() - timeoutScheduled;
      
        console.log(`${delay}ms have passed since I was scheduled`);
      }, 2000);
*/
    switch(request.url) {
        case '/json':
            switch(request.method) {
                case 'POST':
                    break;
                case 'PUT':
                    break;
                case 'DELETE':
                    break;
                default:
                    // Endpoint to GET characters.
                    //console.log(request.method);
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.end(JSON.stringify(characters));
                    break;
            }
            break;
        default:
            /*
            response.write("<!DOCTYPE \"html\">");
            response.write("<html>");
            response.write("<head>");
            response.write("<title>Node.js Sample</title>");
            response.write("</head>");
            response.write("<body>");
            response.write("<ul>");
            characters.forEach(character => {
                //console.log(character.name);
                response.write("<li>" + character.name + "</li>");
            });
            response.write("</ul>");
            response.write("</body>");
            response.write("</html>");
            */
           fileSystem.readFile('index.html', (error, page) => {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(page.toString());
                response.end();
            });
            break;
    }

});

// server.setTimeout(3000, console.log('timed out'));

server.listen(3000, () => {
    console.log('Server is Running');
});

