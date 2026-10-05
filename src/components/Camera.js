import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import getCam from "./Images";
import sounds from "./SoundEffects";

import Static from "../media/Textures/Static-Cam.webp";
import Black from "../media/Textures/black.jpg";
import FoxyHallwayImg from "../media/Textures/Foxy-Hallway.webp";
import Media from "./Media";

import CameraMap from "../components/CameraMap";
import CameraButton from "../components/CameraButton";

const CAMERA_NAMES = {
  Stage: "CAM 1A - Show Stage",
  "Dinning Area": "CAM 1B - Dining Area",
  "Pirate Cove": "CAM 1C - Pirate Cove",
  "West Hall": "CAM 2A - West Hall",
  "W. Hall Corner": "CAM 2B - W. Hall Corner",
  "Supply Closet": "CAM 3 - Supply Closet",
  "East Hall": "CAM 4A - East Hall",
  "E. Hall Corner": "CAM 4B - E. Hall Corner",
  Backstage: "CAM 5 - Backstage",
  Kitchen: "CAM 6 - Kitchen",
  Restrooms: "CAM 7 - Restrooms",
};

function Camera({
  animatronics,
  areAnimatronicsMoving,
  isCameraOpen,
  camera,
  cameraButtonDisappear,
  foxyHallwayRunning,
  dispatch,
}) {
  const [image, setImage] = useState(Media.Images.Stage);
  const [recBlink, setRecBlink] = useState(true);

  // Monitor toggle
  const handleCameraButton = () => {
    sounds.playCameraToggle();
    dispatch({ type: "SET_IS_OPEN" });
  };

  // Camera selection
  const handleCameraChange = (e) => {
    e.preventDefault();
    const cam = e.target.title;
    if (cam) {
      sounds.playCameraSwitch();
      dispatch({ type: "CHANGE_CAMERA", content: cam });
    }
  };

  // REC dot blink interval
  useEffect(() => {
    const blink = setInterval(() => {
      setRecBlink((b) => !b);
    }, 700);
    return () => clearInterval(blink);
  }, []);

  // Update camera image based on animatronic positions
  useEffect(() => {
    const { Bonnie, Chica, Freddy, Foxy } = animatronics;

    // Check if viewing CAM 2A while Foxy is sprinting
    if (camera === "West Hall" && foxyHallwayRunning) {
      setImage(FoxyHallwayImg);
      return;
    }

    let result = "";
    if (Bonnie && Bonnie.camera === camera) result += "_b";
    if (Chica && Chica.camera === camera) result += "_c";
    if (Freddy && Freddy.camera === camera) result += "_f";

    const foxyCam = Foxy ? Foxy.camera : "";
    const newCamera = getCam(result, camera, foxyCam);
    setImage(newCamera || Black);
  }, [camera, animatronics, areAnimatronicsMoving, foxyHallwayRunning]);

  return (
    <div>
      {/* Bottom monitor hover button */}
      {!cameraButtonDisappear && (
        <CameraButton handleCameraButton={handleCameraButton} />
      )}

      {/* Camera Monitor Overlay */}
      {isCameraOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            zIndex: 8,
            overflow: "hidden",
            fontFamily: "'Courier New', Courier, monospace",
            userSelect: "none",
          }}
        >
          {/* Active Camera View */}
          {areAnimatronicsMoving ? (
            <div
              style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                alt="Static distortion"
                src={Static}
                style={{ width: "100vw", height: "100vh", opacity: 0.85 }}
              />
            </div>
          ) : (
            <img
              src={image}
              alt={camera}
              style={{
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          )}

          {/* Kitchen Audio Only message */}
          {camera === "Kitchen" && !areAnimatronicsMoving && (
            <div
              style={{
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#ff4444",
                textAlign: "center",
                zIndex: 11,
                fontSize: "20px",
                fontWeight: "bold",
                letterSpacing: "2px",
                textShadow: "0 0 10px rgba(255,0,0,0.8)",
              }}
            >
              - CAMERA DISABLED -<br />
              <span style={{ fontSize: "16px", color: "#ffffff" }}>AUDIO ONLY</span>
            </div>
          )}

          {/* Top Left: Camera Name & REC indicator */}
          <div
            style={{
              position: "absolute",
              top: "24px",
              left: "30px",
              zIndex: 12,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Blinking Red Dot */}
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: recBlink ? "#ff0000" : "transparent",
                boxShadow: recBlink ? "0 0 10px #ff0000" : "none",
              }}
            />
            <span
              style={{
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: "bold",
                letterSpacing: "1px",
                textShadow: "1px 1px 4px #000",
              }}
            >
              {CAMERA_NAMES[camera] || camera}
            </span>
          </div>

          {/* Camera Map on bottom-right */}
          <CameraMap handleCameraChange={handleCameraChange} />

          {/* CRT scanlines & static noise overlay */}
          <div className="crt-lines" />
          <img
            alt="Camera static noise"
            src={Static}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              opacity: 0.18,
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    animatronics: state.animatronicsReducer,
    camera: state.cameraReducer.camera,
    isCameraOpen: state.cameraReducer.isCameraOpen,
    areAnimatronicsMoving: state.cameraReducer.areAnimatronicsMoving,
    foxyHallwayRunning: state.cameraReducer.foxyHallwayRunning,
    cameraButtonDisappear: state.configReducer.cameraButtonDisappear,
  };
};

export default connect(mapStateToProps)(Camera);
