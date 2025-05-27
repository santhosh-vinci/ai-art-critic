import React, { useState, useEffect } from "react";
import { fetchGeminiFeedback } from "../utils/geminiVision";
import StudioHeader from "./StudioHeader";
import UploadArea from "./UploadArea";
import AnalysisView from "./AnalysisView";
import ResultsView from "./ResultsView";
import "../styles/styles.css";
import HeroSection from "./HeroSection";
import TextParallax from "./TextParallax";
import Footer from "./Footer";
import TestimonialsSection from "./TestimonialsSection";
import FAQ from "./FAQ";

const LandingPage = () => {
  const [image, setImage] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [currentView, setCurrentView] = useState("upload");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      setCurrentView("analyze");
    } else if (feedback) {
      setCurrentView("results");
    } else {
      setCurrentView("upload");
    }
  }, [feedback, isAnalyzing]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.match('image.*')) {
      showNotification("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setFeedback(null);
    };
    reader.readAsDataURL(file);
  };

  const showNotification = (message) => {
    alert(message);
  };

  const handleAnalyze = async () => {
    if (!image) {
      showNotification("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setLoading(true);
    try {
      const result = await fetchGeminiFeedback(image.split(",")[1]);
      setFeedback(result);
    } catch (error) {
      // console.error("Error fetching feedback:", error);
      setFeedback({ success: false, message: "An unexpected error occurred. Please try again." });
    } finally {
      setIsAnalyzing(false);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setFeedback(null);
    setIsAnalyzing(false);
    setLoading(false);
    setCurrentView("upload");
  };

  return (
    <div className={`art-studio-app ${animateIn ? 'animate-in' : ''}`}>
      <StudioHeader currentView={currentView} />
      <HeroSection />
      <TextParallax />
      <main className="studio-content">
        {currentView === "upload" && (
          <UploadArea
            image={image}
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleImageUpload={handleImageUpload}
            handleReset={handleReset}
            handleAnalyze={handleAnalyze}
            isLoading={loading}
          />
        )}
        {currentView === "analyze" && (
          <AnalysisView image={image} />
        )}
        {currentView === "results" && (
          <ResultsView
            image={image}
            feedback={feedback}
            handleReset={handleReset}
          />
        )}
        <FAQ />
      </main>
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;