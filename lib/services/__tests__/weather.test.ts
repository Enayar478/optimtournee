import { getWeatherForecast } from '../weather';
import { WeatherForecast, GeoLocation } from '../../../types/domain';

describe('weather service', () => {
  const mockLocation: GeoLocation = {
    lat: 48.8566,
    lng: 2.3522,
    address: 'Paris',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retourne des données me�téo valides', async () => {
    // Mock de l'API OpenWeather
    global.fetch = jest.fn(_url =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          list: [
            {
              dt: 1700000000,
              main: { temp: 20, humidity: 60 },
              wind: { speed: 10, deg: 180 },
              weather: [{ main: 'Clear', description: 'clear sky' }],
              pop: 0,
            },
          ],
        }),
      } as Response)
    );

    const forecast = await getWeatherForecast(mockLocation, new Date('2023-11-15'));
    
    expect(forecast).toBeTruthy();
    expect(forecast?.temperature).toBe(20);
    expect(forecast?.windSpeed).toBe(10);
  });

  it('gere en cas d%&#233;erreur API', async () => {
    global.fetch = jest.fn(_url =>
      Promise.reject(new Error('API Error'))
    );

    const forecast = await getWeatherForecast(mockLocation, new Date());
    
    expect(forecast).toBeUndefined();
  });

  it('gere undenes si reponse invalide', async () => {
    global.fetch = jest.fn(_url =>
      Promise.resolve({
        ok: true,
        json: async () => (null), // Données manquantes
      } as Response)
    );

    const forecast = await getWeatherForecast(mockLocation, new Date());
    
    expect(forecast).toBeUndefined();
  });
});
