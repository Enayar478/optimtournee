'use client'

import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react'
import { useWeather } from '@/lib/hooks/useWeather'

const PARIS_LAT = 48.8566
const PARIS_LON = 2.3522

const RAIN_ICON_CODES = new Set(['09d', '09n', '10d', '10n', '11d', '11n'])

const weatherIcons: Record<string, React.ReactNode> = {
  '01d': <Sun className="h-10 w-10 text-[#E07B39]" />,
  '01n': <Sun className="h-10 w-10 text-[#E07B39]" />,
  '02d': <Cloud className="h-10 w-10 text-gray-400" />,
  '02n': <Cloud className="h-10 w-10 text-gray-400" />,
  '03d': <Cloud className="h-10 w-10 text-gray-400" />,
  '03n': <Cloud className="h-10 w-10 text-gray-400" />,
  '04d': <Cloud className="h-10 w-10 text-gray-600" />,
  '04n': <Cloud className="h-10 w-10 text-gray-600" />,
  '09d': <CloudRain className="h-10 w-10 text-blue-500" />,
  '09n': <CloudRain className="h-10 w-10 text-blue-500" />,
  '10d': <CloudRain className="h-10 w-10 text-blue-500" />,
  '10n': <CloudRain className="h-10 w-10 text-blue-500" />,
  '11d': <CloudRain className="h-10 w-10 text-purple-500" />,
  '11n': <CloudRain className="h-10 w-10 text-purple-500" />,
  '13d': <CloudSnow className="h-10 w-10 text-blue-300" />,
  '13n': <CloudSnow className="h-10 w-10 text-blue-300" />,
}

export function WeatherWidget() {
  const { weather, loading, error } = useWeather(PARIS_LAT, PARIS_LON)

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#4A90A4]/20 bg-gradient-to-br from-[#4A90A4]/10 via-[#E8F4F7] to-white p-6">
        <div className="space-y-3">
          <div className="animate-pulse h-3 w-12 rounded bg-gray-200" />
          <div className="animate-pulse h-10 w-24 rounded bg-gray-200" />
          <div className="animate-pulse h-3 w-32 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="rounded-2xl border border-[#4A90A4]/20 bg-gradient-to-br from-[#4A90A4]/10 via-[#E8F4F7] to-white p-6">
        <p className="text-sm text-gray-500">Météo indisponible</p>
      </div>
    )
  }

  const hasRain = RAIN_ICON_CODES.has(weather.icon)
  const weatherIcon = weatherIcons[weather.icon] ?? <Sun className="h-10 w-10 text-[#E07B39]" />

  return (
    <div className="rounded-2xl border border-[#4A90A4]/20 bg-gradient-to-br from-[#4A90A4]/10 via-[#E8F4F7] to-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Paris</p>
          <motion.div
            className="mt-1 flex items-baseline gap-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <span className="text-5xl font-bold text-gray-900">
              {weather.temperature}°
            </span>
            <motion.div
              animate={hasRain ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {weatherIcon}
            </motion.div>
          </motion.div>
          <p className="text-muted-foreground mt-2 text-sm capitalize">
            {weather.description}
          </p>
          {hasRain && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
              ⚠️ Risque de pluie
            </span>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Droplets className="h-3.5 w-3.5" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Wind className="h-3.5 w-3.5" />
            <span>{Math.round(weather.windSpeed * 3.6)} km/h</span>
          </div>
        </div>
      </div>
    </div>
  )
}
