import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import sounds from "./SoundEffects";

// Office textures
import Default from "../media/Textures/Office/Default.webp";
import LD from "../media/Textures/Office/LD.webp";
import RD from "../media/Textures/Office/RD.webp";
import RD_LD from "../media/Textures/Office/RD_LD.webp";
import LD_RL from "../media/Textures/Office/LD_RL.webp";
import RD_LL from "../media/Textures/Office/RD_LL.webp";
import RD_LL_BONNIE from "../media/Textures/Office/RD_LL_BONNIE.webp";
import LD_RL_CHICA from "../media/Textures/Office/LD_RL_CHICA.webp";
import RL from "../media/Textures/Office/RL.webp";
import RL_LL_BONNIE from "../media/Textures/Office/RL_LL_BONNIE.webp";
import LL from "../media/Textures/Office/LL.webp";
import LL_BONNIE from "../media/Textures/Office/LL_BONNIE.webp";
import RL_LL from "../media/Textures/Office/RL_LL.webp";
import RL_CHICA from "../media/Textures/Office/RL_CHICA.webp";
import RL_LL_CHICA from "../media/Textures/Office/RL_LL_CHICA.webp";
import RL_LL_BONNIE_CHICA from "../media/Textures/Office/RL_LL_BONNIE_CHICA.webp";

// Blackout textures
import Blackout304 from "../media/Textures/Office/304.webp";
import Blackout305 from "../media/Textures/Office/305.webp";
import BlackImg from "../media/Textures/black.jpg";

// Jumpscare textures
import BonnieJumpscare from "../media/Textures/Bonnie-Jumpscare.webp";
import ChicaJumpscare from "../media/Textures/Chica-Jumpscare.webp";
import FreddyJumpscareGif from "../media/Textures/Freddy-Jumpscare1.gif";
import FoxyJumpscareGif from "../media/Textures/Foxy-Jumpscare.gif";
import GoldenFreddyImg from "../media/Textures/golden_freddy.webp";

function getOfficeTexture(leftDoor, rightDoor, leftLight, rightLight, bonnieDoor, chicaDoor) {
  if (leftDoor && rightDoor) {
    return RD_LD;
  }
  if (leftDoor && !rightDoor) {
    if (rightLight) {
      return chicaDoor ? LD_RL_CHICA : LD_RL;
    }
    return LD;
  }
  if (rightDoor && !leftDoor) {
    if (leftLight) {
      return bonnieDoor ? RD_LL_BONNIE : RD_LL;
    }
    return RD;
  }
  if (leftLight && rightLight) {
    if (bonnieDoor && chicaDoor) return RL_LL_BONNIE_CHICA;
    if (bonnieDoor) return RL_LL_BONNIE;
    if (chicaDoor) return RL_LL_CHICA;
    return RL_LL;
  }
  if (leftLight) {
    return bonnieDoor ? LL_BONNIE : LL;
  }
  if (rightLight) {
    return chicaDoor ? RL_CHICA : RL;
  }
  return Default;
}

