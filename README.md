# Tokyo Travel App

A front-end React app that helps travelers plan a Tokyo trip with live weather data, restaurant search, and a Japanese phrases quiz.

## Why this project exists
This project is built for **Project 1: React Application with External API Integration**. It demonstrates:
- Component structure and reuse
- Asynchronous data fetching
- Controlled inputs and UI state
- Routing across multiple views
- Styling/layout polish

## Features
- **Home view** with quick navigation to core tools
- **Weather view**
  - Current Tokyo weather
  - 5-day forecast
  - Celsius/Fahrenheit toggle
  - Seasonal climate reference table
- **Restaurant Locator view**
  - Search by keyword/cuisine
  - Tokyo neighborhood filter
  - Suggested Japanese search keywords
  - Links to Google Maps and website/phone/hours (when available)
- **Phrases Quiz view**
  - Multiple-choice travel phrase quiz
  - Score tracking and restart flow
- **404 fallback** for unknown routes

## Tech stack
- React
- React Router
- Vite
- Vanilla CSS

## API usage
### 1) Open-Meteo (weather)
- Endpoint used:
  - `https://api.open-meteo.com/v1/forecast`
- Parameters include Tokyo latitude/longitude, current weather fields, daily forecast fields, timezone, and forecast range.

### 2) Geoapify Places API (restaurants)
- Endpoint used:
  - `https://api.geoapify.com/v2/places`
- Query includes category filters, Tokyo area radius, optional name keyword, and language.
- Requires API key via `VITE_GEOAPIFY_API_KEY`.

## Setup instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local env file:
   ```bash
   cp .env.example .env.local
   ```
3. Add your Geoapify key in `.env.local`:
   ```bash
   VITE_GEOAPIFY_API_KEY=your_key_here
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Challenges and known issues
- Restaurant quality/coverage depends on OpenStreetMap source data availability.
- Some places may not include complete metadata (hours/phone/website).
- Restaurant search requires a valid Geoapify API key; missing key will show an error.
- Weather labels are mapped from common weather codes and may not cover every possible code.

## Suggested next improvements
- Add loading skeletons and richer empty states
- Add "near me" geolocation option for restaurant filtering
- Add phrase categories + spaced repetition in quiz mode
- Persist user settings (temperature unit, last search area)
- Add basic accessibility audit and keyboard-focus improvements
- Add unit tests for helper functions and key component states

## Scripts
- `npm run dev` – run locally
- `npm run build` – production build
- `npm run lint` – lint checks
- `npm run preview` – preview production build
