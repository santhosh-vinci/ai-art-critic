import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf'; // Static import since jspdf is installed

const ResultsView = ({ image, feedback, handleReset }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to format markdown text for UI rendering (at the top)
  const formatMarkdownText = (text) => {
    if (!text) return '';
    return text
      .replace(/\^\^(.*?)\^\^/g, '<span class="bold-text">$1</span>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Memoize feedback text for PDF to avoid reprocessing
  const feedbackText = useMemo(() => {
    if (!feedback) return 'No feedback available.';

    if (typeof feedback === 'object' && feedback.success !== undefined) {
      if (!feedback.success) {
        return feedback.message || 'Error retrieving feedback.';
      }
      return feedback.message;
    }

    if (typeof feedback !== 'string' || !feedback.trim()) {
      return 'Invalid feedback received.';
    }

    return feedback
      .replace(/^\s*-\s*/gm, '') // Remove dashes instead of converting to bullets
      .trim();
  }, [feedback]);

  const formatFeedback = (feedbackData) => {
    if (!feedbackData) {
      return <div className="error-message">No feedback available. Please try again.</div>;
    }

    if (typeof feedbackData === 'object' && feedbackData.success !== undefined) {
      if (!feedbackData.success) {
        return <div className="error-message">{feedbackData.message}</div>;
      }
      feedbackData = feedbackData.message;
    }

    if (typeof feedbackData !== 'string' || !feedbackData.trim()) {
      return <div className="error-message">Invalid feedback received.</div>;
    }

    const sections = [];
    const lines = feedbackData.split('\n');
    let currentSection = null;
    let currentSubsection = null;
    let mainContent = [];
    let subsections = {};

    for (let line of lines) {
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
        const cleanLine = trimmedLine.startsWith('• ') ? trimmedLine.substring(2) : trimmedLine;

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

    return (
      <div className="feedback-gallery">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`feedback-card ${index === 0 ? 'main-feedback-card' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-header">
              <h3>{section.title}</h3>
              <div className="card-accent"></div>
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
        ))}
      </div>
    );
  };

  const generatePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    console.log('Using enhanced PDF generation - May 29, 2025 v9');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 25;
      const contentWidth = pageWidth - margin * 2;

      // Color palette
      const colors = {
        primary: [91, 58, 141],     // Purple
        secondary: [135, 206, 235], // Sky blue
        accent: [255, 165, 0],      // Orange
        text: [51, 51, 51],         // Dark gray
        lightText: [120, 120, 120], // Light gray
        divider: [230, 230, 230],   // Light divider
      };

      // Helper function to add decorative elements
      const addDecorator = (x, y, width = 30, height = 2) => {
        pdf.setFillColor(...colors.accent);
        pdf.rect(x, y, width, height, 'F');
      };

      // Helper function to clean and format text for PDF
      const cleanTextForPDF = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove ** formatting for PDF processing
      };

      // Helper function to check if text has bold formatting
      const hasBoldFormatting = (text) => {
        return /\*\*(.*?)\*\*/g.test(text);
      };

      // Helper function to render bold text in PDF
      const addTextWithBold = (text, x, y, options = {}) => {
        const {
          fontSize = 10,
          color = colors.text,
          maxWidth = contentWidth,
          lineHeight = 1.2,
          indent = 0
        } = options;

        let currentY = y;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        let currentX = x + indent;
        
        for (let part of parts) {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            const boldText = part.slice(2, -2);
            pdf.setFontSize(fontSize);
            pdf.setFont('Helvetica', 'bold');
            pdf.setTextColor(...color);
            
            const textWidth = pdf.getTextWidth(boldText);
            if (currentX + textWidth > x + maxWidth) {
              currentY += fontSize * 0.352778 * lineHeight;
              currentX = x + indent;
            }
            
            pdf.text(boldText, currentX, currentY);
            currentX += textWidth;
          } else if (part.trim()) {
            // Normal text
            const words = part.split(' ');
            pdf.setFontSize(fontSize);
            pdf.setFont('Helvetica', 'normal');
            pdf.setTextColor(...color);
            
            for (let word of words) {
              if (word.trim()) {
                const wordWidth = pdf.getTextWidth(word + ' ');
                if (currentX + wordWidth > x + maxWidth) {
                  currentY += fontSize * 0.352778 * lineHeight;
                  currentX = x + indent;
                }
                pdf.text(word + ' ', currentX, currentY);
                currentX += wordWidth;
              }
            }
          }
        }
        
        return (currentY - y) + fontSize * 0.352778 * lineHeight;
      };

      // Helper function for better text wrapping with improved spacing
      const addStyledText = (text, x, y, options = {}) => {
        const {
          fontSize = 10,
          font = 'normal',
          color = colors.text,
          maxWidth = contentWidth,
          lineHeight = 1.2,
          indent = 0
        } = options;

        // Check if text contains bold formatting
        if (hasBoldFormatting(text)) {
          return addTextWithBold(text, x, y, { fontSize, color, maxWidth, lineHeight, indent });
        }

        pdf.setFontSize(fontSize);
        pdf.setFont('Helvetica', font);
        pdf.setTextColor(...color);
        
        const cleanText = cleanTextForPDF(text);
        const wrappedText = pdf.splitTextToSize(cleanText, maxWidth - indent);
        const textHeight = wrappedText.length * fontSize * 0.352778 * lineHeight;
        
        pdf.text(wrappedText, x + indent, y);
        return textHeight;
      };

      // Set default font
      pdf.setFont('Helvetica');

      // === HEADER SECTION ===
      let yPosition = margin;

      // Add subtle background for header
      pdf.setFillColor(248, 249, 250);
      pdf.rect(0, 0, pageWidth, 60, 'F');

      // Main title with enhanced styling
      pdf.setFontSize(28);
      pdf.setFont('Helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('Art Analysis Report', margin, yPosition + 15);

      // Add decorative line under title
      addDecorator(margin, yPosition + 20, 80, 3);

      // Subtitle
      pdf.setFontSize(12);
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(...colors.lightText);
      pdf.text('Professional Artistic Critique & Feedback', margin, yPosition + 30);

      // Date and time with better formatting
      const currentDate = new Date().toLocaleDateString('en-US', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit'
      });

      pdf.setFontSize(10);
      pdf.setTextColor(...colors.lightText);
      pdf.text(`Generated on ${currentDate} at ${currentTime}`, margin, yPosition + 42);

      yPosition = 80;

      // === IMAGE SECTION ===
      if (image) {
        try {
          const imgData = await new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              canvas.getContext('2d').drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = () => resolve(null);
            img.src = image;
          });

          if (imgData) {
            // Create a smaller frame for the image to save space
            const imgWidth = 60;
            const imgHeight = 60;
            const imgX = (pageWidth - imgWidth) / 2;
            
            // Add the image
            pdf.addImage(imgData, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
            
            // Add image caption
            pdf.setFontSize(8);
            pdf.setFont('Helvetica', 'italic');
            pdf.setTextColor(...colors.lightText);
            const captionText = 'Original Artwork';
            const textWidth = pdf.getTextWidth(captionText);
            pdf.text(captionText, (pageWidth - textWidth) / 2, yPosition + imgHeight + 8);
            
            yPosition += imgHeight + 15;
          } else {
            yPosition += 10;
          }
        } catch (error) {
          console.warn('Could not add image to PDF:', error);
          yPosition += 10;
        }
      }

      // === ANALYSIS SECTION HEADER ===
      // Add section divider
      pdf.setDrawColor(...colors.divider);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Analysis title with icon-like decorator
      pdf.setFontSize(16);
      pdf.setFont('Helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('📋 Analysis & Feedback', margin, yPosition);
      yPosition += 15;

      // === CONTENT PROCESSING ===
      const lines = feedbackText.split('\n');
      let sectionCount = 0;
      const maxYFirstPage = pageHeight - 80; // Reserve space for footer
      const maxYSecondPage = pageHeight - 40; // Less footer space on second page

      for (let line of lines) {
        const trimmedLine = line.trim();
        
        // Check if we need a new page - more aggressive page management
        const currentMaxY = pdf.getNumberOfPages() === 1 ? maxYFirstPage : maxYSecondPage;
        if (yPosition > currentMaxY) {
          if (pdf.getNumberOfPages() >= 2) {
            // If already on page 2, we need to compress content more aggressively
            break;
          }
          pdf.addPage();
          yPosition = margin + 10;
          
          // Add minimal page header on second page
          pdf.setFontSize(10);
          pdf.setFont('Helvetica', 'normal');
          pdf.setTextColor(...colors.lightText);
          pdf.text('Art Analysis Report (continued)', margin, margin);
          yPosition = margin + 20;
        }

        if (trimmedLine.startsWith('# ')) {
          // MAIN SECTION HEADER
          sectionCount++;
          const headerText = cleanTextForPDF(trimmedLine.substring(2));
          
          // Add minimal spacing before new sections
          if (sectionCount > 1) yPosition += 5;
          
          // Compact section design
          pdf.setFillColor(...colors.primary.map(c => c + 20));
          pdf.rect(margin - 3, yPosition - 6, contentWidth + 6, 15, 'F');
          
          // Section number
          pdf.setFontSize(10);
          pdf.setFont('Helvetica', 'bold');
          pdf.setTextColor(255, 255, 255);
          pdf.text(`${sectionCount}`, margin, yPosition);
          
          // Section title - handle bold formatting
          pdf.setFontSize(13);
          pdf.setFont('Helvetica', 'bold');
          pdf.setTextColor(255, 255, 255);
          pdf.text(headerText, margin + 12, yPosition);
          
          yPosition += 18;
          
        } else if (trimmedLine.startsWith('## ')) {
          // SUBSECTION HEADER
          const headerText = cleanTextForPDF(trimmedLine.substring(3));
          yPosition += 3;
          
          // Compact subsection design
          pdf.setFillColor(250, 250, 252);
          pdf.rect(margin, yPosition - 4, contentWidth, 12, 'F');
          
          yPosition += addStyledText(headerText, margin + 3, yPosition, {
            fontSize: 11,
            font: 'bold',
            color: colors.primary,
            lineHeight: 1.1
          });
          yPosition += 3;
          
        } else if (trimmedLine.match(/\^\^[^\^]+\^\^/)) {
          // HIGHLIGHTED SUBHEADING
          const headerTextMatch = trimmedLine.match(/^(?:[-•]\s*)?\s*\^\^([^\^]+)\^\^\s*(?::\s*|\s*)?(.*)$/);
          if (headerTextMatch) {
            const headerText = headerTextMatch[1];
            const remainingText = headerTextMatch[2] || '';
            
            yPosition += 2;
            
            // Compact highlight box
            pdf.setFillColor(...colors.secondary.map(c => Math.min(c + 40, 255)));
            const headerWidth = pdf.getTextWidth(headerText) + 8;
            pdf.rect(margin + 5, yPosition - 5, headerWidth, 10, 'F');
            
            // Subheading text
            pdf.setFontSize(10);
            pdf.setFont('Helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text(headerText, margin + 9, yPosition - 1);
            yPosition += 8;
            
            // Remaining text - no bullets, just paragraph text
            if (remainingText) {
              yPosition += addStyledText(remainingText, margin + 8, yPosition, {
                fontSize: 9,
                color: colors.text,
                lineHeight: 1.3
              });
            }
            yPosition += 3;
          }
          
        } else if (trimmedLine) {
          // REGULAR TEXT - NO BULLET POINTS
          const text = trimmedLine.startsWith('• ') ? trimmedLine.substring(2) : trimmedLine;
          
          yPosition += addStyledText(text, margin + 3, yPosition, {
            fontSize: 9,
            color: colors.text,
            lineHeight: 1.3
          });
          yPosition += 2;
        }
      }

      // === FOOTER ===
      const addFooter = (pageNum) => {
        const footerY = pageHeight - 20;
        
        // Footer line
        pdf.setDrawColor(...colors.divider);
        pdf.setLineWidth(0.3);
        pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
        
        // Footer text
        pdf.setFontSize(8);
        pdf.setFont('Helvetica', 'normal');
        pdf.setTextColor(...colors.lightText);
        pdf.text('Generated by ArtCritic - Professional Art Analysis Platform', margin, footerY);
        
        // Page number
        pdf.text(`Page ${pageNum}`, pageWidth - margin - 20, footerY);
        
        // Website
        pdf.setTextColor(...colors.secondary);
        pdf.text('www.artcritic.com', pageWidth - margin - 30, footerY - 8);
      };

      // Add footers to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(i);
      }

      // Create and download PDF
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `art-analysis-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="studio-stage results-stage">
      <div className="results-view">
         <div className="spacer" style={{ height: "20vh" }} />
        <div className="results-header">
          <h2>Artistic Insights</h2>
          <p>Professional critique and suggestions for improvement</p>
        </div>

        <div className="results-container">
          <div className="artwork-sidebar">
            <div className="artwork-preview">
              <img src={image} alt="Artwork" />
            </div>
            <button className="new-analysis-btn" onClick={handleReset}>
              New Analysis
            </button>
            <button
              className="generate-pdf-btn"
              onClick={generatePDF}
              disabled={isGenerating}
              aria-label="Generate PDF report"
            >
              {isGenerating ? (
                <>
                  <span className="pdf-spinner">⚙️</span>
                  Generating...
                </>
              ) : (
                <>
                Generate PDF
                </>
              )}
            </button>
          </div>

          <div className="feedback-content">{formatFeedback(feedback)}</div>
          
            <div className="spacer" style={{ height: "10vh" }} />
        </div>
      </div>

      <style jsx>{`
        .generate-pdf-btn {
          width: 100%;
          padding: 14px 20px;
          margin-top: 12px;
          background: linear-gradient(90deg,rgb(141, 61, 58) 0%,rgb(222, 167, 58) 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(91, 58, 141, 0.3);
        }
        
        .generate-pdf-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(91, 58, 141, 0.4);
          background: linear-gradient(90deg,rgb(141, 61, 58) 20%,rgb(222, 167, 58) 100%);
          transition: 3 S;
        }
        
        .generate-pdf-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .generate-pdf-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .pdf-spinner {
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .new-analysis-btn {
          transition: all 0.3s ease;
        }
        
        .new-analysis-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ResultsView;