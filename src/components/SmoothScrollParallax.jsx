import React, { useEffect, useRef } from 'react';
import "../styles/SmoothScrollParallax.css";


const cards = [
  { title: "Card One", image: "https://placehold.co/600x400?text=1" },
  { title: "Card Two", image: "https://placehold.co/600x400?text=2" },
  { title: "Card Three", image: "https://placehold.co/600x400?text=3" },
  { title: "Card Four", image: "https://placehold.co/600x400?text=4" },
  { title: "Card Five", image: "https://placehold.co/600x400?text=5" },
];

const SmoothScrollCarousel = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      const children = container.querySelectorAll(".card");
      const containerRect = container.getBoundingClientRect();

      children.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const offset = (rect.left - containerRect.left) / container.offsetWidth;
        card.style.transform = `translateY(${offset * -30}px)`;
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="carousel-container" ref={containerRef}>
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <img src={card.image} alt={card.title} />
          <div className="title">{card.title}</div>
        </div>
      ))}
    </div>
  );
};

export default SmoothScrollCarousel;