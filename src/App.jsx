import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import MissionDetail from "./pages/MissionDetail";
import VoyagerExperience from "./pages/VoyagerExperience";
import Intelligence from "./pages/Intelligence";
import NotFound from "./pages/NotFound";

function AnimatedRoutes() {
  const location = useLocation();

  // After the old page has faded out: return to the top and move focus to
  // <main>, so keyboard and screen-reader users start at the new content.
  // This does not run on the first page load.
  const handleExitComplete = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/mission/:id" element={<MissionDetail />} />
          <Route path="/voyager" element={<VoyagerExperience />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    // basename follows Vite's `base` option, so deployment to a sub-path
    // (for example GitHub Pages) works without changing this file.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* reducedMotion="user": Framer Motion drops movement when the
          visitor's system asks for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </MotionConfig>
    </BrowserRouter>
  );
}
