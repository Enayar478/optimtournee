/**
 * Tests unitaires — lib/services/weather
 * Mock: global fetch
 */

const mockFetch = jest.fn()
global.fetch = mockFetch

import { fetchWeatherForecast, getMockWeather } from '../weather'

describe('lib/services/weather', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchWeatherForecast', () => {
    it('retourne un WeatherForecast valide pour une réponse API réussie', async () => {
      const apiData = {
        main: { temp: 18.5 },
        wind: { speed: 5.2 },
        weather: [{ main: 'Clear' }],
        rain: null,
      }
      mockFetch.mockResolvedValue({ ok: true, json: async () => apiData })

      const result = await fetchWeatherForecast(48.85, 2.35, 'test_key')

      expect(result).not.toBeUndefined()
      expect(result!.temperature).toBe(19) // Math.round(18.5) = 19
      expect(result!.windSpeed).toBe(19) // Math.round(5.2 * 3.6) = 19
      expect(result!.condition).toBe('clear')
      expect(result!.rainProbability).toBe(0)
      expect(result!.rainMm).toBe(0)
    })

    it('mappe correctement les conditions météo (Rain)', async () => {
      const apiData = {
        main: { temp: 12 },
        wind: { speed: 8 },
        weather: [{ main: 'Rain' }],
        rain: { '1h': 2.5 },
      }
      mockFetch.mockResolvedValue({ ok: true, json: async () => apiData })

      const result = await fetchWeatherForecast(48.85, 2.35, 'test_key')

      expect(result!.condition).toBe('rain')
      expect(result!.rainProbability).toBe(100)
      expect(result!.rainMm).toBe(2.5)
    })

    it('mappe correctement les conditions météo (Thunderstorm → storm)', async () => {
      const apiData = {
        main: { temp: 10 },
        wind: { speed: 15 },
        weather: [{ main: 'Thunderstorm' }],
        rain: null,
      }
      mockFetch.mockResolvedValue({ ok: true, json: async () => apiData })

      const result = await fetchWeatherForecast(48.85, 2.35, 'test_key')
      expect(result!.condition).toBe('storm')
    })

    it('mappe correctement Clouds → cloudy', async () => {
      const apiData = {
        main: { temp: 14 },
        wind: { speed: 6 },
        weather: [{ main: 'Clouds' }],
        rain: null,
      }
      mockFetch.mockResolvedValue({ ok: true, json: async () => apiData })

      const result = await fetchWeatherForecast(48.85, 2.35, 'test_key')
      expect(result!.condition).toBe('cloudy')
    })

    it('mappe les conditions inconnues → clear par défaut', async () => {
      const apiData = {
        main: { temp: 20 },
        wind: { speed: 3 },
        weather: [{ main: 'Tornado' }], // Condition inconnue
        rain: null,
      }
      mockFetch.mockResolvedValue({ ok: true, json: async () => apiData })

      const result = await fetchWeatherForecast(48.85, 2.35, 'test_key')
      expect(result!.condition).toBe('clear')
    })

    it('retourne undefined si l\'API retourne une erreur HTTP', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 401 })

      const result = await fetchWeatherForecast(48.85, 2.35, 'bad_key')
      expect(result).toBeUndefined()
    })

    it('retourne undefined si fetch lève une exception réseau', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await fetchWeatherForecast(48.85, 2.35, 'test_key')
      expect(result).toBeUndefined()
    })
  })

  describe('getMockWeather', () => {
    it('retourne un WeatherForecast avec la date fournie', () => {
      const date = new Date('2024-03-15')
      const result = getMockWeather(date)

      expect(result.date).toBe(date)
      expect(result.temperature).toBeGreaterThanOrEqual(15)
      expect(result.temperature).toBeLessThan(30)
      expect(result.windSpeed).toBeGreaterThanOrEqual(5)
      expect(result.windSpeed).toBeLessThan(30)
      expect(result.rainMm).toBe(0)
      expect(result.isSuitable).toBe(true)
      expect(['clear', 'cloudy', 'rain', 'storm', 'snow']).toContain(result.condition)
    })
  })
})
