import { useState } from 'react';
import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope, FaHeart } from 'react-icons/fa';
import "../styles/styles.css";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send this to your backend
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      
      // Reset the subscribed message after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Logo and About */}
          <div className="footer-column">
            <div className="logo-container">
            <img src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-Transparent.png" style={{height : "70px"}}></img>
              <span className="logo-text">Art<span style={{color:"white"}}>Critic</span></span>
              <FaHeart className="heart-icon" size={16} />
            </div>
            <p className="about-text">
              Discover, discuss, and appreciate art from around the world.
              Your platform for artistic expression and critique.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h3 className="column-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#" className="footer-link">Discover</a></li>
              <li><a href="#" className="footer-link">Artists</a></li>
              <li><a href="#" className="footer-link">Exhibitions</a></li>
              <li><a href="#" className="footer-link">Submit Artwork</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-column">
            <h3 className="column-title">Resources</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Art History</a></li>
              <li><a href="#" className="footer-link">Tutorials</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
              <li><a href="#" className="footer-link">Support</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="footer-column">
            <h3 className="column-title">Stay Updated</h3>
            <p className="newsletter-text">Subscribe to our newsletter for the latest art news and events.</p>
            
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="email-input"
                required
              />
              <button type="submit" className="subscribe-button">Subscribe</button>
            </form>
            
            {subscribed && (
              <p className="success-message">Thanks for subscribing!</p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="social-container">
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Email">
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} ArtCritic. All rights reserved.</p>
          <div className="legal-links">
            <a href="#" className="legal-link">Privacy Policy</a>
            <a href="#" className="legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;