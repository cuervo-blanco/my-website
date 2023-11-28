import React, {useEffect} from 'react';
import {useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from "./Menu";
import Hero from "./Hero";
import AboutSection from "./AboutSection";
import Skills from "./Skills";
import Contact from "./Contact";
import Portfolio from "./Portfolio";
import Expertise from "./Expertise";
import Services from "./Services";
import Footer from "./Footer";
import Terms from "./Terms";
import "./App.css";




function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
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
  }, [location]);

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
            <Hero />
            <AboutSection />
            <Expertise />
            <Services />
            <Skills />
            <Contact />
            <Footer />
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
