import React, { } from 'react';
import Godzilla from '../../assets/img/Godzilla.png'
import JaimeMoon from '../../assets/img/JaimeMoon.png'
import banner from "../../assets/img/banner-npem.png";




const Hero = () => {
    return (
        <div id="hero">
        <div id="banner-about">
        <img src={banner} alt="Starry night with animal constelations" />
      </div>
            <div id="hero-container">
                <div id="hero-title">
                    <h1>Jaime O. Rivera Santana</h1>
                    <h2>Sound for any time, any place and any one... even Godzilla. </h2>
                </div>
                <div id="hero-image">
                    <img id="hero-godzilla" className="hero-picture" src={Godzilla} alt="Godzilla terrorizing a city"></img>
                    <img id="hero-jaime" className="hero-picture" src={JaimeMoon} alt="Jaime in the moon"></img>
                </div>   
            </div>
            
        </div>
    );
}

export default Hero;