function Office({
  blackout,
  officeConfig,
  animatronics,
  jammedDoors = {},
  isCameraOpen,
  jumpscare,
  endGame,
  dispatch,
}) {
  const [blackoutFrame, setBlackoutFrame] = useState(0);
  const [activeJumpscare, setActiveJumpscare] = useState(null);

  const containerRef = useRef(null);
  const targetPanRef = useRef(-12.5); // Target percentage (between 0% and -25%)
  const currentPanRef = useRef(-12.5);
  const animFrameRef = useRef(null);
  const goldenTimerRef = useRef(null);

  const { leftDoor, rightDoor, leftLight, rightLight } = officeConfig;
  const bonnieDoor = animatronics.Bonnie && animatronics.Bonnie.door;
  const chicaDoor = animatronics.Chica && animatronics.Chica.door;

  // Determine current office texture
  const currentBackground = getOfficeTexture(
    leftDoor,
    rightDoor,
    leftLight,
    rightLight,
    bonnieDoor,
    chicaDoor
  );

  // Smooth panning loop via requestAnimationFrame (no React state updates during pan!)
  useEffect(() => {
    const loop = () => {
      // Lerp pan towards target
      const diff = targetPanRef.current - currentPanRef.current;
      if (Math.abs(diff) > 0.05) {
        currentPanRef.current += diff * 0.12;
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(${currentPanRef.current}%)`;
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Mouse pan listener
  const handleMouseMove = (e) => {
    if (blackout || activeJumpscare) return;
    const w = window.innerWidth;
    const x = e.clientX;

    // Left zone: pan to left wall (0%)
    if (x < w * 0.35) {
      targetPanRef.current = 0;
    }
    // Right zone: pan to right wall (-25%)
    else if (x > w * 0.65) {
      targetPanRef.current = -25;
    }
    // Center zone: pan to center desk (-12.5%)
    else {
      targetPanRef.current = -12.5;
    }
  };

  // Door click handlers (both wall button and doorway)
  const handleLeftDoorToggle = (e) => {
    if (e) e.stopPropagation();
    if (jammedDoors.left) {
      sounds.playButtonError();
      return;
    }
    sounds.playDoor();
    dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "leftDoor" });
  };

  const handleLeftLightToggle = (e) => {
    if (e) e.stopPropagation();
    if (jammedDoors.left) {
      sounds.playButtonError();
      return;
    }
    sounds.playLight();
    if (!leftLight && bonnieDoor) {
      sounds.playWindowScare();
    }
    dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "leftLight" });
  };

  const handleRightDoorToggle = (e) => {
    if (e) e.stopPropagation();
    if (jammedDoors.right) {
      sounds.playButtonError();
      return;
    }
    sounds.playDoor();
    dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "rightDoor" });
  };

  const handleRightLightToggle = (e) => {
    if (e) e.stopPropagation();
    if (jammedDoors.right) {
      sounds.playButtonError();
      return;
    }
    sounds.playLight();
    if (!rightLight && chicaDoor) {
      sounds.playWindowScare();
    }
    dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "rightLight" });
  };

  const handleNoseClick = (e) => {
    if (e) e.stopPropagation();
    sounds.playHonk();
  };

  // Jumpscare trigger
  useEffect(() => {
    if (jumpscare && !activeJumpscare) {
      setActiveJumpscare(jumpscare);
      sounds.playJumpscare();
      dispatch({ type: "CHANGE_CAMERA_BUTTON" });
      setTimeout(() => {
        endGame(false);
      }, 3500);
    }
  }, [jumpscare, activeJumpscare, dispatch, endGame]);

  // Golden Freddy trigger
  useEffect(() => {
    if (animatronics.GoldenFreddy && animatronics.GoldenFreddy.active) {
      if (!isCameraOpen) {
        goldenTimerRef.current = setTimeout(() => {
          sounds.playGoldenFreddy();
          setActiveJumpscare("GoldenFreddy");
          setTimeout(() => {
            endGame(false);
          }, 3000);
        }, 2500);
      } else {
        if (goldenTimerRef.current) clearTimeout(goldenTimerRef.current);
        dispatch({
          type: "SET_GOLDEN_FREDDY",
          content: { active: false, jumpscare: false },
        });
      }
    }
    return () => {
      if (goldenTimerRef.current) clearTimeout(goldenTimerRef.current);
    };
  }, [animatronics.GoldenFreddy, isCameraOpen, dispatch, endGame]);

  // Blackout sequence
  useEffect(() => {
    if (!blackout) return;

    sounds.stopOfficeAmbience();
    sounds.playPowerdown();

    const toreadorTimer = setTimeout(() => {
      sounds.playMusicBox();

      const flashInterval = setInterval(() => {
        setBlackoutFrame((f) => (f === 1 ? 2 : 1));
      }, 250);

      const endMusicTimer = setTimeout(() => {
        clearInterval(flashInterval);
        sounds.stopMusicBox();
        setBlackoutFrame(0);

        setTimeout(() => {
          sounds.playJumpscare();
          setActiveJumpscare("Freddy");
          setTimeout(() => {
            endGame(false);
          }, 3500);
        }, 2500);
      }, 10000);

      return () => {
        clearInterval(flashInterval);
        clearTimeout(endMusicTimer);
      };
    }, 4000);

    return () => clearTimeout(toreadorTimer);
  }, [blackout, endGame]);

  // Render jumpscare
  if (activeJumpscare) {
    let scareImg = FreddyJumpscareGif;
    if (activeJumpscare === "Bonnie") scareImg = BonnieJumpscare;
    else if (activeJumpscare === "Chica") scareImg = ChicaJumpscare;
    else if (activeJumpscare === "Foxy") scareImg = FoxyJumpscareGif;
    else if (activeJumpscare === "GoldenFreddy") scareImg = GoldenFreddyImg;

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
        }}
      >
        <img
          alt="Jumpscare"
          src={scareImg}
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
        />
      </div>
    );
  }

  // Render blackout
  if (blackout) {
    let blackoutSrc = BlackImg;
    if (blackoutFrame === 1) blackoutSrc = Blackout304;
    else if (blackoutFrame === 2) blackoutSrc = Blackout305;

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 40,
        }}
      >
        <img
          alt="Blackout"
          src={blackoutSrc}
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
        cursor: "default",
      }}
    >
      {/* Panning Office Container (width = 125vw, smoothly slides between 0% and -25%) */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "125vw",
          height: "100vh",
          transform: "translateX(-12.5%)",
          userSelect: "none",
        }}
      >
        {/* Office Background Image */}
        <img
          alt="Office"
          draggable="false"
          src={currentBackground}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* Golden Freddy Sitting in Office if Active */}
        {animatronics.GoldenFreddy && animatronics.GoldenFreddy.active && (
          <img
            alt="Golden Freddy"
            src={GoldenFreddyImg}
            style={{
              position: "absolute",
              bottom: "10%",
              left: "38%",
              width: "25%",
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
        )}

        {/* ======================================================== */}
        {/* LEFT DOOR CLICK AREAS (Wall Button + Doorway)            */}
        {/* 100% Invisible, zero background, zero border             */}
        {/* ======================================================== */}

        {/* Left Door Button (Wall Panel) */}
        <div
          onClick={handleLeftDoorToggle}
          title="Left Door (Button)"
          style={{
            position: "absolute",
            left: "0.8%",
            top: "45.0%",
            width: "4.2%",
            height: "10.5%",
            zIndex: 6,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* Left Door Area (The actual door opening) */}
        <div
          onClick={handleLeftDoorToggle}
          title="Left Door (Doorway)"
          style={{
            position: "absolute",
            left: "5.0%",
            top: "10.0%",
            width: "18.0%",
            height: "48.0%",
            zIndex: 5,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* ======================================================== */}
        {/* LEFT LIGHT CLICK AREAS (Wall Button + Hallway Light)     */}
        {/* 100% Invisible, zero background, zero border             */}
        {/* ======================================================== */}

        {/* Left Light Button (Wall Panel) */}
        <div
          onClick={handleLeftLightToggle}
          title="Left Light (Button)"
          style={{
            position: "absolute",
            left: "0.8%",
            top: "57.0%",
            width: "4.2%",
            height: "10.5%",
            zIndex: 6,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* Left Light / Hallway Area */}
        <div
          onClick={handleLeftLightToggle}
          title="Left Light (Hallway)"
          style={{
            position: "absolute",
            left: "5.0%",
            top: "58.0%",
            width: "18.0%",
            height: "38.0%",
            zIndex: 5,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* ======================================================== */}
        {/* FREDDY CELEBRATE POSTER NOSE                             */}
        {/* ======================================================== */}
        <div
          onClick={handleNoseClick}
          title="Celebrate! (Click Nose)"
          style={{
            position: "absolute",
            left: "48.0%",
            top: "32.5%",
            width: "2.2%",
            height: "3.2%",
            zIndex: 6,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* ======================================================== */}
        {/* RIGHT DOOR CLICK AREAS (Wall Button + Doorway)           */}
        {/* 100% Invisible, zero background, zero border             */}
        {/* ======================================================== */}

        {/* Right Door Button (Wall Panel) */}
        <div
          onClick={handleRightDoorToggle}
          title="Right Door (Button)"
          style={{
            position: "absolute",
            left: "95.0%",
            top: "45.0%",
            width: "4.2%",
            height: "10.5%",
            zIndex: 6,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* Right Door Area (The actual door opening) */}
        <div
          onClick={handleRightDoorToggle}
          title="Right Door (Doorway)"
          style={{
            position: "absolute",
            left: "77.0%",
            top: "10.0%",
            width: "18.0%",
            height: "48.0%",
            zIndex: 5,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* ======================================================== */}
        {/* RIGHT LIGHT CLICK AREAS (Wall Button + Window Light)     */}
        {/* 100% Invisible, zero background, zero border             */}
        {/* ======================================================== */}

        {/* Right Light Button (Wall Panel) */}
        <div
          onClick={handleRightLightToggle}
          title="Right Light (Button)"
          style={{
            position: "absolute",
            left: "95.0%",
            top: "57.0%",
            width: "4.2%",
            height: "10.5%",
            zIndex: 6,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />

        {/* Right Light / Window Area */}
        <div
          onClick={handleRightLightToggle}
          title="Right Light (Window)"
          style={{
            position: "absolute",
            left: "77.0%",
            top: "58.0%",
            width: "18.0%",
            height: "38.0%",
            zIndex: 5,
            cursor: "pointer",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    officeConfig: state.officeReducer,
    animatronics: state.animatronicsReducer,
    isCameraOpen: state.cameraReducer.isCameraOpen,
    jumpscare: state.configReducer.jumpscare,
    jammedDoors: state.configReducer.jammedDoors || {},
  };
};

export default connect(mapStateToProps)(Office);
