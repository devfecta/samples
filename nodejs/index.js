
const init = () => {

    

}

window.onload = init;

const getCharacters = async () => {
    await fetch("/json", {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {

        const characters = json.map(character => character.name);

        console.log(characters);

        characters.forEach( character => console.log(character) );

        const mapArray = characters.map(character => { return {'name': character, 'movie': 'all'} });

        console.log(mapArray);

        const filterArray = characters.filter(character => { 
            return character.match(/er/i);
        });

        console.log(filterArray);

        const reduceArray = characters.reduce((total, character) => { 
            return total.toString().concat(character.concat(' - '));
        }, '');

        console.log(reduceArray);

        const reduceRightArray = characters.reduceRight((total, character) => { 
            return total.toString().concat(character.concat(' = '));
        }, '');

        console.log(reduceRightArray);

        characters.sort();

        console.log(characters);

        characters.reverse();

        console.log(characters);

    })
    .catch(error => {
        console.error(error);
    });
}

getCharacters();