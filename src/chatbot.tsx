import React, { useState } from 'react';
import './chatbot.css'; // Ensure this file exists at the correct path

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

interface ChatbotProps {
    // You can define any props your component might receive here
}

interface FarmInputs {
    Soil_pH: number | null;
    Soil_Moisture: number | null;
    Temperature_C: number | null;
    Rainfall_mm: number | null;
    [key: string]: number | null;
}

const Chatbot: React.FC<ChatbotProps> = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { 
            sender: 'bot', 
            text: 'Welcome to the Farm AI Chatbot! Please enter the following information to get crop recommendations:' 
        }
    ]);
    
    const requiredFields = ['Soil_pH', 'Soil_Moisture', 'Temperature_C', 'Rainfall_mm'];
    
    const [soilpH, setSoilpH] = useState<number | null>(null);
    const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
    const [temperatureC, setTemperatureC] = useState<number | null>(null);
    const [rainfallMm, setRainfallMm] = useState<number | null>(null);

    const toggleChatbot = () => {
        console.log('Chatbot icon clicked!');
        setIsVisible(prevState => !prevState);
    };

    const handleGetRecommendations = () => {
        const farmInputs: FarmInputs = {
            Soil_pH: soilpH,
            Soil_Moisture: soilMoisture,
            Temperature_C: temperatureC,
            Rainfall_mm: rainfallMm,
        };

        // Check if all required fields have a value
        const allFieldsFilled = requiredFields.every(
            field => farmInputs[field] !== null && 
                   !isNaN(farmInputs[field] as number)
        );

        if (allFieldsFilled) {
            // Add user message showing their inputs
            const userInputSummary = `My farm data: pH: ${soilpH}, Moisture: ${soilMoisture}, Temperature: ${temperatureC}°C, Rainfall: ${rainfallMm}mm`;
            
            setMessages(prevMessages => [
                ...prevMessages, 
                { sender: 'user', text: userInputSummary },
                { sender: 'bot', text: 'Fetching recommendations...' }
            ]);
            
            // Convert null values to actual numbers since we've verified they're valid
            const dataToSend = Object.fromEntries(
                Object.entries(farmInputs).map(([key, value]) => [key, value as number])
            );
            
            sendDataToBackend(dataToSend);
        } else {
            const missingFields = requiredFields
                .filter(field => farmInputs[field] === null || isNaN(farmInputs[field] as number))
                .join(', ')
                .replace(/_/g, ' ');
                
            setMessages(prevMessages => [
                ...prevMessages, 
                { sender: 'bot', text: `Please enter valid values for: ${missingFields}.` }
            ]);
        }
    };

    const sendDataToBackend = (dataToSend: {[key: string]: number}) => {
        const farmInputsData = {
            Soil_pH: dataToSend.Soil_pH,
            Soil_Moisture: dataToSend.Soil_Moisture
        };
    
        const weatherForecastData = {
            Temperature_C: dataToSend.Temperature_C,
            Rainfall_mm: dataToSend.Rainfall_mm
        };
    
        const requestBody = JSON.stringify({
            farmInputs: farmInputsData, // Changed from farm_inputs
            weatherForecast: weatherForecastData // Changed from weather_forecast
        });
    
        console.log("Sending request with body:", requestBody);
    
        fetch('http://127.0.0.1:5000/get_crop_recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received from backend:", data); // Add this line

            displayRecommendations(data);
            // Reset input fields after getting recommendations
            setSoilpH(null);
            setSoilMoisture(null);
            setTemperatureC(null);
            setRainfallMm(null);
        })
        .catch(error => {
            console.error('Error:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: 'bot',
                    text: `Error fetching recommendations: ${error.message}. Please try again.`
                }
            ]);
        });
    };

    const displayRecommendations = (data: any) => {
        if (data && data.recommendations && data.recommendations.length > 0) {
            let responseText = 'Here are the top recommendations:\n';
            data.recommendations.forEach((rec: any, index: number) => {
                responseText += `${index + 1}. ${rec.Crop} - ${rec.Estimated_ROI_Percentage.toFixed(1)}% ROI\n`;
                responseText += `  Yield: ${rec.Predicted_Yield.toFixed(1)} tons | Price: $${rec.Predicted_Price.toFixed(2)} | Profit: $${rec.Estimated_Profit.toFixed(2)}\n`;
                responseText += `  Pest Risk: ${(rec.Pest_Risk_Score * 100).toFixed(1)}%\n`;
                responseText += `  Summary: ${rec.Explanation}\n\n`;
            });
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: responseText }]);
        } else {
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', text: 'No recommendations found for the provided data.' }
            ]);
        }
    };

    return (
        <div>
            <div id="chatbot-icon" onClick={toggleChatbot}>💬</div>
            {isVisible && (
                <div
                    id="chatbot-panel"
                    className={isVisible ? 'open' : ''}
                >
                    <div id="chat-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender}-message`}>
                                {msg.text.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < msg.text.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div id="user-input-area">
                        <div className="input-column">
                            <label htmlFor="soil-ph">Soil pH:</label>
                            <input
                                type="number"
                                id="soil-ph"
                                value={soilpH === null ? '' : soilpH}
                                onChange={(e) => setSoilpH(e.target.value === '' ? null : parseFloat(e.target.value))}
                                step="0.1"
                                min="0"
                                max="14"
                            />
                        </div>
                        <div className="input-column">
                            <label htmlFor="soil-moisture">Soil Moisture:</label>
                            <input
                                type="number"
                                id="soil-moisture"
                                value={soilMoisture === null ? '' : soilMoisture}
                                onChange={(e) => setSoilMoisture(e.target.value === '' ? null : parseFloat(e.target.value))}
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="input-column">
                            <label htmlFor="temperature">Temperature (°C):</label>
                            <input
                                type="number"
                                id="temperature"
                                value={temperatureC === null ? '' : temperatureC}
                                onChange={(e) => setTemperatureC(e.target.value === '' ? null : parseFloat(e.target.value))}
                                step="0.1"
                            />
                        </div>
                        <div className="input-column">
                            <label htmlFor="rainfall">Rainfall (mm):</label>
                            <input
                                type="number"
                                id="rainfall"
                                value={rainfallMm === null ? '' : rainfallMm}
                                onChange={(e) => setRainfallMm(e.target.value === '' ? null : parseFloat(e.target.value))}
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <button 
                            id="send-button" 
                            onClick={handleGetRecommendations}
                        >
                            Get Recommendations
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;