import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Map, MapMarker, MarkerContent, useMap } from './ui/map'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/* ── Generate a session token (one per autocomplete session) ── */
function makeSessionToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/* ── REST: get autocomplete predictions ── */
async function fetchPredictions(input, sessionToken) {
  try {
    const res = await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
        },
        body: JSON.stringify({
          input,
          sessionToken,
          includedPrimaryTypes: ['locality', 'administrative_area_level_3'],
          includedRegionCodes: ['us'],
        }),
      }
    )
    if (!res.ok) {
      console.error('[Places autocomplete] error:', res.status, await res.text())
      return []
    }
    const data = await res.json()
    return data.suggestions || []
  } catch (err) {
    console.error('[Places autocomplete] fetch failed:', err)
    return []
  }
}

/* ── REST: get place details (coordinates) ── */
async function fetchPlaceDetails(placeId, sessionToken) {
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}`,
      {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'formattedAddress,location,displayName',
        },
      }
    )
    if (!res.ok) {
      console.error('[Place details] error:', res.status, await res.text())
      return null
    }
    return res.json()
  } catch (err) {
    console.error('[Place details] fetch failed:', err)
    return null
  }
}

/* ── Inner map controller — flies to selected location ── */
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
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const sessionTokenRef = useRef(makeSessionToken())
  const debounceRef = useRef(null)

  // Fallback if no API key configured
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

  const handleChange = (e) => {
    const input = e.target.value
    onChange(input)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!input || input.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const results = await fetchPredictions(input, sessionTokenRef.current)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    }, 200)
  }

  const handleSelect = async (suggestion) => {
    const placePred = suggestion.placePrediction
    if (!placePred) return

    const details = await fetchPlaceDetails(
      placePred.placeId,
      sessionTokenRef.current
    )

    if (!details?.location) return

    const formatted = details.formattedAddress || placePred.text?.text || ''
    const place = {
      address: formatted,
      lng: details.location.longitude,
      lat: details.location.latitude,
    }

    onChange(formatted)
    setInternalPlace(place)
    onPlaceSelect?.(place)
    setShowSuggestions(false)

    // New session token after each successful selection
    sessionTokenRef.current = makeSessionToken()
  }

  return (
    <>
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
              {suggestions.map((s, i) => {
                const pred = s.placePrediction
                if (!pred) return null
                const main =
                  pred.structuredFormat?.mainText?.text ||
                  pred.text?.text ||
                  ''
                const sub = pred.structuredFormat?.secondaryText?.text || ''
                return (
                  <button
                    key={pred.placeId || i}
                    type="button"
                    className="book-suggestion-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(s)}
                  >
                    <MapPin size={16} className="book-suggestion-icon" />
                    <span className="book-suggestion-text">
                      <span className="book-suggestion-main">{main}</span>
                      {sub && (
                        <span className="book-suggestion-sub">{sub}</span>
                      )}
                    </span>
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
                        filter:
                          'drop-shadow(0 2px 6px rgba(37, 99, 235, 0.45))',
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
    </>
  )
}
