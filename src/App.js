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

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBygpDcQeB1uCLTiIAAtxvwM10Tzmkk0fE",
  authDomain: "my-website-26cef.firebaseapp.com",
  projectId: "my-website-26cef",
  storageBucket: "my-website-26cef.appspot.com",
  messagingSenderId: "1082529460512",
  appId: "1:1082529460512:web:25aefd99175dee1d59e745",
  measurementId: "G-SPLT8ZXMYL"
};

// Initialize Firebase
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
            <div><AboutSection /></div>
            <div><Expertise /></div>
            <div><Services /></div>
            <div><Skills /></div>
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
