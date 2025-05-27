import React from "react";

const ResultsView = ({ image, feedback, handleReset }) => {
  const formatMarkdownText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*(.*?)\*\*/g, '<span class="bold-text">$1</span>');
  };

  const formatFeedback = (feedbackData) => {
    // Handle null or undefined feedback
    if (!feedbackData) {
      return <div className="error-message">No feedback available. Please try again.</div>;
    }

    // Handle object format from fetchGeminiFeedback
    if (typeof feedbackData === 'object' && feedbackData.success !== undefined) {
      if (!feedbackData.success) {
        return <div className="error-message">{feedbackData.message}</div>;
      }
      // Successful feedback, process as string
      feedbackData = feedbackData.message;
    }

    // If feedback is not a string or empty, show error
    if (typeof feedbackData !== 'string' || !feedbackData.trim()) {
      return <div className="error-message">Invalid feedback received. Please try again.</div>;
    }

    const sections = [];
    const lines = feedbackData.split('\n');
    let currentSection = null;
    let currentSubsection = null;
    let mainContent = [];
    let subsections = {};

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('# ')) {
        if (currentSection) {
          sections.push({
            title: currentSection,
            mainContent: [...mainContent],
            subsections: { ...subsections },
          });
        }

        currentSection = trimmedLine.substring(2);
        mainContent = [];
        subsections = {};
        currentSubsection = null;
      } else if (trimmedLine.startsWith('## ')) {
        currentSubsection = trimmedLine.substring(3);
        subsections[currentSubsection] = [];
      } else if (trimmedLine && currentSection) {
        const cleanLine = trimmedLine.startsWith('- ') ? trimmedLine.substring(2) : trimmedLine;

        if (currentSubsection) {
          subsections[currentSubsection].push(cleanLine);
        } else {
          mainContent.push(cleanLine);
        }
      }
    }

    if (currentSection) {
      sections.push({
        title: currentSection,
        mainContent: [...mainContent],
        subsections: { ...subsections },
      });
    }

    const categoryColors = {
      "Art Style": { primary: "#F9C8C2", secondary: "#F9E1C2" },
      "Overall Feedback": { primary: "#F9D2C2", secondary: "#FDF2C2" },
      "Composition": { primary: "#F9DAC2", secondary: "#FBEBC2" },
      "Anatomy": { primary: "#F9D5C2", secondary: "#FAE5C2" },
      "Proportion": { primary: "#F9D5C2", secondary: "#FAE5C2" },
      "Perspective": { primary: "#F9D5C2", secondary: "#FAE5C2" },
      "Line Work": { primary: "#FAE5C2", secondary: "#FEF8D2" },
      "Detailing": { primary: "#FAE5C2", secondary: "#FEF8D2" },
      "Coloring": { primary: "#F9CDC2", secondary: "#FBE0C2" },
      "Shading": { primary: "#F9CDC2", secondary: "#FBE0C2" },
      "Lighting": { primary: "#F9CDC2", secondary: "#FBE0C2" },
      "Creativity": { primary: "#F2D4E9", secondary: "#E5D9F2" },
      "Expression": { primary: "#F2D4E9", secondary: "#E5D9F2" },
      "Suggested Next Steps": { primary: "#C2EFEA", secondary: "#D4F0D4" },
    };

    const getColorForSection = (title) => {
      const mainCategory = title.split(' ').slice(0, 2).join(' ');

      if (categoryColors[title]) {
        return categoryColors[title];
      }

      for (const category in categoryColors) {
        if (title.includes(category) || category.includes(mainCategory)) {
          return categoryColors[category];
        }
      }

      return { primary: "#845EC2", secondary: "#D5CAEB" };
    };

    return (
      <div className="feedback-gallery">
        {sections.map((section, index) => {
          const { primary, secondary } = getColorForSection(section.title);

          return (
            <div
              key={index}
              className={`feedback-card ${index === 0 ? 'main-feedback-card' : ''}`}
              style={{
                '--card-primary': primary,
                '--card-secondary': secondary,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="card-header" style={{ backgroundColor: `${primary}15` }}>
                <h3>{section.title}</h3>
                <div className="card-accent" style={{ backgroundColor: primary }}></div>
              </div>

              <div className="card-content">
                {section.mainContent.length > 0 && (
                  <div className="main-content">
                    {section.mainContent.map((paragraph, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: formatMarkdownText(paragraph) }}></p>
                    ))}
                  </div>
                )}

                {Object.keys(section.subsections).length > 0 && (
                  <div className="subsections">
                    {Object.entries(section.subsections).map(([title, points], i) => (
                      <div key={i} className="subsection">
                        <h4>{title}</h4>
                        <ul>
                          {points.map((point, j) => (
                            <li key={j}>
                              <span dangerouslySetInnerHTML={{ __html: formatMarkdownText(point) }}></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="studio-stage results-stage">
      <div className="results-view">
        <div className="results-header">
          <h2>Artistic Insights</h2>
          <p>Professional critique and suggestions for improvement</p>
        </div>

        <div className="results-container">
          <div className="artwork-sidebar">
            <div className="artwork-preview">
              <img src={image} alt="Your artwork" />
            </div>
            <button className="new-analysis-btn" onClick={handleReset}>
              New Analysis
            </button>
          </div>

          <div className="feedback-content">
            {formatFeedback(feedback)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;