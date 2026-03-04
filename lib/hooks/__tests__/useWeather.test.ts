import { renderHook, act } from '@testing-library/react';
import { useWeather } from '../useWeather';
import { GeoLocation } from '../../../types/domain';

jest.mock('../weather', () => ({
  getWeatherForecast: jest.fn(),
}));

describe('useWeather', () => {
  const mockLocation: GeoLocation = {
    lat: 48.8566,
    lng: 2.3522,
    address: 'Paris',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retourne les données météo et chargement', async () => {
    const mockForecast = {
      date: new Date('2024-03-01'),
      temperature: 20,
      windSpeed: 10,
      rainProbability: 0,
      rainMm: 0,
      condition: 'clear' as const,
      isSuitable: true,
    };

    const { getWeatherForecast } = require('../weather');
    getWeatherForecast.mockResolvedValue(mockForecast);

    const { result } = renderHook(() => useWeather(mockLocation, new Date('2024-03-01')));

    expect(result.current?.weather).toEqual(mockForecast);
    expect(result.current?.loading).toBe(false);
  });

  it('en cas d&#233;erreur, stocke les erreurs', async () => {
    const { getWeatherForecast } = require('../weather');
    getWeatherForecast.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useWeather(mockLocation, new Date()));

    await act(async () => {});

    expect(result.current?.weather).toBeNull();
    expect(result.current?.error).beTruthy();
    expect(result.current?.loading).toBe(false);
  });
});
