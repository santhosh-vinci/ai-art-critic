import React, { useState, useEffect } from 'react';
import "../styles/testimonials.css";

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [avatarCache, setAvatarCache] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Martinez",
      role: "Digital Artist",
      gender: "girl",
      content: "We love ArtCritic AI! Our designers were using it for their projects, so we already knew what kind of analysis they want.",
      rating: 5
    },
    {
      id: 2,
      name: "Alex Chen",
      role: "Art Student", 
      gender: "boy",
      content: "The AI feedback has transformed my learning process. It's like having a professional mentor available 24/7.",
      rating: 5
    },
    {
      id: 3,
      name: "Maya Patel",
      role: "Illustrator",
      gender: "girl",
      content: "Incredible depth of analysis! It critiques everything from composition to color theory with remarkable precision.",
      rating: 4.5
    },
    {
      id: 4,
      name: "Jordan Kim",
      role: "Concept Artist",
      gender: "boy",
      content: "This tool catches details that even experienced art directors miss. It's become essential to my workflow.",
      rating: 4
    },
    {
      id: 5,
      name: "Emma Rodriguez",
      role: "Fine Artist",
      gender: "girl",
      content: "The AI adapts its critique style perfectly to different art forms. Whether abstract or realistic, feedback is spot-on.",
      rating: 5
    },
    {
      id: 6,
      name: "Ryan Thompson",
      role: "Photography Enthusiast",
      gender: "boy",
      content: "Technical analysis of lighting and composition helped me understand principles books couldn't explain clearly.",
      rating: 4
    },
    {
      id: 7,
      name: "Lisa Wang",
      role: "UI/UX Designer",
      gender: "girl",
      content: "Perfect for design critique! The AI understands user experience principles and provides actionable feedback.",
      rating: 5
    },
    {
      id: 8,
      name: "Marcus Johnson",
      role: "Traditional Painter",
      gender: "boy",
      content: "Even as a traditional artist, the AI's insights on brushwork and texture analysis have elevated my paintings.",
      rating: 5
    },
    {
      id: 9,
      name: "Sophia Chen",
      role: "Art Director",
      gender: "girl",
      content: "We use this for client presentations. The detailed analysis helps explain design decisions professionally.",
      rating: 4.5
    },
    {
      id: 10,
      name: "David Park",
      role: "Graphic Designer",
      gender: "boy",
      content: "Game-changer for brand work! The AI understands visual hierarchy and brand consistency like a seasoned creative.",
      rating: 5
    },
    {
      id: 11,
      name: "Isabella Torres",
      role: "Art Instructor",
      gender: "girl",
      content: "I recommend this to all my students. It provides consistent, educational feedback that supplements my teaching.",
      rating: 5
    },
   {
  id: 12,
  name: "Liam Patel",
  role: "Freelance Illustrator",
  gender: "boy",
  content: "This platform has truly elevated my digital art process. The feedback feels personal and actionable.",
  rating: 5
}

  ];

  const itemsToShow = 2; // Show 2 testimonials at a time
  const totalSlides = Math.ceil(testimonials.length / itemsToShow);

  // Pre-generate avatar URLs with different seeds for variety
  const generateAvatarUrl = (gender, id) => {
    const seeds = ['happy', 'smile', 'joy', 'bright', 'cheerful', 'positive', 'warm', 'friendly'];
    const seed = seeds[id % seeds.length];
    return `https://avatar.iran.liara.run/public/${gender}?${seed}${id}`;
    
  };

  // Preload avatars for better performance
  const preloadAvatars = () => {
    const newCache = {};
    testimonials.forEach(testimonial => {
      newCache[testimonial.id] = generateAvatarUrl(testimonial.gender, testimonial.id);
    });
    setAvatarCache(newCache);
  };

  useEffect(() => {
    preloadAvatars();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * itemsToShow;
    return testimonials.slice(startIndex, startIndex + itemsToShow);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`aiartcritic__horizontal__star ${index < rating ? 'aiartcritic__horizontal__star--filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="aiartcritic__horizontal__section">
      <div className="aiartcritic__horizontal__container">
        <div className="aiartcritic__horizontal__header">
          {/* <div className="aiartcritic__horizontal__stats">
            {testimonials.length * 340}+ happy LandingFolio users
          </div> */}
          <h2 className="aiartcritic__horizontal__title">Don't just take our words</h2>
        </div>
        
        <div className="aiartcritic__horizontal__carousel">
          <div className="aiartcritic__horizontal__testimonials">
            {getCurrentTestimonials().map((testimonial) => (
              <div key={testimonial.id} className="aiartcritic__horizontal__testimonial">
                <div className="aiartcritic__horizontal__content">
                  <div className="aiartcritic__horizontal__stars">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="aiartcritic__horizontal__text">"{testimonial.content}"</p>
                  <div className="aiartcritic__horizontal__author">
                    <span className="aiartcritic__horizontal__name">{testimonial.name}</span>
                    <span className="aiartcritic__horizontal__role">{testimonial.role}</span>
                  </div>
                </div>
                <div className="aiartcritic__horizontal__avatar__container">
                  <img 
                    src={avatarCache[testimonial.id] || generateAvatarUrl(testimonial.gender, testimonial.id)} 
                    alt={testimonial.name}
                    className="aiartcritic__horizontal__avatar"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="aiartcritic__horizontal__navigation">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`aiartcritic__horizontal__dot ${currentIndex === index ? 'aiartcritic__horizontal__dot--active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;