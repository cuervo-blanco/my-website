import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Menu from "./components/common/Menu";
import Footer from "./components/layout/Footer";
import Terms from "./pages/Terms";
import FilmHomePage from "./pages/FilmHomePage";
import DevHomePage from "./pages/DevHomePage";
import ArtHomePage from "./pages/ArtHomePage";
import ContactPage from "./pages/ContactPage";
import constellations from "./assets/img/banner-npem.png";
import { getHostedSiteKey } from "./config/siteSections";
import { logPageView } from "./lib/firebase";
import { scrollToElementById, scrollToTop } from "./lib/scroll";

function ScrollManager() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.hash === "#contact") { navigate("/contact", { replace: true }); return; }
    logPageView(location.pathname);
    const sectionId = location.state?.scrollTo || location.hash.replace("#", "");
    if (sectionId) scrollToElementById(sectionId);
    else scrollToTop();
  }, [location, navigate]);
  return null;
}

function HostedRootRoute() {
  const hosted = getHostedSiteKey(typeof window !== "undefined" ? window.location.hostname : "");
  if (hosted === "dev") return <DevHomePage />;
  if (hosted === "art") return <ArtHomePage />;
  return <FilmHomePage />;
}

function LegacyRedirect({ to }) {
  const { hash } = useLocation();
  const target = hash ? `${to.split("#")[0]}${hash}` : to;
  return <Navigate to={target} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HostedRootRoute />} />
      <Route path="/dev" element={<DevHomePage />} />
      <Route path="/dev/dsp-dictionary" element={<LegacyRedirect to="/dev#dsp-dictionary" />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/art" element={<ArtHomePage />} />
      <Route path="/terms" element={<><Terms /><Footer /></>} />
      {["/film", "/live", "/live/companies", "/film/samples", "/portfolio", "/samples", "/companies"].map((path) => (
        <Route key={path} path={path} element={<LegacyRedirect to={
          ["/companies", "/live/companies"].includes(path) ? "/#recent-clients"
            : path === "/live" ? "/#live-credits"
              : path === "/film" ? "/#credits" : "/#portfolio-films"
        } />} />
      ))}
      {["/software", "/projects", "/dev/projects"].map((path) => (
        <Route key={path} path={path} element={<LegacyRedirect to="/dev" />} />
      ))}
      <Route path="/dsp-dictionary" element={<LegacyRedirect to="/dev#dsp-dictionary" />} />
      <Route path="/art/about" element={<Navigate to="/art" replace />} />
      <Route path="/about" element={<Navigate to="/art" replace />} />
    </Routes>
  );
}

export function AppShell() {
  return <div className="App" id="application"><div className="site-constellations" aria-hidden="true"><img src={constellations} alt="" /></div><Menu /><AppRoutes /></div>;
}

function App() {
  return <BrowserRouter><ScrollManager /><AppShell /></BrowserRouter>;
}

export default App;
