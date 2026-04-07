import { useEffect, useRef, useState } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Map, MapMarker, MarkerContent } from './ui/map'
import { useMap } from './ui/map'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/* ── Inner autocomplete that hooks into Google Places ── */
function AutocompleteInput({ value, onChange, onPlaceSelect, onKeyDown }) {
  const places = useMapsLibrary('places')
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)

  useEffect(() => {
    if (!places || !inputRef.current) return

    const ac = new places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      fields: ['formatted_address', 'geometry', 'name'],
    })

    autocompleteRef.current = ac

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      if (!place.geometry?.location) return

      const formatted = place.formatted_address || place.name || ''
      const coords = {
        lng: place.geometry.location.lng(),
        lat: place.geometry.location.lat(),
      }
      onChange(formatted)
      onPlaceSelect({ address: formatted, ...coords })
    })

    return () => listener.remove()
  }, [places]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      ref={inputRef}
      type="text"
      className="book-input"
      placeholder="City, State (e.g. Miami, FL)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      autoComplete="off"
    />
  )
}

/* ── Inner map controller that flies to the selected location ── */
function MapFlyTo({ lng, lat }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!isLoaded || !map) return
    map.flyTo({
      center: [lng, lat],
      zoom: 11,
      duration: 1500,
      essential: true,
    })
  }, [map, isLoaded, lng, lat])

  return null
}

/* ── Public component ── */
export default function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  selectedPlace,
  onKeyDown,
}) {
  const [internalPlace, setInternalPlace] = useState(selectedPlace || null)

  const handleSelect = (place) => {
    setInternalPlace(place)
    onPlaceSelect?.(place)
  }

  if (!API_KEY) {
    // Fallback to plain input if key not configured
    return (
      <input
        type="text"
        className="book-input"
        placeholder="City, State (e.g. Miami, FL)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    )
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <AutocompleteInput
        value={value}
        onChange={onChange}
        onPlaceSelect={handleSelect}
        onKeyDown={onKeyDown}
      />

      <AnimatePresence>
        {internalPlace && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="book-map-wrap"
          >
            <div className="book-map-container">
              <Map
                center={[internalPlace.lng, internalPlace.lat]}
                zoom={11}
              >
                <MapFlyTo lng={internalPlace.lng} lat={internalPlace.lat} />
                <MapMarker
                  longitude={internalPlace.lng}
                  latitude={internalPlace.lat}
                >
                  <MarkerContent>
                    <MapPin
                      size={32}
                      strokeWidth={2.5}
                      style={{
                        fill: '#2563EB',
                        stroke: '#ffffff',
                        filter: 'drop-shadow(0 2px 6px rgba(37, 99, 235, 0.45))',
                      }}
                    />
                  </MarkerContent>
                </MapMarker>
              </Map>
            </div>
            <p className="book-map-caption">
              We build campaigns specific to your market and competition
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </APIProvider>
  )
}
