import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import "../styles/TextPrallax.css";

const TextPrallax = () => {
  const containerRef = useRef();

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <main className="main-container">
      <div className="spacer" />
      <div ref={containerRef}>
        <Slide src="/images/1.jpg" direction="left" left="-40%" progress={scrollYProgress} />
        <Slide src="/images/2.jpg" direction="right" left="-25%" progress={scrollYProgress} />
        <Slide src="/images/3.jpg" direction="left" left="-75%" progress={scrollYProgress} />
      </div>
      <div className="spacer" />
    </main>
  );
};

const Slide = ({ src, direction, left, progress }) => {
  const dirMultiplier = direction === 'left' ? -1 : 1;
  const translateX = useTransform(progress, [0, 1], [150 * dirMultiplier, -150 * dirMultiplier]);

  return (
    <motion.div style={{ x: translateX, left }} className="slide">
      <Phrase src={src} />
      <Phrase src={src} />
      <Phrase src={src} />
    </motion.div>
  );
};

const Phrase = ({ src }) => {
  return (
    <div className="phrase">
      <p className="phrase-text">Unfiltered<span className='first-letter'>.</span> Unbiased<span className='first-letter'>.</span> Unapologetic<span className='first-letter'>.</span></p>
      <span className="image-wrapper">
        <img src={src} alt="image" />
      </span>
    </div>
  );
};

export default TextPrallax;
