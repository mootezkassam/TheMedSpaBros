import { useEffect, useRef, useState } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Map, MapMarker, MarkerContent, useMap } from './ui/map'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/* ── Custom autocomplete using AutocompleteService + custom dropdown ── */
function AutocompleteInput({ value, onChange, onPlaceSelect, onKeyDown }) {
  const places = useMapsLibrary('places')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const autocompleteService = useRef(null)
  const placesService = useRef(null)
  const sessionToken = useRef(null)

  useEffect(() => {
    if (!places) return
    autocompleteService.current = new places.AutocompleteService()
    placesService.current = new places.PlacesService(document.createElement('div'))
    sessionToken.current = new places.AutocompleteSessionToken()
  }, [places])

  const handleChange = (e) => {
    const input = e.target.value
    onChange(input)

    if (!input || !autocompleteService.current) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    autocompleteService.current.getPlacePredictions(
      {
        input,
        types: ['(cities)'],
        sessionToken: sessionToken.current,
      },
      (predictions, status) => {
        if (
          status === places.PlacesServiceStatus.OK &&
          predictions &&
          predictions.length > 0
        ) {
          setSuggestions(predictions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      }
    )
  }

  const handleSelect = (prediction) => {
    if (!placesService.current) return

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'geometry', 'name'],
        sessionToken: sessionToken.current,
      },
      (place, status) => {
        if (
          status === places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const formatted = place.formatted_address || prediction.description
          onChange(formatted)
          onPlaceSelect({
            address: formatted,
            lng: place.geometry.location.lng(),
            lat: place.geometry.location.lat(),
          })
          setShowSuggestions(false)
          // New session token after each selection
          sessionToken.current = new places.AutocompleteSessionToken()
        }
      }
    )
  }

  return (
    <div className="book-autocomplete-wrap">
      <input
        type="text"
        className="book-input"
        placeholder="City, State (e.g. Miami, FL)"
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className="book-suggestions"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {suggestions.map((s) => (
              <button
                key={s.place_id}
                type="button"
                className="book-suggestion-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(s)}
              >
                <MapPin size={16} className="book-suggestion-icon" />
                <span className="book-suggestion-text">
                  <span className="book-suggestion-main">
                    {s.structured_formatting?.main_text || s.description}
                  </span>
                  {s.structured_formatting?.secondary_text && (
                    <span className="book-suggestion-sub">
                      {s.structured_formatting.secondary_text}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
