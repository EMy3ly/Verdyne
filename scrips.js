async function fetchTemperature() {
    try {
        const response = await fetch('http://<your-raspberry-pi-ip>:5000/temperature');
        const data = await response.json();
        document.getElementById('temp').innerText = data.temperature;
        document.getElementById('humi').innerText = data.humidity;
    } catch (error) {
        console.error('Error fetching temperature:', error);
    }
}

setInterval(fetchTemperature, 5000); // Update every 5 sec
fetchTemperature();

/*
TO DO:
 - ngrock pe rpi
    -> wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip
    -> unzip ngrok-stable-linux-arm.zip

    onst response = await fetch('https://randomstring.ngrok.io/temperature');
*/