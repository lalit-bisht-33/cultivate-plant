import mongoose from "mongoose";

const WeatherDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    location: {
        type: String,  // Can be the city or coordinates of the user (latitude, longitude)
        required: true,
    },
    currentWeather: {
        temperature: {
            type: Number,  // Temperature in Celsius or Fahrenheit
            required: true,
        },
        condition: {
            type: String,  // Conditions like "Sunny", "Rainy", "Cloudy"
            required: true,
        },
        humidity: {
            type: Number,  // Humidity percentage
            required: true,
        },
        windSpeed: {
            type: Number,  // Wind speed in km/h or mph
            required: true,
        },
        icon: {
            type: String,  // URL to the weather icon (optional)
        },
    },
    forecast: [
        {
            date: {
                type: Date,  // Forecasted date for weather
                required: true,
            },
            temperature: {
                type: Number,  // Forecasted temperature
                required: true,
            },
            condition: {
                type: String,  // Forecasted condition (e.g., "Rainy")
                required: true,
            },
        },
    ],
    alerts: [
        {
            type: String,  // Alerts like "Frost warning", "Heatwave", etc.
            message: {
                type: String,  // The warning message or description
                required: true,
            },
            severity: {
                type: String,  // The severity of the alert (e.g., "High", "Moderate")
                required: true,
            },
        },
    ],
}, { timestamps: true });

const WeatherData = mongoose.model("WeatherData", WeatherDataSchema);
export default WeatherData;
