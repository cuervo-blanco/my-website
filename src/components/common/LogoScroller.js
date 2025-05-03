import React,  { useRef, useState, useEffect }  from 'react';
import AESLogo from '../../assets/img/AESLogo.png';
import ArdourLogo from '../../assets/img/ArdourLogo.png';
import AuditionLogo from '../../assets/img/AuditionLogo.png';
import DanteLogo from '../../assets/img/DanteLogo.png';
import FModLogo from '../../assets/img/FmodLogo.png';
import izotopeLogo from '../../assets/img/izotopeLogo.png';
import LogicProLogo from '../../assets/img/LogicProLogo.png';
import OshaLogo from '../../assets/img/OshaLogo.png';
import ProToolsLogo from '../../assets/img/ProToolsLogo.png';
import ReaperLogo from '../../assets/img/ReaperLogo.png';
import UnityLogo from '../../assets/img/UnityLogo.png';
import PureDataLogo from '../../assets/img/PureDataLogo.png';
import QSysLogo from '../../assets/img/Q-Sys-Logo.png';
import WwiseLogo from '../../assets/img/WwiseLogo.png';
import WavesLogo from '../../assets/img/WavesLogo.png';
import QLabLogo from '../../assets/img/QLabLogo.png';
import RXLogo from '../../assets/img/RXLogo.png';
import RTSLogo from '../../assets/img/RTSLogo.png';


function LogoScroller(props){

    const [rotation, setRotation] = useState(0);
    const triangleRef = useRef(null);
    const [color, setColor] = useState("grey"); // default color

    const handleMouseMove = (e) => {
        if (triangleRef.current) {
            const triangleRect = triangleRef.current.getBoundingClientRect();
            const triangleCenterX = triangleRect.left + triangleRect.width / 2;
            const triangleCenterY = triangleRect.top + triangleRect.height / 2;

            const radians = Math.atan2(e.clientY - triangleCenterY, e.clientX - triangleCenterX);
            const degrees = radians * (180 / Math.PI) + 90;  // +90 to start from top of triangle

            setRotation(degrees);
        }
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);

        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);  // The empty dependency array ensures the effect runs only on mount and unmount

    const handleMouseEnter = (e) => {
        const logoType = e.target.getAttribute("data-logo-type");
        switch(logoType) {
            case "type1":
                setColor("green");
                break;
            case "type2":
                setColor("orange");
                break;
            case "type3":
                setColor("blue");
                break;
            default:
                setColor("grey"); // or any default color
        }
    };


    return(
        <div id="LogoScroller">

            {/*Three Colour Arrow*/}
            <div className="triangle" ref={triangleRef}
            style={{ transform: `rotate(${rotation}deg)`,  borderBottomColor: color }}></div>

            {/*Logo Container*/}
            <div id="logo-container">

                {/*First Logo Group*/}
                <div id="FirstLogoGroup" className="logo-group">
                    <div className="row-group">
                        <div className="logo" data-logo-type="type1"
                        onMouseEnter={handleMouseEnter}>

                            <img src={LogicProLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type1"
                        onMouseEnter={handleMouseEnter}>
                            <img src={ProToolsLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type1"
                        onMouseEnter={handleMouseEnter}>
                            <img src={RXLogo} alt="logo" />
                        </div>
                    </div>
                    <div className="row-group">
                        <div className="logo" data-logo-type="type1"
                        onMouseEnter={handleMouseEnter}>
                            <img src={izotopeLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type2"
                        onMouseEnter={handleMouseEnter}>
                            <img src={WwiseLogo} alt="logo" />
                        </div>
                    </div>
                </div>

                {/*Column Logo Groups*/}
                <div id="ColumnLogoGroup">

                    {/*Second Logo Group*/}
                    <div id="SecondLogoGroup" className="logo-group">
                        <div className="logo" data-logo-type="type1"
                    onMouseEnter={handleMouseEnter}
                   >
                            <img src={ArdourLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type1"
                    onMouseEnter={handleMouseEnter}
                   >
                            <img src={ReaperLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type1"
                    onMouseEnter={handleMouseEnter}
                    >
                            <img src={AuditionLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type1"
                    onMouseEnter={handleMouseEnter}
                    >
                            <img src={WavesLogo} alt="logo" />
                        </div>
                    </div>
                

                    {/*Third Logo Group*/}
                    <div id="ThirdLogoGroup" className="logo-group">
                        <div className="logo" data-logo-type="type2"
                    onMouseEnter={handleMouseEnter}
                    >
                            <img src={FModLogo} alt="logo"/>
                        </div>
                        <div className="logo" data-logo-type="type2"
                    onMouseEnter={handleMouseEnter}
                    >
                            <img src={UnityLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type2"
                    onMouseEnter={handleMouseEnter}
                    >
                            <img src={PureDataLogo} alt="logo" />
                        </div>
                        <div className="logo" data-logo-type="type2"
                    onMouseEnter={handleMouseEnter}
                    >
                            <img src={QLabLogo} alt="logo" />
                        </div>
                    </div>

                </div>

                {/*Fourth Logo Group*/}
                <div id="FourthLogoGroup"  className="logo-group">
                <div className="row-group">
                    <div className="logo" data-logo-type="type3"
                    onMouseEnter={handleMouseEnter}
                    >
                        <img src={DanteLogo} alt="logo" />
                    </div>
                    <div className="logo" data-logo-type="type3"
                    onMouseEnter={handleMouseEnter}
                    >
                        <img src={QSysLogo} alt="logo" />
                    </div>
                    <div className="logo" data-logo-type="type3"
                    onMouseEnter={handleMouseEnter}
                    >
                        <img src={RTSLogo} alt="logo" />
                    </div>
                    </div>
                    <div className="row-group">
                    <div className="logo" data-logo-type="type3"
                    onMouseEnter={handleMouseEnter}
                    >
                        <img src={AESLogo} alt="logo" />
                    </div>
                    <div className="logo" data-logo-type="type3"
                    onMouseEnter={handleMouseEnter}
                    >
                        <img src={OshaLogo} alt="logo" />
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LogoScroller;
