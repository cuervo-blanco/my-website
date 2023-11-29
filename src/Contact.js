import React, { useState } from 'react';
import soundStuff from './img/sound-stuff.webp';
// import Title from './section-title.js';
import contactBackground from './img/contact-background.jpg';


function Contact(){
    const [submissionMessage, setSubmissionMessage] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmissionMessage('Please wait...');
    
        const formData = new FormData(event.target);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
    
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
    
            const result = await response.json();
            setSubmissionMessage(result.message);
    
            if (response.status === 200) {
                setSubmissionMessage('Your message has been sent successfully!');
                // Redirect or show success message
                // window.location.href = '/custom-success-page'; // Uncomment to redirect
            } else {
                setSubmissionMessage(result.message || 'An error occurred. Please try again.');
                // Handle error
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionMessage('Something went wrong!');
        } finally {
            // Reset form or perform other finalization tasks
            event.target.reset();
            setTimeout(() => {
                setSubmissionMessage(''); // Clear message after a delay
            }, 5000); // Adjust delay as needed
        }
    };
    
    return(
            <div id="contact">
            <div id="contact-back-container"><div id="contact-background"><img src={contactBackground} alt="Background of constellations of a monkey and a chicken"></img></div></div>
            <h1>CONTACT</h1>
            <div id="contact-window">
                <div id="submission-message">{submissionMessage}</div>
  
                <form onSubmit={handleSubmit} action="https://api.web3forms.com/submit" method="POST">
                    <div id="inputs">
                        <input type="hidden" name="access_key" value="728e095b-d681-46ad-ad89-457e17a8353e"></input>
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