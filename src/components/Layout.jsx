import Footer from "./Footer";
import Navbar from "./Navbar";
import Starfield from "./Starfield";

/**
 * Shared frame for every page: starfield, skip link, navigation, content, footer.
 * The <main> element has tabIndex={-1} so focus can be moved to it after a
 * route change (see AnimatedRoutes in App.jsx).
 */
export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Starfield />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
