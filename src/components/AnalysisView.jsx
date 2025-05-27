import React from "react";

const AnalysisView = ({ image }) => {
  return (
    <div className="studio-stage analysis-stage">
      <div className="analysis-view">
        <div className="analysis-image-container">
          <img src={image} alt="Analyzing artwork" className="analysis-image" />
          <div className="analysis-overlay">
            <div className="pulse-container">
              <div className="pulse-ring"></div>
              <div className="pulse-circle"></div>
            </div>
          </div>
        </div>
        <div className="analysis-status">
          <div className="analysis-loader">
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
          </div>
          <h3>Analyzing Your Artwork</h3>
          <p>Our AI tutor is examining the details and preparing feedback...</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;