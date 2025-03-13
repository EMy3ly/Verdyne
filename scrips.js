console.log('Hello, world!');
function printNumbers(){
    var number = parseInt(document.getElementById('date-in').value);
    console.log(number);
    for (let i = 1; i <= number; i++) {
        let paragraf = document.getElementById('display');
        paragraf.style.fontSize = '20px';
        paragraf.style.color = 'blue';
        paragraf.innerHTML += i + '<br>';
    }
}