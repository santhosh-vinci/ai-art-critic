import React, { useState } from 'react';
import "../styles/FAQ.css";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={onClick}>
        {question}
        <span className="faq-icon">
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 15L12 8L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 9L12 16L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(1);
  
  const faqItems = [
    // {
    //   question: "What can ArtCritic analyze in my artwork?",
    //   answer: "ArtCritic can analyze composition, color theory, artistic techniques, historical context, emotional impact, and provide technical feedback on your artwork. It examines visual elements, identifies styles, and offers both technical and aesthetic insights."
    // },
    {
      question: "How accurate is ArtCritic's art analysis?",
      answer: "ArtCritic's art analysis is highly accurate, trained on diverse art collections spanning various periods, styles, and cultures. It combines technical knowledge with contextual understanding to provide nuanced feedback that professional artists and educators have validated for quality and depth."
    },
    // {
    //   question: "Can ArtCritic recognize different art styles and movements?",
    //   answer: "Yes, ArtCritic can recognize and analyze a wide range of art styles and movements from Renaissance to Contemporary, including Impressionism, Cubism, Abstract Expressionism, and digital art forms. It identifies stylistic elements and places your work within broader artistic traditions."
    // },
    {
      question: "Is it possible to get feedback on works in progress?",
      answer: "Absolutely! You can upload in-progress artwork to receive valuable feedback at any stage of creation. ArtCritic can suggest improvements, highlight strengths, and provide guidance on how to develop your piece further. This iterative feedback helps you refine your work throughout the creative process."
    },
    {
      question: "How does ArtCritic protect my original artwork?",
      answer: "ArtCritic uses advanced encryption and secure data handling protocols to protect your original artwork. Your uploads are never shared with third parties without your explicit permission, and you retain full copyright and ownership of all your submitted work."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2>Frequently asked questions.</h2>
        </div>
        <div className="faq-content">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;