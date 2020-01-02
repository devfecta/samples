const csv = require('csv');
const fileSystem = require('fs');
const express = require('express');
const app = express();
app.use(express.json());
const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.post('/result', (request, response) => {

    if(!request.files) {
        response.send("File was not found");
        return;
    }
    else {

        //let galaxies = [];
        /**
         * Setting readData to a string of data from the CSV file.
         * The trim method is used to remove additional white space because it caused problems
         * with the JSON property names.
         */
        let readData = request.files.csvDocument.data.toString().trim();
        // console.log(readData);
        /**
         * Parsing the readData in to JSON.
         */
        csv.parse(readData, {columns: true}, function(err, data) {
            /*
            A = 1  B = 2  C = 3  D = 4  E = 5  F = 6  G = 7  H = 8
            I = 9  J = 10  K = 11  L = 12  M = 13  N = 14  O = 15
            P = 16  Q = 17  R = 18  S = 19  T = 20  U = 21  V = 22
            W = 23  X = 24  Y = 25  Z = 26
            */

            let galaxies = JSON.parse(JSON.stringify(data, null, 2));
            // console.log(galaxies);

            response.writeHead(200, {'Content-Type': 'text/html'});
            /**
             * Mapping file names into an array of names that start with an odd numbered letter.
             */
            let oddFileNames = galaxies
            .map((g) => {
                /**
                 * Converting the first letter of a name to the ascii number to check if it's and odd number.
                 */
                if (g.file_name.charCodeAt(0) % 2) {
                    // console.log(g.file_name.charCodeAt(0) + ' - ' + g.file_name.charAt(0));
                    return g.file_name;
                }
            })
            .filter(name => name != undefined);
            // console.log(oddFileNames);
            /**
             * Filtering the titles into an array to get rid of duplicates.
             */
            let uniqueTitles = galaxies
            .map(galaxy => galaxy.title)
            .filter((name, index, galaxyNames) => 
                {
                    if (galaxyNames.indexOf(name) == index) {
                        return name;
                    }
                }
            );
            // console.log(uniqueTitles);
            /**
             * Mapping parent names and then adding related child names to the parent.
             */
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
            // console.log(nestedGalaxies);
            /**
             * Creating a string of HTML to be sent to the browser via the response.
             */
            let html = '';

            html += '<h3>Odd Numbered Names</h3>';
            html += '<ul>';
            oddFileNames.forEach(galaxy => {
                html += `<li>${galaxy}</li>`;
            });
            html += '</ul>';

            html += '<h3>Unique Names</h3>';
            html += '<ul>';
            uniqueTitles.forEach(galaxy => {
                html += `<li>${galaxy}</li>`;
            });
            html += '</ul>';

            html += '<h3>Nested Names</h3>';
            html += '<ul>';
            nestedGalaxies.forEach(parentGalaxy => {
                html += `<li>${parentGalaxy.parent}</li>`;
                if (parentGalaxy.children.length > 0) {
                    html += '<ul>';
                    parentGalaxy.children.forEach(childGalaxy => {
                        html += `<li>${childGalaxy}</li>`;
                    });
                    html += '</ul>';
                }
            });
            html += '</ul>';

            response.write(html);
            response.end();
            
        });

    }
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
