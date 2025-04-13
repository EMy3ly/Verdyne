var flag = false; // Flag to check if the data is already displayed
var temperatureArray = []; // Array to store temperature values
var humidityArray = []; // Array to store humidity values
var labelsArray = []; // Array to store timestamps for the chart
var temperatureChart; // Chart.js instance
var combinedChart; // Combined chart instance



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
        const response = await fetch('https://346a187bccba8a5ef18ef981b02d94dc.serveo.net/measurements'); // Replace with your server URL
        const data = await response.json();
        document.getElementById('temp').innerText = "Temperature: " + data.temperature + "°C";
        document.getElementById('humi').innerText = "Humidity: " + data.humidity + "%";

        // Store the temperature value and timestamp
        temperatureArray.push(data.temperature);
        humidityArray.push(data.humidity);
        labelsArray.push(new Date().toLocaleTimeString());

        // Update the chart
        if (combinedChart) {
          combinedChart.update();
        }
    } catch (error) {
        console.error('Error fetching temperature:', error);
    }
}

function initializeCombinedChart() {
  const ctx = document.getElementById('combinedChart').getContext('2d');
  combinedChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labelsArray, // Timestamps
          datasets: [
              {
                  label: 'Temperature (°C)',
                  data: temperatureArray, // Temperature values
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  fill: true,
                  tension: 0.4
              },
              {
                  label: 'Humidity (%)',
                  data: humidityArray, // Humidity values
                  borderColor: 'rgba(54, 162, 235, 1)',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  fill: true,
                  tension: 0.4
              }
          ]
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
                      text: 'Values'
                  }
              }
          }
      }
  });
}

function showData() {
  if (!combinedChart) { // Prevent multiple initializations
      initializeCombinedChart(); // Initialize the graph
  }
  fetchTemperature(); // Fetch data immediately
  setInterval(fetchTemperature, 5000); // Fetch data every 2 seconds
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

//   <!------------------------------------PLANT-STRIKE---------------------------------------------------> 
 // Function to check the plant and update the streak
function checkPlant() {
    const today = new Date().toDateString(); // Get today's date as a string
    const lastChecked = localStorage.getItem("lastChecked"); // Get the last checked date from localStorage
    let streak = parseInt(localStorage.getItem("streak")) || 0; // Get the current streak from localStorage
  
    if (lastChecked === today) {
      // If the plant was already checked today
      document.getElementById("strike-message").innerText = "Ai verificat planta azi!";
    } else {
      // Update the streak and last checked date
      if (lastChecked) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastChecked === yesterday.toDateString()) {
          streak++; // Increment the streak if the last check was yesterday
        } else {
          streak = 1; // Reset the streak if the last check was not yesterday
        }
      } else {
        streak = 1; // Start a new streak if this is the first check
      }
  
      localStorage.setItem("lastChecked", today); // Save today's date as the last checked date
      localStorage.setItem("streak", streak); // Save the updated streak
      document.getElementById("strike-message").innerText = "Foarte bine! Planta e încă în viață!";
    }
  
    // Update the streak count in the UI
    document.getElementById("streak").innerText = streak;
  
    // Update the week container
    updateWeekContainer(streak);
  }
  
  // Function to update the week container
  function updateWeekContainer(streak) {
    const days = document.querySelectorAll(".week-days .day");
    days.forEach((day, index) => {
      if (index < streak) {
        day.classList.add("checked"); // Mark the day as checked
      } else {
        day.classList.remove("checked"); // Unmark the day
      }
    });
  }
  
  // Initialize the streak count and week container on page load
  document.addEventListener("DOMContentLoaded", () => {
    const streak = parseInt(localStorage.getItem("streak")) || 0;
    document.getElementById("streak").innerText = streak;
    updateWeekContainer(streak);
  });