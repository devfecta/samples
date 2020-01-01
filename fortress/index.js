
const init = () => {
    let submitButton = document.querySelector("#submitButton");
    submitButton.setAttribute('value', 'Submit');
    submitButton.addEventListener("click", processFile);
}

window.onload = init;

const processFile = (csvFile) => {

    console.log('Clicked');
    //let fileName = 'coding_example.csv';


}

