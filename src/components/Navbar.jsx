import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Orbit, X } from "lucide-react";
import { NAV_ITEMS } from "../utils/navigation";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

  // While the mobile menu is open: Escape closes it (and returns focus to the
  // toggle button), and so does a click or tap outside the header.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    const handlePointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__inner container">
        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
          aria-label="STARSTUFF, The Silent Frontier: home"
        >
          <Orbit className="brand__icon" aria-hidden="true" />
          <span className="brand__name">STARSTUFF</span>
          <span className="brand__project">The Silent Frontier</span>
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          id="primary-navigation"
          className={`primary-nav${isOpen ? " is-open" : ""}`}
          aria-label="Primary"
        >
          <ul>
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className="nav-link" onClick={closeMenu}>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
