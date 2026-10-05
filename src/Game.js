import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import sounds from "./components/SoundEffects";

import Animatronic from "./components/Animatronic";
import Office from "./components/Office";
import Camera from "./components/Camera";
import Hud from "./components/Hud";

function Game({
  office,
  animatronics,
  isCameraOpen,
  truePower,
  blackout,
  gameOver,
  stages,
  endGame,
  onFoxyDoorBash,
  dispatch,
}) {
  useEffect(() => {
    sounds.playOfficeAmbience();
    return () => {
      sounds.stopOfficeAmbience();
    };
  }, []);

  useEffect(() => {
    if (gameOver || blackout) {
      sounds.stopOfficeAmbience();
    }
  }, [gameOver, blackout]);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || blackout) return;
      const key = e.key.toLowerCase();
      const code = e.code;

      // Space toggles Camera monitor up / down
      if (code === "Space") {
        e.preventDefault();
        sounds.playCameraToggle();
        dispatch({ type: "SET_IS_OPEN" });
        return;
      }

      // If camera monitor is up, door/light shortcuts shouldn't toggle
      if (isCameraOpen) return;

      // [A] or [Q] -> Left Door
      if (key === "a" || key === "q") {
        e.preventDefault();
        sounds.playDoor();
        dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "leftDoor" });
      }
      // [S] or [W] -> Left Light
      else if (key === "s" || key === "w") {
        e.preventDefault();
        sounds.playLight();
        if (!office.leftLight && animatronics.Bonnie && animatronics.Bonnie.door) {
          sounds.playWindowScare();
        }
        dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "leftLight" });
      }
      // [D] or [E] -> Right Door
      else if (key === "d" || key === "e") {
        e.preventDefault();
        sounds.playDoor();
        dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "rightDoor" });
      }
      // [F] or [R] -> Right Light
      else if (key === "f" || key === "r") {
        e.preventDefault();
        sounds.playLight();
        if (!office.rightLight && animatronics.Chica && animatronics.Chica.door) {
          sounds.playWindowScare();
        }
        dispatch({ type: "CHANGE_OFFICE_CONFIG", obj: "rightLight" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, blackout, isCameraOpen, office, animatronics, dispatch]);

  // Compute active usage bars:
  // Base 1 bar (fan) + 1 monitor + 1 leftDoor + 1 rightDoor + 1 leftLight + 1 rightLight
  useEffect(() => {
    let bars = 1;
    if (isCameraOpen) bars += 1;
    if (office.leftDoor) bars += 1;
    if (office.rightDoor) bars += 1;
    if (office.leftLight) bars += 1;
    if (office.rightLight) bars += 1;

    dispatch({ type: "SET_USAGE_BARS", bars });
  }, [
    isCameraOpen,
    office.leftDoor,
    office.rightDoor,
    office.leftLight,
    office.rightLight,
    dispatch,
  ]);

  const handleJumpscare = useCallback(
    (character) => {
      dispatch({ type: "FORCE_CAMERA_CLOSE" });
      dispatch({ type: "CHANGE_JUMPSCARE", animatronic: character });
    },
    [dispatch]
  );

  return (
    <>
      <Animatronic
        stages={stages}
        handleJumpscare={handleJumpscare}
        onFoxyDoorBash={onFoxyDoorBash}
      />

      {!gameOver && (
        <>
          {!blackout && <Hud />}
          <Camera />
          {!isCameraOpen && (
            <Office endGame={endGame} blackout={blackout} />
          )}
        </>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    office: state.officeReducer,
    animatronics: state.animatronicsReducer,
    isCameraOpen: state.cameraReducer.isCameraOpen,
    truePower: state.configReducer.truePower,
    blackout: state.configReducer.blackout,
  };
};

export default connect(mapStateToProps)(Game);
