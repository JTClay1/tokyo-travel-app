# Tokyo Travel App

Tokyo Travel App is a React + Vite single-page application built to help travelers plan a trip to Tokyo with practical tools in one polished interface. The app combines live weather data, restaurant search, and Japanese phrase practice while keeping the experience clean, themed, and easy to navigate.

## Project overview

This project was built for a React application assignment focused on external API integration, routing, state management, and user experience polish.

The app is centered around a few useful trip-planning workflows:

- Check current Tokyo weather, a 7-day forecast, and expanded hourly forecast details
- Search for restaurants by cuisine or restaurant name near a Tokyo location
- Sort restaurant results by default order, nearest first, or alphabetical order
- Practice useful Japanese travel phrases with a multiple-choice quiz
- Explore a home page attraction carousel featuring major Tokyo landmarks

## Live deployment

Deployed with Vercel.

## Core features

### Home page
- Hero section introducing the app
- Attraction image carousel featuring:
  - Tokyo Disneyland
  - Joypolis
  - Tokyo Origami Museum
  - Senso-ji Temple
  - Tokyo Tower
  - Imperial Palace and Gardens
  - Shibuya Crossing
  - Gundam Statue
  - Shibuya Sky
  - Hie Shrine
- Overlaid attraction names and short descriptions
- Quick-access cards linking to the main app tools

### Global app experience
- Client-side routing for:
  - `/` Home
  - `/weather`
  - `/restaurants`
  - `/phrases-quiz`
  - fallback `*` route for unknown URLs
- Sticky navbar with:
  - Navigation links
  - Live Tokyo clock and date using the `Asia/Tokyo` timezone
  - Light/Dark mode toggle
- Theme preference persistence with `localStorage`

### Weather page
- Current Tokyo weather including:
  - Temperature
  - Humidity
  - Wind speed
  - Condition label
  - Weather icon
- 7-day forecast cards showing:
  - Daily high temperature
  - Daily low temperature
  - Forecast condition
  - Forecast icon
  - Average daily humidity
- Expandable hourly forecast details for each forecast day
- Celsius/Fahrenheit toggle
- Seasonal climate reference table for trip planning
- Loading and error states for weather requests

### Restaurant locator
- Search by cuisine, food type, or restaurant name
- Flexible Tokyo location input that accepts:
  - Neighborhoods
  - Station areas
  - Addresses
  - Zip codes
- Suggested Japanese keyword chips for stronger local search results
- Default search center set to Tokyo Station
- Distance shown for each result based on the selected Tokyo search location
- Sorting options:
  - Default
  - Nearest First
  - Alphabetical
- Result cards can include:
  - Restaurant name
  - Category
  - Address
  - Area label
  - Distance from selected search location
  - Opening hours
  - Phone number
  - Website link
  - Google Maps search link
- Loading, empty-state, and error handling

### Phrases quiz
- 10-question multiple-choice quiz
- Randomized question order
- Randomized answer choices
- Score tracking
- Correct/incorrect feedback after each question
- Finish screen with restart flow

## Tech stack

- React
- React Router DOM
- Vite
- Vanilla CSS
- Vitest
- React Testing Library
- ESLint

## External APIs

### Open-Meteo
Used for Tokyo weather data.

Endpoint:
`https://api.open-meteo.com/v1/forecast`

Fields used:
- Current weather:
  - `temperature_2m`
  - `relative_humidity_2m`
  - `weather_code`
  - `wind_speed_10m`
- Hourly weather:
  - `temperature_2m`
  - `relative_humidity_2m`
  - `weather_code`
- Daily weather:
  - `weather_code`
  - `temperature_2m_max`
  - `temperature_2m_min`

### Geoapify
Used for geocoding Tokyo locations and restaurant search.

Endpoints:
- `https://api.geoapify.com/v1/geocode/search`
- `https://api.geoapify.com/v2/places`

Requires:
`VITE_GEOAPIFY_API_KEY`

## Testing

Automated tests were written with Vitest and React Testing Library.

Covered areas include:
- Weather page rendering and hourly forecast behavior
- Restaurant page search, geocoded location search, and sorting behavior
- Attraction carousel navigation and auto-advance
- Quiz answer flow, completion, and restart behavior

Run tests with:
```bash
npm run test:run
```

## Local development

### Prerequisites
- Node.js 20+ recommended
- npm 10+ recommended

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

3. Add your Geoapify API key to `.env.local`:
   ```bash
   VITE_GEOAPIFY_API_KEY=your_geoapify_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Build and preview

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint
- `npm run test:run` - run the Vitest suite once

## Known limitations

- Restaurant result quality depends on OpenStreetMap and Geoapify data completeness.
- Some restaurant entries may not include hours, phone numbers, or website links.
- A valid Geoapify API key is required for restaurant search and Tokyo location geocoding.
- Weather condition labels and icons are manually mapped from Open-Meteo weather codes.
- Restaurant distance is based on the selected Tokyo search location, not live browser geolocation.

## Future improvement ideas

- Add saved favorite restaurants or itinerary notes
- Add phrase categories or difficulty levels in the quiz
- Add more accessibility refinements and keyboard interaction polish
- Add more unit tests for smaller helper utilities
