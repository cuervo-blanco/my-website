import React from 'react';
import jaimeOsvaldo003 from '../../assets/img/jaime-osvaldo-003.jpeg';
import jaimeOsvaldo004 from '../../assets/img/jaime-osvaldo-004.jpeg';
import jaimeOsvaldo005 from '../../assets/img/jaime-osvaldo-005.jpeg';
import pictureRowBackground from '../../assets/img/background.jpg';

const PictureRow = () => {
    return (
        <div id="PictureRow">
        <div id="quote"><h2>1 second of sound equals 48,000 pictures.</h2></div>
        <hr/>
            <div id="picture-container">
            <div id="picture-row-background"><img src={pictureRowBackground} alt="Constellations background"/></div>
            
                <div id="picture1" className='picture-frame'>
                    <div className="picture-text">
                        <h2>Waves</h2>
                        <hr/>
                        <p>Just like the Ocean has Waves and they dance in Dynamic ecstasy, so does Audio.</p>
                    </div>
                    <img src={jaimeOsvaldo003} alt="Jaime Osvaldo in the beach"/>
                </div>
                <div id="picture2" className='picture-frame' >
                    <div className="picture-text">
                        <h2>Balance</h2>
                        <hr/>
                        <p>A Sound Person is a gardener of Frequencies, Levels and Words. We mix them like Forests or Gardens.</p>
                    </div>
                    <img src={jaimeOsvaldo005} alt="Jaime Osvaldo in the forest"/>

                </div>
                <div id="picture3" className='picture-frame' >
                    <div className="picture-text">
                        <h2>Technique</h2>
                        <hr/>
                        <p>We touch the world, we learn from it, we create along with it. Audio Work is a hands-on affair.</p>
                    </div>
                     <img src={jaimeOsvaldo004} alt="Jaime Osvaldo in the workbench"/>
                </div>
            </div>
            
        </div>
    
    )

}

export default PictureRow;
