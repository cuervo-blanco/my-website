import React from 'react';
import soundStuff from './img/sound-stuff.webp';
// import Title from './section-title.js';
import contactBackground from './img/contact-background.jpg';


function Contact(){
    return(
            <div id="contact">
            <div id="contact-back-container"><div id="contact-background"><img src={contactBackground} alt="Background of constellations of a monkey and a chicken"></img></div></div>
            <h1>CONTACT</h1>
            <div id="contact-window">
  
                <form action="/submit-form" method="post">
                    <div id="inputs">
                        <div className="form-input"> <label for="name">Name:</label>
                            <input type="text" id="name" name="name" required />
                        </div>

                        <div className="form-input"><label for="email">Email:</label>
                            <input type="email" id="email" name="email" required />
                        </div>

                        <div className="form-input"><label for="subject">Subject:</label>
                            <select id="subject" name="subject" required> 
                                <option value="production-sound">Production Sound Services</option>
                                <option value="post-production-sound">Post-Production Sound Services</option>
                                <option value="live-sound">Live Sound Services</option>
                                <option value="rate-query">Services Rate Information</option>
                                <option value="consultations">Consultations</option>
                                <option value="courses">Online Courses</option>
                                <option value="other">Other</option>
                                
                            </select>
                        </div>

                    </div>

                    <div id="message">
                        <div className="form-input2"><label for="message">Message:</label>
                            <textarea id="message" name="message" rows="4" required></textarea>
                        </div>
                    
                    <div className="form-input2"><button type="submit">SUBMIT</button></div></div>
                 </form>

            </div>

            <div id="contact-footer">
                <img src={soundStuff} alt="Sound Equipment doodle"/>
            </div>
    </div>
    )
}

export default Contact;