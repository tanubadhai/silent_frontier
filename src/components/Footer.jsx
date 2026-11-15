import { Link } from "react-router-dom";
import { ExternalLink, Orbit } from "lucide-react";
import { NAV_ITEMS } from "../utils/navigation";
import "./Footer.css";

// Read once when the module loads, not on every render.
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__about">
          <p className="site-footer__brand">
            <Orbit aria-hidden="true" />
            <span>STARSTUFF</span>
          </p>
          <p className="site-footer__tagline">
            Long after the launch, beyond the final signal, their stories remain.
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          <ul>
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="site-footer__note">
          An independent student project for the{" "}
          <a
            href="https://www.spaceappschallenge.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NASA Space Apps Challenge
            <ExternalLink aria-hidden="true" />
            <span className="visually-hidden">(opens in a new tab)</span>
          </a>
          , 2026 challenge &ldquo;Abandoned but Not Forgotten&rdquo;. It is not an official NASA
          product.
        </p>
      </div>

      <div className="site-footer__legal container">
        <small>&copy; {CURRENT_YEAR} Team STARSTUFF</small>
      </div>
    </footer>
  );
}
