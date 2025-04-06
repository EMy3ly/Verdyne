import time
import adafruit_dht
import board
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

pinTemp = board.D17
sensor = adafruit_dht.DHT11(pin=pinTemp, use_pulseio=False)

@app.route('/measurements', methods=['GET'])
def get_measurements():
    try:
        temperature = sensor.temperature
        humidity = sensor.humidity
        response = jsonify({
            'temperature': round(temperature, 2),
            'humidity': round(humidity, 2)
        })
        status = 200
    except RuntimeError as error:
        print(error.args[0])
        response = jsonify({'error': 'Failed to read temperature and humidity'})
        status = 500
    return response, status


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
    
