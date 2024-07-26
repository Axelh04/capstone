import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page music-cursor">
      <div className="header">
        <img id="waveTop" alt="wave" src="/sineWave.png"></img>

        <h1 id="welcome-text">Welcome to</h1>
        <h1 id="title-text">Vocally</h1>
        <img id="mic" alt="mic" src="/mic.webp"></img>
        <div id="bottom-header-gray-box"></div>
        <Link to="/login">
          <p id="login-button" className="mic-cursor">
            Login
          </p>
        </Link>

        <Link to="/signup">
          <p id="signup-button" className="mic2-cursor">
            Sign Up
          </p>
        </Link>
      </div>

      <div id="description-container" className="voice-cursor">
        <h1 id="desc-text1">
          Your <span id="voice-text">Voice</span>
        </h1>
        <h1 id="desc-text2">is the Greatest</h1>
        <h1 id="desc-text3"> Instrument.</h1>
        <img id="waveBottom" alt="wave" src="/sineWave.png"></img>
        <h1 id="desc-text4">...Use It.</h1>
      </div>

      <div id="about-container" className="mic2-cursor">
        <img id="shure-mic" alt="shure-mic" src="/shure-mi.avif"></img>

        <h1 id="about-title">About Vocally</h1>
        <p id="about-desc">
          Vocally is crafted just for <span className="highlighter">YOU</span>
          —an innovative web application designed to turn your{" "}
          <span className="highlighter">VOICE</span> into and
          <span className="highlighter">INSTRUMENT</span> . Built with precision
          and user-friendliness at its core, Vocally empowers musicians,
          vocalists, and music enthusiasts to explore and create music{" "}
          <span className="highlighter">WITHOUT</span> the need for expensive
          instruments or studio equipment.
        </p>

        <h1 id="tutorial-title">How to use Vocally</h1>
        <p id="recording-desc">
          Start by making your first recording. Clicking on the microphone
          button will start the recording below. Sing the vocal notes you want
          to turn into an instrument sound. Perform a small break in your voice
          each time you want to sing a different note. All recordings are
          limited to 10 seconds.
        </p>
        <img id="recording-img" src="/recording-img.png"></img>
        <img id="recording-ui-img" src="/recording-ui-img.png"></img>

        <p id="recording-wheel-desc">
          All of your recordings will show up on the recording wheel. You can
          select which recording to edit by scrolling through your recordings.
          The wheel will automatically recognize the highlighted recording,
          which will also show up as the biggest one.
        </p>
        <img id="recording-wheel-img" src="/recording-wheel-img.png"></img>
        <img id="recording-wheel-img2" src="/recording-wheel-img2.png"></img>

        <p id="instrument-list-desc">
          There are over 1000 instruments to choose from. Convert your vocal
          notes into any one of them. Click on the instrument you want, and it
          will be highlighted in orange for you to identify. Selecting an
          instrument is required before converting your voice.
        </p>
        <img id="instrument-list-img" src="/instruments-img.png"></img>
        <img
          id="selected-instrument-img"
          src="/selected-instrument-img.png"
        ></img>

        <p id="playback-instrument-desc">
          Double check the instrument selected is the same one that will appear
          below.
        </p>

        <p id="playback-buttons-desc">
          Click on the play button below to play your sound. The sound will
          automatically loop, until you click the stop button above the play
          button.
        </p>

        <p id="playback-similarsounds-desc">
          Click on the Get Similar Sounds button, to listen to similar sounds
          based on the duration or note of your recording.
        </p>
        <img
          id="playback-container-img"
          src="/playback-container-img.png"
        ></img>
        <div id="bottom-page-gray-box">
          <h1 id="last-chance-text">Now give it a try...</h1>
          <Link to="/login">
            <p id="bottom-login-button" className="mic-cursor">
              Login
            </p>
          </Link>

          <Link to="/signup">
            <p id="bottom-signup-button" className="mic2-cursor">
              Sign Up
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
