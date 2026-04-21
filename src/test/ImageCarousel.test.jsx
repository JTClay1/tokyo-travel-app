import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ImageCarousel from "../components/ImageCarousel";

describe("ImageCarousel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first attraction and lets the user move forward and backward", async () => {
    const user = userEvent.setup();

    render(<ImageCarousel />);

    expect(
      screen.getByRole("heading", { name: "Tokyo Disneyland" })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Show next attraction" })
    );

    expect(
      screen.getByRole("heading", { name: "Joypolis" })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Show previous attraction" })
    );

    expect(
      screen.getByRole("heading", { name: "Tokyo Disneyland" })
    ).toBeInTheDocument();
  });

  it("auto-advances after the timer interval", () => {
    vi.useFakeTimers();

    render(<ImageCarousel />);

    expect(
      screen.getByRole("heading", { name: "Tokyo Disneyland" })
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(
      screen.getByRole("heading", { name: "Joypolis" })
    ).toBeInTheDocument();
  });
});