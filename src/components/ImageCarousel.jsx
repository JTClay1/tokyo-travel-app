import { useEffect, useState } from "react";

// Static slide data lives up top so it is easy to update later without digging
// through the component logic.
const attractionSlides = [
  {
    title: "Tokyo Disneyland",
    description:
      "Tokyo Disneyland is a classic Disney park packed with iconic rides, themed lands, and family-friendly magic.",
    image: "/tokyo-disneyland.jpg",
  },
  {
    title: "Joypolis",
    description:
      "Joypolis is a high-energy indoor amusement park known for arcade games, interactive attractions, and futuristic vibes.",
    image: "/joypolis.jpg",
  },
  {
    title: "Tokyo Origami Museum",
    description:
      "The Tokyo Origami Museum highlights the precision and creativity of Japanese paper art through colorful handcrafted displays.",
    image: "/tokyo-origami-museum.jpg",
  },
  {
    title: "Senso-ji Temple",
    description:
      "Senso-ji is one of Tokyo’s most famous temples, blending historic architecture with a lively traditional market atmosphere.",
    image: "/sensoji-temple.jpg",
  },
  {
    title: "Tokyo Tower",
    description:
      "Tokyo Tower offers one of the city’s most recognizable skyline views and a classic landmark photo opportunity.",
    image: "/tokyo-tower.jpg",
  },
  {
    title: "Imperial Palace and Gardens",
    description:
      "The Imperial Palace area gives visitors a calmer side of Tokyo with scenic grounds, stone walls, and seasonal greenery.",
    image: "/imperial-palace-gardens.jpg",
  },
  {
    title: "Shibuya Crossing",
    description:
      "Shibuya Crossing is Tokyo’s most famous intersection, known for its huge crowds, neon energy, and nonstop city motion.",
    image: "/shibuya-crossing.jpg",
  },
  {
    title: "Gundam Statue",
    description:
      "The life-size Gundam statue is a must-see for anime and sci-fi fans looking for one of the area’s boldest photo spots.",
    image: "/gundam-statue.jpg",
  },
  {
    title: "Shibuya Sky",
    description:
      "Shibuya Sky gives you a dramatic open-air view over Tokyo and is one of the best places to catch the city from above.",
    image: "/shibuya-sky.jpg",
  },
  {
    title: "Hie Shrine",
    description:
      "Hie Shrine offers a peaceful temple stop with striking architecture and a quieter break from the city’s fast pace.",
    image: "/hie-shrine.jpg",
  },
];

function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Auto-advance every 7 seconds. Long enough to actually read the caption,
    // short enough that the carousel still feels alive.
    const timer = setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === attractionSlides.length - 1 ? 0 : previousSlide + 1
      );
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  // Wrap around to the end when backing up from slide 0.
  function handlePrevious() {
    setCurrentSlide((previousSlide) =>
      previousSlide === 0 ? attractionSlides.length - 1 : previousSlide - 1
    );
  }

  // Wrap around to the start when moving past the last slide.
  function handleNext() {
    setCurrentSlide((previousSlide) =>
      previousSlide === attractionSlides.length - 1 ? 0 : previousSlide + 1
    );
  }

  // Dot navigation gives users a direct jump to the attraction they want.
  function handleDotClick(index) {
    setCurrentSlide(index);
  }

  const slide = attractionSlides[currentSlide];

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h3>Top Tokyo Attractions</h3>
        <p>
          Browse a few iconic spots that can help shape your trip itinerary.
        </p>
      </div>

      <div className="carousel-card">
        <div className="carousel-image-wrapper">
          <img
            src={slide.image}
            alt={slide.title}
            className="carousel-image"
          />

          {/* Overlay keeps the image front and center while still giving enough
              context for the user to know what they are looking at. */}
          <div className="carousel-overlay">
            <h4 className="carousel-title">{slide.title}</h4>
            <p className="carousel-description">{slide.description}</p>
          </div>

          <button
            type="button"
            className="carousel-button carousel-button-left"
            onClick={handlePrevious}
            aria-label="Show previous attraction"
          >
            ‹
          </button>

          <button
            type="button"
            className="carousel-button carousel-button-right"
            onClick={handleNext}
            aria-label="Show next attraction"
          >
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {attractionSlides.map((attraction, index) => (
            <button
              key={attraction.title}
              type="button"
              className={
                index === currentSlide
                  ? "carousel-dot active"
                  : "carousel-dot"
              }
              onClick={() => handleDotClick(index)}
              aria-label={`Go to ${attraction.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImageCarousel;