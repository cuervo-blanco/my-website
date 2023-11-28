import React, { } from 'react';
// import moon from './img/moon.png'
import Godzilla from './img/Godzilla.png'
import JaimeMoon from './img/JaimeMoon.png'




const Hero = () => {
    return (
        <div id="hero">
            <div id="hero-container">
                <div id="hero-title">
                    <h1>Jaime Osvaldo</h1>
                    <h2>Audiovisual Sound for any time, any place and any one... even Godzilla. </h2>
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