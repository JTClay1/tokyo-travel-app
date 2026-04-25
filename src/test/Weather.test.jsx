import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Weather from "../pages/Weather";
import { getTokyoWeather } from "../services/api";

vi.mock("../services/api", () => ({
  getTokyoWeather: vi.fn(),
}));

const mockWeatherData = {
  current: {
    temperature_2m: 20,
    relative_humidity_2m: 55,
    weather_code: 2,
    wind_speed_10m: 12,
  },
  daily: {
    time: ["2026-04-20", "2026-04-21"],
    weather_code: [0, 61],
    temperature_2m_max: [22, 18],
    temperature_2m_min: [14, 10],
  },
  hourly: {
    time: [
      "2026-04-20T00:00",
      "2026-04-20T01:00",
      "2026-04-21T00:00",
      "2026-04-21T01:00",
    ],
    temperature_2m: [16.4, 17.1, 14.2, 13.8],
    relative_humidity_2m: [50, 60, 65, 75],
    weather_code: [0, 2, 61, 3],
  },
};

describe("Weather", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders fetched weather data and toggles temperature units", async () => {
    const user = userEvent.setup();
    getTokyoWeather.mockResolvedValue(mockWeatherData);

    render(<Weather />);

    expect(screen.getByText("Fetching Tokyo weather...")).toBeInTheDocument();

    expect(await screen.findByText("Current Conditions")).toBeInTheDocument();
    expect(screen.getByText("Temperature: 20.0°C")).toBeInTheDocument();
    expect(screen.getByText("Humidity: 55%")).toBeInTheDocument();
    expect(screen.getByText("Wind Speed: 12 km/h")).toBeInTheDocument();
    expect(screen.getByText("Avg Humidity: 55%")).toBeInTheDocument();
    expect(screen.getByText("Avg Humidity: 70%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Fahrenheit" }));

    expect(screen.getByText("Temperature: 68.0°F")).toBeInTheDocument();
    expect(screen.getByText("High: 71.6°F")).toBeInTheDocument();
  });

  it("shows expandable hourly forecast details and switches expanded days", async () => {
    const user = userEvent.setup();
    getTokyoWeather.mockResolvedValue(mockWeatherData);

    render(<Weather />);

    expect(await screen.findByText("Current Conditions")).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: "Show Hourly Forecast" })[0]
    );

    expect(
      screen.getByRole("button", { name: "Hide Hourly Forecast" })
    ).toBeInTheDocument();
    expect(screen.getByText("12:00 AM")).toBeInTheDocument();
    expect(screen.getByText("16.4°C")).toBeInTheDocument();
    expect(screen.getByText("17.1°C")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Show Hourly Forecast" })
    );

    await waitFor(() => {
      expect(screen.queryByText("16.4°C")).not.toBeInTheDocument();
      expect(screen.getByText("14.2°C")).toBeInTheDocument();
      expect(screen.getByText("13.8°C")).toBeInTheDocument();
    });
  });

  it("renders an error message when the API request fails", async () => {
    getTokyoWeather.mockRejectedValueOnce(
      new Error("Failed to fetch weather data.")
    );

    render(<Weather />);

    expect(
      await screen.findByText("Failed to fetch weather data.")
    ).toBeInTheDocument();
  });

  it("shows N/A when humidity data is missing", async () => {
    getTokyoWeather.mockResolvedValue({
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        relative_humidity_2m: null,
      },
      hourly: {},
    });

    render(<Weather />);

    expect(await screen.findByText("Current Conditions")).toBeInTheDocument();
    expect(screen.getByText("Humidity: N/A")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText("Avg Humidity: N/A")).toHaveLength(2);
    });
  });
});