import React from "react";

const StudioHeader = ({ currentView }) => {
  return (
    <header className="studio-header">
      <div className="logo">
        <div className="logo-icon">
          {/* <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" fill="none">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" strokeWidth="2"/>
            <line x1="21.17" y1="8" x2="12" y2="8" strokeWidth="2"/>
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" strokeWidth="2"/>
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" strokeWidth="2"/>
          </svg> */}
          <img src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png" style={{height : "50px"}}></img>
        </div>
        {/* <span className="logo-text">Art<span style={{color : "white"}}>Critic</span></span> */}
      </div>
      <nav className="studio-nav">
        <span className={`nav-item ${currentView === 'upload' ? 'active' : ''}`}>Upload</span>
        <span className={`nav-item ${currentView === 'analyze' ? 'active' : ''}`}>Analyze</span>
        <span className={`nav-item ${currentView === 'results' ? 'active' : ''}`}>Results</span>
      </nav>
    </header>
  );
};

export default StudioHeader;