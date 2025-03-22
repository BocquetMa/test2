import api from './api';

const WeatherService = {
  getCurrentWeather: async (city) => {
    return api.get(`/weather/${city}`);
  }
};

export default WeatherService;