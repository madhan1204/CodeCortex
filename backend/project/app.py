from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import requests
import pandas as pd
from datetime import datetime, timedelta
import joblib

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Global API key for weather API
API_KEY = "5460889761385624e130f4ee0e0ad810"

# Function to fetch weather data for a specific time slot
def fetch_weather_data(api_key, city, date_str, start_hour, end_hour):
    url = f"http://api.weatherstack.com/current?access_key={api_key}&query={city}&units=m"
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200 and 'current' in data:
            current_temp = data['current']['temperature']
            humidity = data['current']['humidity']
            wet_bulb_temp = current_temp - (humidity / 100) * 5

            # Create a DataFrame with hourly weather data for the entire day
            start_time = datetime.strptime(date_str, "%Y-%m-%d")
            timestamps = [start_time + timedelta(hours=i) for i in range(24)]
            weather_data = pd.DataFrame({
                "Timestamps": timestamps,
                "Temperature": [current_temp] * len(timestamps),
                "RH": [humidity] * len(timestamps),
                "WBT_C": [wet_bulb_temp] * len(timestamps)
            })

            # Filter for the specific time slot
            filtered_data = weather_data[(weather_data['Timestamps'].dt.hour >= start_hour) & 
                                         (weather_data['Timestamps'].dt.hour < end_hour)]
            return filtered_data.iloc[0]  # Return the first row for the selected time slot
        else:
            raise ValueError(f"Failed to fetch weather data. Response code: {response.status_code}")
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None

# Function to predict load capacity based on operational metrics and weather data
def predict_load_capacity(api_key, city, date_str, start_hour, end_hour, hotel_occupancy, operational_metrics):
    # Fetch weather data for the specific time slot
    weather_data = fetch_weather_data(api_key, city, date_str, start_hour, end_hour)
    
    if weather_data is None:
        return None

    # Load the pre-trained model
    model_filename = 'model/random_forest_model.pkl'
    rf_loaded = joblib.load(model_filename)

    # Extract the feature names the model was trained with
    model_features = rf_loaded.feature_names_in_  # This will give us the order of features used during training

    # Extract timestamp components (year, month, day, hour, minute) from the weather data
    timestamp = weather_data['Timestamps']
    year = timestamp.year
    month = timestamp.month
    day = timestamp.day
    hour = timestamp.hour
    minute = timestamp.minute

    # Add weekday to the input data
    input_date = datetime.strptime(date_str, "%Y-%m-%d")
    weekday = input_date.weekday()  # Returns an integer (0 = Monday, 6 = Sunday)

    # Add timestamp components and weekday to the operational metrics
    operational_metrics['year'] = year
    operational_metrics['month'] = month
    operational_metrics['day'] = day
    operational_metrics['hour'] = hour
    operational_metrics['minute'] = minute
    operational_metrics['weekday'] = weekday  # Add weekday (0-6) as a feature

    # Add weather data to operational metrics
    operational_metrics['Temperature'] = weather_data['Temperature']
    operational_metrics['RH'] = weather_data['RH']
    operational_metrics['WBT_C'] = weather_data['WBT_C']

    # Add hotel occupancy to the operational metrics
    operational_metrics['Hotel_Occupancy'] = hotel_occupancy

    # Convert the operational metrics to a DataFrame
    input_data = pd.DataFrame([operational_metrics])

    # Reorder the columns to match the model's feature order
    input_data = input_data[model_features]  # Reordering columns to match model feature order

    # Make predictions
    predictions = rf_loaded.predict(input_data)

    # Custom headers for the predicted values (adjust based on model's expected output)
    custom_headers = ['RT', 'CH Load', 'GPM', 'DeltaCHW', 'CHWS', 'CHWR']

    # Create a DataFrame for the predictions
    predictions_df = pd.DataFrame(predictions, columns=custom_headers)

    return predictions_df

# Define the Flask route to handle POST requests
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse the request JSON
        data = request.get_json()
        print("Received data:", data)

        # Extract input parameters from the request
        city = data['city']  # Get city from the request
        print(city)
        date_str = data['date']  # Date (YYYY-MM-DD)
        print(date_str)
        start_hour = data['start_hour']  # Start hour
        print(start_hour)
        hotel_occupancy = data['hotel_occupancy']  # Hotel occupancy percentage
        print(hotel_occupancy)
        operational_metrics = data['operational_metrics']  # Operational metrics
        print(operational_metrics)

        # Predict load capacity
        result = predict_load_capacity(API_KEY, city, date_str, start_hour, start_hour + 1, hotel_occupancy, operational_metrics)
        print(result.to_dict(orient='records'))

        if result is not None:
            return jsonify({'predictions': result.to_dict(orient='records')}), 200
        else:
            return jsonify({'error': 'Prediction failed'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
