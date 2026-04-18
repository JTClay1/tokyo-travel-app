# Tokyo Travel App

Tokyo Travel App is a React + Vite single-page application for trip planning. It combines practical travel utilities for Tokyo in one place: weather checks, restaurant lookup, and Japanese phrase practice.

## Project overview

The app is organized around a few high-value traveler workflows:

- Check **current Tokyo weather** and a **7-day forecast**.
- Find restaurants by cuisine/name and narrow results to popular Tokyo neighborhoods.
- Practice useful Japanese travel phrases with a quick quiz.
- Navigate the app through dedicated routes with a themed, persistent UI.

## Core features

### Global app experience
- Client-side routing for:
  - `/` Home
  - `/weather`
  - `/restaurants`
  - `/phrases-quiz`
  - fallback `*` route (404 page)
- Navbar with:
  - Route links
  - Live Tokyo clock (`Asia/Tokyo`)
  - Light/Dark mode toggle
- Theme preference persistence via `localStorage`

### Weather page
- Current conditions for Tokyo:
  - Temperature
  - Humidity
  - Wind speed
  - Condition label + icon
- 7-day forecast cards:
  - Daily high/low temperatures
  - Weather condition
  - Average humidity (derived from hourly humidity values)
- Celsius/Fahrenheit display toggle
- Seasonal climate reference table
- Loading and error states for API requests

### Restaurant locator
- Search by restaurant/cuisine keyword
- Area filter presets:
  - All Tokyo, Shibuya, Shinjuku, Asakusa, Ginza, Ueno, Akihabara, Harajuku, Roppongi, Ikebukuro, Tokyo Station/Marunouchi
- Suggested Japanese keywords (e.g., 寿司, ラーメン) for better local matching
- Results include available:
  - Address
  - Category
  - Opening hours
  - Phone number
  - Website link
  - Google Maps search link
- Loading, empty-state, and error handling

### Phrases quiz
- 10-question multiple-choice quiz
- Score tracking
- Per-question correctness feedback
- Finish state + restart flow

## Tech stack

- React 19
- React Router DOM 7
- Vite 8
- Vanilla CSS
- ESLint 9

## External APIs

### Open-Meteo (weather data)
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Used for:
  - Current weather fields (`temperature_2m`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m`)
  - Daily forecast (`weather_code`, `temperature_2m_max`, `temperature_2m_min`)
  - Hourly humidity (for daily humidity averaging)
- Request configured for Tokyo coordinates and `Asia/Tokyo` timezone.

### Geoapify Places API (restaurant search)
- Endpoint: `https://api.geoapify.com/v2/places`
- Used for category-based place search in Tokyo with neighborhood radius filters
- Requires `VITE_GEOAPIFY_API_KEY`

## Local development

### Prerequisites
- Node.js 20+ (recommended)
- npm 10+ (recommended)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Add your Geoapify key to `.env.local`:
   ```bash
   VITE_GEOAPIFY_API_KEY=your_geoapify_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Build and preview
```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## Known limitations

- Restaurant result quality depends on OpenStreetMap/Geoapify data completeness.
- Some restaurant metadata (hours/phone/website) may be missing.
- Restaurant search fails without a valid `VITE_GEOAPIFY_API_KEY`.
- Weather-code-to-label/icon mapping is manually maintained and may not include every possible edge code.
