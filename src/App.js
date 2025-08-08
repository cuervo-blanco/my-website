import React, {useEffect} from 'react';
import {useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from "./components/common/Menu";
import Contact from "./components/sections/Contact";
import Portfolio from "./components/sections/Portfolio";
import Reel from "./components/sections/Reel.tsx";
import ResumeButton from "./components/sections/Resume";
import Footer from "./components/layout/Footer";
import Hero from "./components/layout/Hero";
import Terms from "./pages/Terms";
import "./App.css";

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBygpDcQeB1uCLTiIAAtxvwM10Tzmkk0fE",
  authDomain: "my-website-26cef.firebaseapp.com",
  projectId: "my-website-26cef",
  storageBucket: "my-website-26cef.appspot.com",
  messagingSenderId: "1082529460512",
  appId: "1:1082529460512:web:25aefd99175dee1d59e745",
  measurementId: "G-SPLT8ZXMYL"
};

const app = initializeApp(firebaseConfig);

function ScrollManager() {
  const location = useLocation();
  const analytics = getAnalytics(app);

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_path: location.pathname,
    });
    const scrollToSection = () => {
      if (location.state?.scrollTo) {
        const section = document.getElementById(location.state.scrollTo);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Retry after a short delay
          setTimeout(scrollToSection, 100);
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };
    scrollToSection();
  }, [location, analytics]);
  return null;
}

function App() {
  const navigate = (path) => {
    window.history.pushState({}, '', path);
  };

  return (
    <Router>
    <ScrollManager />
    <div className="App" id="application">
      <Menu navigate={navigate}/>
      <Routes>
        <Route path="/" element={
          <div id="homepage">
            <div><Hero /></div>
            <div>
              <Reel
                storagePath="videos/jaime-rivera-reel.mov"
                width={1920}
                height={1080}
              />
            </div>
            <div><ResumeButton /></div>
            <div><Contact /></div>
            <div><Footer /></div>
          </div>
        } />
        <Route path="/portfolio" element={<><Portfolio /><Footer /></>} />
        <Route path="/terms" element={<><Terms /><Footer /></>} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
