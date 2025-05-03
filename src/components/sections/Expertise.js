import React, { } from 'react';
import Title from '../common/section-title';
import jaimeLogo from '../../assets/img/Logo Jaime 3.png';

const Expertise = () => {
    return(

        <div id="expertise-section">
            <Title title="WHAT DO I DO?"/>
            <div id="expertise-container">
                <div id="expertise-block1" className='expertise-block'>
                    <h2>Sound</h2>
                    <p>I honed my craft in Cuba, learning the intricacies of <div className="adjective-orange" >Film & TV Sound</div> It’s where the foundations were laid, where I grasped sound as a collaborative journey. It wasn’t just about the technical; it was about weaving a <div className="adjective-orange" >Narrative</div> treating film-making as an <div className="adjective-orange" >Art</div> A stark contrast to my earlier learnings in Audiovisual Communications, where the focus was <div className="adjective-blue">ALL</div> about the product.</p>
                    <p>What is it for me, you ask? It’s a dance between both worlds.</p>
        
                </div>

                <div id="expertise-block2" className='expertise-block'>
                    <h2>Design</h2>
                    <p>My romance with sound isn’t just academic; it’s personal. It started with the strum of a guitar, the gentle rustle of a brook, before morphing into something more technical. <div className="adjective-orange">Audio</div> is a journey. The strings, the waves, the microphones, cables - they aren’t just tools; they’re instruments of <div className="adjective-orange">Music</div></p>
                    <p>With a computer by my side, I ventured into Sound <div className="adjective-orange" >Design</div> mastering the art and science of Sound <div className="adjective-blue" >Editing</div> & Supervising.</p> {/*<div className="iconCanvas"><img className="icon" alt="filmmaking icon"></img></div>*/}
                </div>

                <div id="expertise-block3" className='expertise-block'>
                    <h2>& Tech</h2>
                    <p>Then, the digital realm beckoned. Amidst the intricate ballet of <div className="adjective-orange" >Digital</div> Audio manipulation, I discovered PureData. A programmer was born amidst the choreography of custom <div className="adjective-orange" >Synthesizers</div> and endless delays. I wasn’t just shaping sound anymore; I was coding it, a filmmaker and a techie, painting with <div className="adjective-orange" >Code</div></p>
                    <p>Imagine a Puerto Rican Bear Grylls, but in a DJ’s outfit, mixing not just sounds but <div className="adjective-blue">Mixing</div> it up in the Ones-And-Zeroes playground as well.</p> {/*<div className="iconCanvas"><img className="icon" alt="filmmaking icon"></img></div>*/}
                </div>
            </div>
            <div id="expertise-footer">
                <img src={jaimeLogo} alt="Jaime's first logo, a moon with an ant"/>
            </div>

        </div>

    );
}

export default Expertise;
