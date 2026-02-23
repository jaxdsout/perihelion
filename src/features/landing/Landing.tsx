import { Link } from "react-router-dom";
import "./landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landingOverlay" />

      <nav className="landingNav">
        <span className="landingLogo">perihelion</span>
        <div className="landingNavLinks">
          <Link to="/login">Sign In</Link>
          <Link to="/signup" className="navCta">Get Started</Link>
        </div>
      </nav>

      <main className="landingHero">
        <h1>
          per·i·he·li·on
        </h1>
        <p>/ˌperəˈhēlyən/ <b>noun</b></p>
        <p>the point in the orbit of a planet, asteroid, or comet at which it is closest to the sun.</p>
        <p>
          The all-in-one platform for modern real estate agents. Manage clients,
          deals, listings, and market searches — in one place.
        </p>
        <div className="landingHeroBtns">
          <Link to="/signup" className="heroBtnPrimary">GET STARTED</Link>
          <Link to="/login" className="heroBtnSecondary">SIGN IN</Link>
        </div>
      </main>

      <div className="landingFeatures">
        <div className="landingFeature">
          <i className="fa-sharp fa-solid fa-people-group" />
          <span>Client Management</span>
        </div>
        <div className="landingFeature">
          <i className="fa-sharp fa-solid fa-handshake" />
          <span>Deal Tracking</span>
        </div>
        <div className="landingFeature">
          <i className="fa-solid fa-list" />
          <span>Property Lists</span>
        </div>
        <div className="landingFeature">
          <i className="fa-solid fa-map" />
          <span>Map Search</span>
        </div>
        <div className="landingFeature">
          <i className="fa-solid fa-calculator" />
          <span>NER Calculator</span>
        </div>
      </div>
    </div>
  );
}
