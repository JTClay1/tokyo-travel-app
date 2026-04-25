import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Restaurants from "../pages/Restaurants";
import {
  geocodeTokyoLocation,
  searchTokyoRestaurants,
} from "../services/api";

vi.mock("../services/api", () => ({
  geocodeTokyoLocation: vi.fn(),
  searchTokyoRestaurants: vi.fn(),
}));

const tokyoStationCenter = {
  latitude: 35.6812,
  longitude: 139.7671,
  label: "Tokyo Station",
  radius: 4000,
};

const shibuyaCenter = {
  latitude: 35.6595,
  longitude: 139.7005,
  label: "Shibuya Station",
  radius: 4000,
};

const initialRestaurants = [
  {
    properties: {
      place_id: "place-1",
      name: "Sushi Place",
      categories: ["catering.restaurant"],
      formatted: "1 Tokyo Street",
      suburb: "Shibuya",
      opening_hours: "10:00-20:00",
      phone: "03-1111-2222",
      website: "https://sushi.example.com",
      lat: 35.6812,
      lon: 139.7671,
    },
  },
];

const sortedRestaurantResults = [
  {
    properties: {
      place_id: "place-2",
      name: "Zen Ramen",
      categories: ["catering.restaurant"],
      formatted: "2 Shibuya Street",
      suburb: "Shibuya",
      lat: 35.6596,
      lon: 139.7006,
    },
  },
  {
    properties: {
      place_id: "place-3",
      name: "Akiba Sushi",
      categories: ["catering.restaurant"],
      formatted: "3 Tokyo Street",
      district: "Akihabara",
      lat: 35.6984,
      lon: 139.773,
    },
  },
  {
    properties: {
      place_id: "place-4",
      name: "Bento House",
      categories: ["catering.restaurant"],
      formatted: "4 Tokyo Street",
      district: "Shinjuku",
      lat: 35.671,
      lon: 139.706,
    },
  },
];

function getRestaurantHeadings(container) {
  return [...container.querySelectorAll(".restaurant-card h3")].map(
    (heading) => heading.textContent
  );
}

describe("Restaurants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs the initial sushi search on page load and shows results", async () => {
    searchTokyoRestaurants.mockResolvedValueOnce(initialRestaurants);

    render(<Restaurants />);

    await waitFor(() => {
      expect(searchTokyoRestaurants).toHaveBeenCalledWith(
        "sushi",
        tokyoStationCenter
      );
    });

    expect(await screen.findByText("Sushi Place")).toBeInTheDocument();
    expect(
      screen.getByText(/Showing results for/i)
    ).toHaveTextContent("Showing results for sushi near Tokyo Station.");
    expect(screen.getByText("Area: Shibuya")).toBeInTheDocument();
    expect(
      screen.getByText(/Distance from Tokyo Station:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Visit Website" })
    ).toHaveAttribute("href", "https://sushi.example.com");
    expect(
      screen.getByRole("link", { name: "Search in Google Maps" })
    ).toBeInTheDocument();
  });

  it("lets the user search by geocoded location and sort the returned results", async () => {
    const user = userEvent.setup();

    searchTokyoRestaurants
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(sortedRestaurantResults);

    geocodeTokyoLocation.mockResolvedValueOnce(shibuyaCenter);

    const { container } = render(<Restaurants />);

    await waitFor(() => {
      expect(searchTokyoRestaurants).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: "Ramen → ラーメン" }));

    const locationInput = screen.getByPlaceholderText(
      "Try Shibuya, Tokyo Station, 100-0005, or a Tokyo address"
    );

    await user.clear(locationInput);
    await user.type(locationInput, "Shibuya Station");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(geocodeTokyoLocation).toHaveBeenCalledWith("Shibuya Station");
      expect(searchTokyoRestaurants).toHaveBeenLastCalledWith(
        "ラーメン",
        shibuyaCenter
      );
    });

    await screen.findByText("Zen Ramen");

    expect(getRestaurantHeadings(container)).toEqual([
      "Zen Ramen",
      "Akiba Sushi",
      "Bento House",
    ]);

    await user.selectOptions(screen.getByRole("combobox"), "alphabetical");

    await waitFor(() => {
      expect(getRestaurantHeadings(container)).toEqual([
        "Akiba Sushi",
        "Bento House",
        "Zen Ramen",
      ]);
    });

    await user.selectOptions(screen.getByRole("combobox"), "nearest");

    await waitFor(() => {
      expect(getRestaurantHeadings(container)).toEqual([
        "Zen Ramen",
        "Bento House",
        "Akiba Sushi",
      ]);
    });

    expect(
      screen.getAllByText(/Distance from Shibuya Station:/i)
    ).toHaveLength(3);
  });

  it("renders an error message when restaurant lookup fails", async () => {
    searchTokyoRestaurants.mockRejectedValueOnce(
      new Error("Missing Geoapify API key.")
    );

    render(<Restaurants />);

    expect(
      await screen.findByText("Missing Geoapify API key.")
    ).toBeInTheDocument();
  });
});