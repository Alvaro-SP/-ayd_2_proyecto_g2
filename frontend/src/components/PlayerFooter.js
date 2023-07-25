import { useEffect, useState } from "react";
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons
import "../styles/PlayerFooter.css"
import imagenRep from "../images/rep.gif"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [play, { pause, duration, sound }] = useSound("https://audioplayer.madza.dev/Madza-Persistence.mp3");
    const [currTime, setCurrTime] = useState({ min: "", sec: "", }); // current position of the audio in minutes and seconds
    const [seconds, setSeconds] = useState(); // current position of the audio in seconds

    const playingButton = () => {
        if (isPlaying) {
            pause(); // this will pause the audio
            setIsPlaying(false);
        } else {
            play(); // this will play the audio
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (sound) {
                setSeconds(sound.seek([])); // setting the seconds state with the current state
                const min = Math.floor(sound.seek([]) / 60);
                const sec = Math.floor(sound.seek([]) % 60);
                setCurrTime({
                    min,
                    sec,
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sound]);

    const copiarTexto = () => {
        const textoACopiar = 'Texto copiado al portapapeles';

        navigator.clipboard.writeText(textoACopiar)
            .then(() => {
                toast.success('Enlace de la canción copiado al portapapeles', { autoClose: 2000 });
            })
            .catch((error) => {
                console.error('Error al copiar al portapapeles: ', error);
                toast.error('Error al copiar al portapapeles: ', error, { autoClose: 2000 });
            });
    }

    const sec = duration / 1000;
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    const time = {
        min: min,
        sec: secRemain
    };

    return (
        <div className="player-container2">
            <div className="component2">
                <div className="cont-components2">
                    <table>
                        <tr>
                            <td style={{ width: '8%' }}>
                                <img className="musicCover2" src={imagenRep} />
                            </td>
                            <td style={{ width: '20%' }}>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ width: '50%' }}>
                                        <br />
                                        <h3 className="title2">Rubaiyyan</h3>
                                        <p className="subTitle2">Qala</p>
                                    </div>
                                    <div style={{ width: '1%' }}>
                                        <div className="icon2 enlace">
                                            <div className="tooltip2">Copiar</div>
                                            <span onClick={copiarTexto}><FontAwesomeIcon icon={faLink} /></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ alignItems: "center", width: '70%' }}>
                                <tr style={{ alignItems: "center", width: '100%' }}>
                                    <td style={{ width: '50%' }}></td>
                                    <td style={{ alignItems: "center", width: '30%' }}>
                                        <div className="row">
                                            <button className="playButton2 col">
                                                <IconContext.Provider value={{ size: "2em", color: "#F8EB25" }} >
                                                    <BiSkipPrevious />
                                                </IconContext.Provider>
                                            </button>
                                            {!isPlaying ? (
                                                <button className="playButton2 col" onClick={playingButton}>
                                                    <IconContext.Provider value={{ size: "2.2em", color: "#F8EB25" }}>
                                                        <AiFillPlayCircle />
                                                    </IconContext.Provider>
                                                </button>
                                            ) : (
                                                <button className="playButton2 col" onClick={playingButton}>
                                                    <IconContext.Provider value={{ size: "2.2em", color: "#F8EB25" }}>
                                                        <AiFillPauseCircle />
                                                    </IconContext.Provider>
                                                </button>
                                            )}
                                            <button className="playButton2 col">
                                                <IconContext.Provider value={{ size: "2em", color: "#F8EB25" }}>
                                                    <BiSkipNext />
                                                </IconContext.Provider>
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ width: '10%' }}></td>
                                </tr>

                                <div>

                                    <input
                                        type="range"
                                        min="0"
                                        max={duration / 1000}
                                        defaultValue="0"
                                        value={seconds}
                                        className="timeline2"
                                        onChange={(e) => {
                                            sound.seek([e.target.value]);
                                        }}
                                    />
                                    <div className="time2">
                                        <p>
                                            {currTime.min < 10 ? '0' : ''}{currTime.min}:{currTime.sec < 10 ? '0' : ''}{currTime.sec}
                                        </p>
                                        <p>
                                            {time.min < 10 ? '0' : ''}{time.min}:{time.sec < 10 ? '0' : ''}{time.sec}
                                        </p>
                                    </div>
                                </div>

                            </td>
                        </tr>
                    </table>


                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Player;
