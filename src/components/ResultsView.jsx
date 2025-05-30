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

    console.log('Using enhanced PDF generation - May 29, 2025 v10');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 25;
      const contentWidth = pageWidth - margin * 2.8;

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

      // === BLURRED BACKGROUND SETUP ===
      let blurredBgData = null;
      if (image) {
        try {
          blurredBgData = await new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = 400;
              canvas.height = 200;
              
              // Draw and blur the image for background
              ctx.filter = 'blur(15px) opacity(0.3)';
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = () => resolve(null);
            img.src = image;
          });
        } catch (error) {
          console.warn('Could not create blurred background:', error);
        }
      }

      // === HEADER SECTION WITH BLURRED BACKGROUND ===
      let yPosition = margin;

      // Add blurred artwork background to header
      if (blurredBgData) {
        pdf.addImage(blurredBgData, 'JPEG', 0, 0, pageWidth, 80);
        // Add overlay for better text readability
        pdf.setFillColor(255, 255, 255, 0.8);
        pdf.rect(0, 0, pageWidth, 80, 'F');
      } else {
        // Fallback gradient background
        pdf.setFillColor(248, 249, 250);
        pdf.rect(0, 0, pageWidth, 80, 'F');
      }

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

      yPosition = 90;

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
              resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            img.onerror = () => resolve(null);
            img.src = image;
          });

          if (imgData) {
            // Calculate image dimensions to maintain aspect ratio without cropping
            const img = new Image();
            img.src = imgData;
            await new Promise(resolve => {
              img.onload = resolve;
            });
            
            const maxWidth = 80;
            const maxHeight = 80;
            const aspectRatio = img.width / img.height;
            
            let imgWidth, imgHeight;
            if (aspectRatio > 1) {
              // Landscape
              imgWidth = maxWidth;
              imgHeight = maxWidth / aspectRatio;
            } else {
              // Portrait or square
              imgHeight = maxHeight;
              imgWidth = maxHeight * aspectRatio;
            }
            
            const imgX = (pageWidth - imgWidth) / 2;
            
            // Add border frame
            pdf.setDrawColor(...colors.primary);
            pdf.setLineWidth(2);
            pdf.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4);
            
            // Add the image without compression or cropping
            pdf.addImage(imgData, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
            
            // Add image caption
            pdf.setFontSize(9);
            pdf.setFont('Helvetica', 'italic');
            pdf.setTextColor(...colors.lightText);
            const captionText = 'Original Artwork';
            const textWidth = pdf.getTextWidth(captionText);
            pdf.text(captionText, (pageWidth - textWidth) / 2, yPosition + imgHeight + 10);
            
            yPosition += imgHeight + 20;
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
      pdf.text('Analysis & Feedback', margin, yPosition);
      yPosition += 15;

      // === CONTENT PROCESSING ===
        const lines = feedbackText.split('\n');
      let sectionCount = 0;
      const footerSpace = 35; // Space reserved for footer
      const maxYFirstPage = pageHeight - footerSpace; // More conservative space on first page
      const maxYOtherPages = pageHeight - footerSpace-4; // Same footer space on other pages
      let sectionsOnFirstPage = 0;

      for (let line of lines) {
        const trimmedLine = line.trim();
        
        // Check if we need a new page - more conservative approach
        const currentMaxY = pdf.getNumberOfPages() === 1 ? maxYFirstPage : maxYOtherPages;
        
        // For section headers, check if there's enough space for header + some content
        if (trimmedLine.startsWith('# ') && yPosition > currentMaxY - 40) {
          pdf.addPage();
          yPosition = margin + 10;
          
          // Add minimal page header on subsequent pages
          pdf.setFontSize(10);
          pdf.setFont('Helvetica', 'normal');
          pdf.setTextColor(...colors.lightText);
          pdf.text('Art Analysis Report (continued)', margin, margin);
          yPosition = margin + 20;
        } else if (yPosition > currentMaxY) {
          pdf.addPage();
          yPosition = margin + 10;
          
          // Add minimal page header on subsequent pages
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
          
          // Track sections on first page
          if (pdf.getNumberOfPages() === 1) {
            sectionsOnFirstPage++;
          }
          
          // Add spacing before new sections
          if (sectionCount > 1) yPosition += 8;
          
          // Enhanced section design with special colors for Strengths and Suggestions
          let sectionColor = colors.primary;
          if (headerText.toLowerCase().includes('strength')) {
            sectionColor = [34, 139, 34]; // Forest Green
          } else if (headerText.toLowerCase().includes('suggestion') || headerText.toLowerCase().includes('improve')) {
            sectionColor = [255, 140, 0]; // Dark Orange
          }
          
          pdf.setFillColor(...sectionColor.map(c => Math.max(c - 10, 0)));
          pdf.rect(margin - 3, yPosition - 8, contentWidth + 6, 18, 'F');
          
          // Section number
          pdf.setFontSize(12);
          pdf.setFont('Helvetica', 'bold');
          pdf.setTextColor(255, 255, 255);
          pdf.text(`${sectionCount}`, margin + 2, yPosition);
          
          // Section title - bold and colored
          pdf.setFontSize(14);
          pdf.setFont('Helvetica', 'bold');
          pdf.setTextColor(255, 255, 255);
          pdf.text(headerText, margin + 15, yPosition);
          
          yPosition += 22;
          
        } else if (trimmedLine.startsWith('## ')) {
          // SUBSECTION HEADER
          const headerText = cleanTextForPDF(trimmedLine.substring(3));
          yPosition += 4;
          
          // Enhanced subsection design
          pdf.setFillColor(245, 247, 250);
          pdf.rect(margin, yPosition - 5, contentWidth, 14, 'F');
          
          // Add left border accent
          pdf.setFillColor(...colors.accent);
          pdf.rect(margin, yPosition - 5, 3, 14, 'F');
          
          yPosition += addStyledText(headerText, margin + 8, yPosition, {
            fontSize: 12,
            font: 'bold',
            color: colors.primary,
            lineHeight: 1.2
          });
          yPosition += 5;
          
        } else if (trimmedLine.match(/\^\^[^\^]+\^\^/)) {
          // HIGHLIGHTED SUBHEADING - Bold and colored, no background
          const headerTextMatch = trimmedLine.match(/^(?:[-•]\s*)?\s*\^\^([^\^]+)\^\^\s*(?::\s*|\s*)?(.*)$/);
          if (headerTextMatch) {
            const headerText = headerTextMatch[1];
            const remainingText = headerTextMatch[2] || '';
            
            yPosition += 3;
            
            // Bold colored text without background
            pdf.setFontSize(11);
            pdf.setFont('Helvetica', 'bold');
            
            // Color based on content
            let textColor = colors.accent;
            if (headerText.toLowerCase().includes('strength') || headerText.toLowerCase().includes('good')) {
              textColor = [34, 139, 34]; // Green
            } else if (headerText.toLowerCase().includes('improve') || headerText.toLowerCase().includes('suggest')) {
              textColor = [255, 69, 0]; // Red-Orange
            }
            
            pdf.setTextColor(...textColor);
            pdf.text(`• ${headerText}`, margin + 8, yPosition);
            yPosition += 6;
            
            // Remaining text
            if (remainingText) {
              yPosition += addStyledText(remainingText, margin + 12, yPosition, {
                fontSize: 10,
                color: colors.text,
                lineHeight: 1.4
              });
            }
            yPosition += 4;
          }
          
        } else if (trimmedLine) {
          // REGULAR TEXT - Clean paragraph style
          const text = trimmedLine.startsWith('• ') ? trimmedLine.substring(2) : trimmedLine;
          
          yPosition += addStyledText(text, margin + 8, yPosition, {
            fontSize: 10,
            color: colors.text,
            lineHeight: 1.4
          });
          yPosition += 3;
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
        pdf.text('https://www.artcritic.vercel.app/', pageWidth - margin - 20, footerY - -7);
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
        </div>
      </div>

      <style jsx>{`
        .generate-pdf-btn {
  width: 100%;
  padding: 14px 20px;
  margin-top: 12px;
  background: linear-gradient(135deg, rgb(141, 61, 58), rgb(222, 167, 58));
  background-size: 200% 200%;
  background-position: left center;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-position 0.8s ease, transform 0.3s ease, box-shadow 0.3s ease;
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
  background-position: right center;
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