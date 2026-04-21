import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Restaurants from "../pages/Restaurants";
import { searchTokyoRestaurants } from "../services/api";

vi.mock("../services/api", () => ({
  searchTokyoRestaurants: vi.fn(),
}));

const mockRestaurants = [
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
    },
  },
];

describe("Restaurants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs the initial sushi search on page load and shows results", async () => {
    searchTokyoRestaurants.mockResolvedValue(mockRestaurants);

    render(<Restaurants />);

    await waitFor(() => {
      expect(searchTokyoRestaurants).toHaveBeenCalledWith("sushi", "all");
    });

    expect(await screen.findByText("Sushi Place")).toBeInTheDocument();
    expect(screen.getByText("Area: Shibuya")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Visit Website" })
    ).toHaveAttribute("href", "https://sushi.example.com");
    expect(
      screen.getByRole("link", { name: "Search in Google Maps" })
    ).toBeInTheDocument();
  });

  it("lets the user use a keyword chip and submit a filtered search", async () => {
    const user = userEvent.setup();
    searchTokyoRestaurants
      .mockResolvedValueOnce(mockRestaurants)
      .mockResolvedValueOnce([]);

    render(<Restaurants />);

    await waitFor(() => {
      expect(searchTokyoRestaurants).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: "Ramen → ラーメン" }));
    await user.selectOptions(screen.getByRole("combobox"), "shibuya");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(searchTokyoRestaurants).toHaveBeenLastCalledWith("ラーメン", "shibuya");
    });

    expect(
      screen.getByText("No matching restaurants found. Try a broader keyword.")
    ).toBeInTheDocument();
  });

  it("renders an error message when restaurant lookup fails", async () => {
    searchTokyoRestaurants.mockRejectedValue(
      new Error("Missing Geoapify API key.")
    );

    render(<Restaurants />);

    expect(
      await screen.findByText("Missing Geoapify API key.")
    ).toBeInTheDocument();
  });
});