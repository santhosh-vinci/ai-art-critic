// import { useState } from 'react';

export default function HeroSection() {
  // const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="hero-container">
      <div className="bg-patterns">
        <div className="bg-circle circle1"></div>
        <div className="bg-circle circle2"></div>
        <div className="bg-circle circle3"></div>
      </div>

      <div className="hero-content">
        <div className="hero-wrapper">
          <div className="hero-text">
            <div className="badge">
              <span className="gemini-text">Gemini API</span>
              <span> POWERED ART ANALYSIS<sup><b>*</b></sup></span>
            </div>

            <h1 className="hero-heading">
              <span>Your Art Just Met Its</span>
              <span className="gradient-text">Toughest Critic.</span>
            </h1>

            <p className="hero-description">
              Stop guessing. Upload your artwork and get direct, AI-powered feedback from a brutally honest art mentor trained to make you better — not to flatter you.
            </p>

            <div className="cta-container">
              {/* <button
                className={`cta-button ${isHovered ? 'cta-hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Analyze Your Art
                <span className="arrow-icon">→</span>
              </button> */}
              <p className="cta-subtext">No account needed to try our AI critic</p>
            </div>
          </div>

          <div className="hero-image">
            <div className="artwork-container">
              <div className="artwork-frame-image">
                <img src="https://www.artedguru.com/uploads/3/0/6/1/30613521/theartcritic_orig.jpg" alt="AI Art Analysis Example" className="artwork-img" />
                <div className="analysis-hero-image">
                  <div className="analysis-point point1">Composition</div>
                  <div className="analysis-point point2">Color Harmony</div>
                  <div className="analysis-point point4">Emotional Impact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <style jsx>{`
        .hero-container {
          position: relative;
          overflow: hidden;
          background-color: #080808;
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        .bg-patterns {
          position: absolute;
          inset: 0;
          opacity: 0.2;
        }
        
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        
        .circle1 {
          top: 0;
          left: 0;
          width: 400px;
          height: 400px;
          background-color: #8b5cf6;
        }
        
        .circle2 {
          bottom: 0;
          right: 0;
          width: 500px;
          height: 500px;
          background-color: #2563eb;
        }
        
        .circle3 {
          top: 50%;
          left: 33%;
          width: 450px;
          height: 450px;
          background-color: #db2777;
        }
        
        .hero-content {
          width: 90%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          position: relative;
          z-index: 10;
        }
        
        .hero-wrapper {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        
        @media (min-width: 768px) {
          .hero-wrapper {
            flex-direction: row;
            align-items: center;
          }
          
          .hero-text {
            width: 60%;
            padding-right: 2rem;
          }
          
          .hero-image {
            width: 40%;
          }
        }
        
        .badge {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .sparkle {
          margin-right: 0.5rem;
          color: #facc15;
        }
        
        .badge span:last-child {
          color: gray;
          letter-spacing: 0.2em;
          font-size: 12px;
          font-weight: 500;
        }
        
        .hero-heading {
          font-size: 2.3rem;
          line-height: 1.2;
          font-weight: 700;
          margin-bottom: 1.3rem;
        }
        
        .hero-heading span {
          display: block;
        }
        
        .gradient-text {
            background-image: linear-gradient(240deg, #217bfe 0, #078efb 33.53%, #ac87eb 67.74%, #ee4d5d 100%);
            background-size: 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .hero-description {
         font-size: 1rem; /* Reduced font size for readability on small screens */
    line-height: 1.5;
    color: #d1d5db;
    margin-bottom: 1.5rem; /* Slightly reduced margin */
    max-width: 100%; /* Ensures it fits the screen */
        }
        
        .cta-container {
          margin-top: 2rem;
        }
        
        .cta-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: black; /* inside background */
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 0;
}

.cta-button::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px; /* Border thickness */
  border-radius: 0.5rem;
  background: linear-gradient(45deg, #8b5cf6, #db2777);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  z-index: -1;
}

        
        .cta-button:hover, .cta-hovered {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 92, 246, 0.5);
        }
        
        .arrow-icon {
          margin-left: 0.75rem;
          transition: transform 0.3s ease;
        }
        
        .cta-hovered .arrow-icon {
          transform: translateX(4px);
        }
        
        .cta-subtext {
          margin-top: 0.75rem;
          font-size: 0.775rem;
          color: #9ca3af;
        }
        
        .artwork-container {
          position: relative;
        }
        
        .artwork-frame-image {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }
        
        .artwork-img {
          display: block;
          width: 100%;
          height: auto;
          transition: transform 0.5s ease;
        }
        
        .artwork-frame-image:hover .artwork {
          transform: scale(1.02);
        }
        
        .analysis-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .artwork-img {
         background: black; opacity: 0.75;
        }
        
        .analysis-point {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: pulse 3s infinite;
        }
        
        .analysis-point::before {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .point1 {
          top: 10%;
          left: 22%;
          animation-delay: 0s;
        }
        
        .point2 {
          top: 50%;
          right: 10%;
          animation-delay: 0.5s;
        }
        
        .point3 {
          bottom: 30%;
          left: 5%;
          animation-delay: 1s;
        }
        
        .point4 {
          top: 20%;
          left: 60%;
          animation-delay: 1.5s;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        .featured-text {
          margin-top: 3rem;
          text-align: center;
          font-size: 1rem;
          color: #9ca3af;
        }
        
        .gemini-text {
          background: linear-gradient(to right, #4ade80, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
          margin: 0 0.5rem;
        }
        
        @media (min-width: 1024px) {
          .hero-heading {
            font-size: 3.2rem;
          line-height: 1.28;
          font-weight: 800;
          margin-bottom: 1.5rem;
          }
          
          .hero-description {
          font-size: 1.10rem;
          line-height: 1.4;
          margin-bottom: 2rem;
          max-width: 600px;
          }
          .cta-subtext {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          
          }
        }
      `}</style>
    </div>
  );
}
