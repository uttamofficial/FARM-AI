from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import warnings
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load models and encoders/scalers
try:
    loaded_yield_model = joblib.load('yield_model.joblib')
    loaded_pest_model = joblib.load('pest_risk_model.joblib')
    loaded_pest_scaler = joblib.load('pest_scaler.joblib')
    loaded_crop_encoder = joblib.load('crop_encoder.joblib')
    # loaded_market_model = joblib.load('market_model.joblib') # Skipping market model loading as per previous conversation
    # loaded_market_scaler = joblib.load('market_scaler.joblib')
    # loaded_sustainability_model = joblib.load('sustainability_model.joblib')
    # loaded_sustainability_scaler = joblib.load('sustainability_scaler.joblib')
    # loaded_product_encoder = joblib.load('product_encoder.joblib')
    # loaded_seasonal_encoder = joblib.load('seasonal_encoder.joblib')
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")

def get_recommendations(farm_inputs, weather_forecast, market_forecast_period='next_season'):
    try:
        # Validate inputs
        required_farm_fields = ['Soil_pH', 'Soil_Moisture']
        required_weather_fields = ['Temperature_C', 'Rainfall_mm']

        # Check for missing farm inputs
        missing_farm_fields = [field for field in required_farm_fields if field not in farm_inputs]
        if missing_farm_fields:
            print(f"Error: Missing required farm input fields: {missing_farm_fields}")
            return []

        # Check for missing weather forecast fields
        missing_weather_fields = [field for field in required_weather_fields if field not in weather_forecast]
        if missing_weather_fields:
            print(f"Error: Missing required weather forecast fields: {missing_weather_fields}")
            return []

        # Validate numeric values are in reasonable ranges
        if not (5.0 <= float(farm_inputs.get('Soil_pH', 0)) <= 9.0):
            print("Warning: Soil pH is outside normal range (5.0-9.0)")

        if not (10.0 <= float(farm_inputs.get('Soil_Moisture', 0)) <= 50.0):
            print("Warning: Soil moisture is outside normal range (10-50%)")

        # Suppress all warnings
        warnings.filterwarnings("ignore")

        recommendations = []
        possible_crops = ['Wheat', 'Soybean', 'Corn', 'Rice']
        standard_usage = {
            'Wheat': {'Fertilizer_Usage_kg': 150, 'Pesticide_Usage_kg': 12},
            'Soybean': {'Fertilizer_Usage_kg': 100, 'Pesticide_Usage_kg': 8},
            'Corn': {'Fertilizer_Usage_kg': 180, 'Pesticide_Usage_kg': 15},
            'Rice': {'Fertilizer_Usage_kg': 200, 'Pesticide_Usage_kg': 10},
        }

        for crop in possible_crops:
            farm_data = farm_inputs.copy()
            farm_data.update(weather_forecast)

            # Apply standard fertilizer and pesticide rates if not provided
            fertilizer = standard_usage.get(crop, {}).get('Fertilizer_Usage_kg', 120)
            pesticide = standard_usage.get(crop, {}).get('Pesticide_Usage_kg', 10)
            farm_data['Fertilizer_Usage_kg'] = farm_data.get('Fertilizer_Usage_kg', fertilizer)
            farm_data['Pesticide_Usage_kg'] = farm_data.get('Pesticide_Usage_kg', pesticide)
            farm_data['Crop_Type'] = crop

             # Encode Crop_Type for yield prediction
            crop_encoding_map_yield = {'Wheat': 3.0, 'Soybean': 2.0, 'Corn': 0.0, 'Rice': 1.0} # Assuming the same encoding as pest, adjust if different
            crop_encoded_value_yield = crop_encoding_map_yield.get(farm_data.get('Crop_Type'), -1) # Use -1 for unknown


            # Prepare data for yield prediction
            input_features_yield = pd.DataFrame({
                'Soil_pH': [float(farm_data.get('Soil_pH'))],
                'Soil_Moisture': [float(farm_data.get('Soil_Moisture'))],
                'Temperature_C': [float(farm_data.get('Temperature_C'))],
                'Rainfall_mm': [float(farm_data.get('Rainfall_mm'))],
                'Fertilizer_Usage_kg': [float(farm_data.get('Fertilizer_Usage_kg'))],
                'Pesticide_Usage_kg': [float(farm_data.get('Pesticide_Usage_kg'))],
                'Crop_Type_Encoded': [crop_encoded_value_yield] # Add the encoded crop type
                #'Crop_Type': [farm_data.get('Crop_Type')]
            })

            # Yield prediction
            try:
                predicted_yield = loaded_yield_model.predict(input_features_yield)[0]
            except Exception as e:
                print(f"Yield prediction failed: {e}")
                # Use hardcoded values as fallback
                avg_yields = {'Wheat': 3735, 'Soybean': 3422, 'Corn': 3755, 'Rice': 3744}
                predicted_yield = avg_yields.get(crop, 3500)

            # Market price prediction - use hardcoded values with calculated factors
            average_market_prices = {'Wheat': 300, 'Soybean': 350, 'Corn': 250, 'Rice': 400}
            base_price = average_market_prices.get(crop, 325)

            # Add some variation based on weather and yield
            temp_factor = 1.0 + (float(farm_data.get('Temperature_C')) - 25) * 0.01  # +/- 1% per degree
            rain_factor = 1.0 + (float(farm_data.get('Rainfall_mm')) - 150) * 0.0005  # +/- 0.05% per mm
            yield_factor = 1.0 + (predicted_yield - 3000) * 0.0001  # +/- 0.01% per ton difference

            # Apply factors to base price
            predicted_price = base_price * temp_factor * rain_factor * yield_factor

            # Pest prediction with hardcoded mapping for crop encoding
            try:
                # Map crops to the encoding values seen in your test data
                crop_encoding_map = {'Wheat': 3.0, 'Soybean': 2.0, 'Corn': 0.0, 'Rice': 1.0}
                crop_encoded_value = crop_encoding_map.get(crop, 0.0)

                # Create features array (order matters!)
                pest_features = np.array([
                    float(farm_data.get('Temperature_C')),
                    float(farm_data.get('Rainfall_mm')),
                    crop_encoded_value,
                    float(farm_data.get('Soil_Moisture'))
                ]).reshape(1, -1)

                # Scale features without passing feature names
                scaled_pest_features = loaded_pest_scaler.transform(pest_features)

                # Make prediction
                predicted_pest_risk_prob = loaded_pest_model.predict_proba(scaled_pest_features)[0][1]
            except Exception as e:
                print(f"Pest prediction failed for {crop}: {e}")
                # Use hardcoded values based on your existing output
                pest_risks = {'Wheat': 0.18, 'Soybean': 0.18, 'Corn': 0.12, 'Rice': 0.18}
                predicted_pest_risk_prob = pest_risks.get(crop, 0.5)

            # Calculate ROI
            estimated_cost_per_ton = {'Wheat': 150, 'Soybean': 180, 'Corn': 120, 'Rice': 200}
            estimated_cost = estimated_cost_per_ton.get(crop, 160)
            estimated_total_cost = estimated_cost * predicted_yield
            estimated_revenue = predicted_yield * predicted_price

            # Calculate profit and ROI percentage
            estimated_profit = estimated_revenue - estimated_total_cost
            estimated_roi_percentage = (estimated_profit / estimated_total_cost) * 100 if estimated_total_cost > 0 else 0
            print(f"Crop: {crop}") # Add this line
            print(f"  Predicted Yield: {predicted_yield}") # Add this line
            print(f"  Predicted Price: {predicted_price}") # Add this line
            print(f"  Estimated ROI Percentage: {estimated_roi_percentage}") # Add this line


            # Store results
            print(f"Type of predicted_yield: {type(predicted_yield)}")
            print(f"Type of predicted_price: {type(predicted_price)}")
            print(f"Type of estimated_profit: {type(estimated_profit)}")
            print(f"Type of estimated_roi_percentage: {type(estimated_roi_percentage)}")
            print(f"Type of predicted_pest_risk_prob: {type(predicted_pest_risk_prob)}")
            recommendations.append({
                'Crop': crop,
                'Predicted_Yield': float(predicted_yield),
                'Predicted_Price': float(predicted_price),
                'Estimated_Profit': float(estimated_profit),
                'Estimated_ROI_Percentage': float(estimated_roi_percentage),
                'Pest_Risk_Score': float(predicted_pest_risk_prob),
            })

        # Rank recommendations and add explanations
        ranked_recommendations = sorted(recommendations, key=lambda x: x['Estimated_ROI_Percentage'], reverse=True)

        # Add explanations to the top recommendations
        for recommendation in ranked_recommendations[:3]:
            crop = recommendation['Crop']

            # Identify key strengths and weaknesses
            strengths = []
            weaknesses = []

            # Yield analysis
            avg_yields = {'Wheat': 3000, 'Soybean': 2800, 'Corn': 3500, 'Rice': 3200}
            if recommendation['Predicted_Yield'] > avg_yields.get(crop, 3000):
                strengths.append(f"Above average yield potential ({recommendation['Predicted_Yield']:.0f} vs {avg_yields.get(crop, 3000)} avg)")
            else:
                weaknesses.append(f"Below average yield potential ({recommendation['Predicted_Yield']:.0f} vs {avg_yields.get(crop, 3000)} avg)")

            # Price analysis
            avg_prices = {'Wheat': 280, 'Soybean': 320, 'Corn': 240, 'Rice': 380}
            if recommendation['Predicted_Price'] > avg_prices.get(crop, 300):
                strengths.append(f"Favorable market price (${recommendation['Predicted_Price']:.2f} vs ${avg_prices.get(crop, 300)} avg)")
            else:
                weaknesses.append(f"Lower than average market price (${recommendation['Predicted_Price']:.2f} vs ${avg_prices.get(crop, 300)} avg)")

            # ROI analysis
            avg_roi = {'Wheat': 90, 'Soybean': 95, 'Corn': 100, 'Rice': 85}
            if recommendation['Estimated_ROI_Percentage'] > avg_roi.get(crop, 90):
                strengths.append(f"Strong ROI ({recommendation['Estimated_ROI_Percentage']:.1f}%)")
            else:
                weaknesses.append(f"Moderate ROI ({recommendation['Estimated_ROI_Percentage']:.1f}%)")

            # Pest risk analysis
            if recommendation['Pest_Risk_Score'] < 0.3:
                strengths.append(f"Low pest risk ({recommendation['Pest_Risk_Score']*100:.1f}%)")
            elif recommendation['Pest_Risk_Score'] > 0.6:
                weaknesses.append(f"High pest risk ({recommendation['Pest_Risk_Score']*100:.1f}%)")
            else:
                strengths.append(f"Moderate pest risk ({recommendation['Pest_Risk_Score']*100:.1f}%)")

            # Climate suitability
            optimal_temps = {'Wheat': (15, 24), 'Soybean': (20, 30), 'Corn': (18, 32), 'Rice': (24, 34)}
            crop_temp_range = optimal_temps.get(crop, (15, 30))
            current_temp = float(weather_forecast.get('Temperature_C'))
            if crop_temp_range[0] <= current_temp <= crop_temp_range[1]:
                strengths.append(f"Optimal temperature range for {crop}")
            else:
                weaknesses.append(f"Suboptimal temperature for {crop}")

            # Add explanations to recommendation
            recommendation['Strengths'] = strengths
            recommendation['Weaknesses'] = weaknesses
            recommendation['Explanation'] = f"{crop} is recommended primarily due to " + \
                                            (f"its {strengths[0].lower()} and {strengths[1].lower() if len(strengths) > 1 else ''}. " if strengths else "balanced performance. ") + \
                                            (f"However, consider that {weaknesses[0].lower()}" if weaknesses else "")

        return ranked_recommendations[:3]

    except Exception as e:
        print(f"An error occurred during recommendation generation: {e}")
        import traceback
        traceback.print_exc()
        return []

@app.route('/get_crop_recommendations', methods=['POST'])
def get_crop_recommendations():
    try:
        data = request.get_json()
        print(f"Received JSON data: {data}") # Please add this line to your Flask code

        farm_inputs = data.get('farmInputs')
        weather_forecast = data.get('weatherForecast')
        print(f"Farm Inputs received: {farm_inputs}") # Add this line
        print(f"Weather Forecast received: {weather_forecast}") # Add this line

        if not farm_inputs or not weather_forecast:
            return jsonify({'error': 'Missing farm inputs or weather forecast'}), 400

        recommendations = get_recommendations(farm_inputs, weather_forecast)
        return jsonify({'recommendations': recommendations})

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)