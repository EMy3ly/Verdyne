var flag = false; // Flag to check if the data is already displayed
var temperatureArray = []; // Array to store temperature values
var labelsArray = []; // Array to store timestamps for the chart
var temperatureChart; // Chart.js instance

console.log("plant_reader.js loaded"); // Debugging line

function createDataDiv() {
    var data = document.createElement("div");
    data.setAttribute("id", "data");
    
    var temp = document.createElement("p");
    temp.setAttribute("id", "temp");
    temp.innerHTML = "Temperature: ---";
    data.appendChild(temp);
    
    var humi = document.createElement("p");
    humi.setAttribute("id", "humi");
    humi.innerHTML = "Humidity: --- ";
    data.appendChild(humi);
    
    var chartCanvas = document.createElement("canvas");
    chartCanvas.setAttribute("id", "temperatureChart");

    const mainDiv = document.querySelector(".card-content");
    mainDiv.appendChild(data); // Append the data div to the main div
    mainDiv.appendChild(chartCanvas); // Append the chart canvas to the main div
    console.log("Data div created"); // Debugging line

    // Create a canvas for the chart
}

async function fetchTemperature() {
    try {
        const response = await fetch('https://ed6e08a16c8e3b663d0558a6e841cb5f.serveo.net/measurements');
        const data = await response.json();
        document.getElementById('temp').innerText = "Temperature: " + data.temperature;
        document.getElementById('humi').innerText = "Humidity: " + data.humidity;

        // Store the temperature value and timestamp
        temperatureArray.push(data.temperature);
        labelsArray.push(new Date().toLocaleTimeString());

        // Update the chart
        if (temperatureChart) {
            temperatureChart.update();
        }
    } catch (error) {
        console.error('Error fetching temperature:', error);
    }
}

function initializeChart() {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsArray, // Timestamps
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureArray, // Temperature values
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

function showData() { 
    console.log(flag); // Debugging line
    if (!flag) {
        flag = true; // Set the flag to true to prevent multiple calls
        createDataDiv(); // Create the data div only once
    }
    setInterval(fetchTemperature, 2000); // Update every 5 sec
    fetchTemperature();
}



/*
TO DO:
 - ngrock pe rpi
    -> wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip
    -> unzip ngrok-stable-linux-arm.zip

    onst response = await fetch('https://randomstring.ngrok.io/temperature');
*/

// Define the showPopup function in the global scope
function showPopup(imageSrc, description) {
    const popupContainer = document.getElementById("popup-container");
    const popupImage = document.getElementById("popup-image");
    const popupDescription = document.getElementById("popup-description");
  
    popupImage.src = imageSrc; // Set the popup image source
    popupDescription.innerHTML = description; // Set the popup description (supports HTML content)
    popupContainer.classList.remove("hidden"); // Show the popup
  }
  
  // Ensure the DOM is fully loaded before creating the popup container
  document.addEventListener("DOMContentLoaded", () => {
    const popupContainer = document.createElement("div");
    popupContainer.id = "popup-container";
    popupContainer.classList.add("popup", "hidden");
  
    popupContainer.innerHTML = `
      <div class="popup-content">
        <span id="close-popup" class="close-btn">&times;</span>
        <img id="popup-image" src="" alt="Plant Image" />
        <p id="popup-description"></p>
      </div>
    `;
  
    document.body.appendChild(popupContainer);
  
    const closePopup = document.getElementById("close-popup");
  
    // Close the popup when the close button is clicked
    closePopup.addEventListener("click", () => {
      popupContainer.classList.add("hidden");
    });
  
    // Close the popup when clicking outside the popup content
    popupContainer.addEventListener("click", (event) => {
      if (event.target === popupContainer) {
        popupContainer.classList.add("hidden");
      }
    });
  });