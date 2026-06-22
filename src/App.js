import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Menu from "./components/common/Menu";
import Footer from "./components/layout/Footer";
import Terms from "./pages/Terms";
import Home from "./pages/Home";
import PortfolioPage from "./pages/PortfolioPage";
import DspDictionary from "./pages/DspDictionary";
import { logPageView } from "./lib/firebase";
import { scrollToElementById, scrollToTop } from "./lib/scroll";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);

    const sectionId =
      location.state?.scrollTo || location.hash.replace("#", "");

    if (sectionId) {
      scrollToElementById(sectionId);
      return;
    }

    scrollToTop();
  }, [location]);

  return null;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dsp-dictionary" element={<DspDictionary />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/terms" element={<><Terms /><Footer /></>} />
    </Routes>
  );
}

export function AppShell() {
  return (
    <div className="App" id="application">
      <Menu />
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
