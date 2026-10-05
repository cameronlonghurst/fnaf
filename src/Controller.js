import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Game from "./Game";
import sounds from "./components/SoundEffects";
import VictoryScreen from "./components/VictoryScreen";

import StaticImage from "./media/Textures/Static-Cam.webp";

function Controller({
  hour,
  truePower,
  usageBars,
  blackout,
  jumpscare,
  dispatch,
  stages,
  onGameEnd,
}) {
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  const nightNumber = typeof stages.night === "number" ? stages.night : 1;
  const isCustom = stages.mode === "CUSTOM";

  // Base drain rates per spec (% / s):
  // Night 1: 0.100%
  // Night 2: 0.111%
  // Night 3: 0.200%
  // Night 4: 0.250%
  // Night 5+: 0.333%
  const getBaseDrainPerSec = (night) => {
    if (night === 1) return 0.10;
    if (night === 2) return 0.111;
    if (night === 3) return 0.20;
    if (night === 4) return 0.25;
    return 0.333; // Night 5, 6, Custom
  };

  // Extra periodic drain intervals per spec (in seconds):
  // Night 2: every 6s (0.1% = 1 truePower)
  // Night 3: every 5s
  // Night 4: every 4s
  // Night 5+: every 3s
  const getExtraDrainInterval = (night) => {
    if (night === 1) return null;
    if (night === 2) return 6000;
    if (night === 3) return 5000;
    if (night === 4) return 4000;
    return 3000; // Night 5, 6, Custom
  };

  const baseDrainRate = getBaseDrainPerSec(nightNumber);
  const extraDrainInterval = getExtraDrainInterval(nightNumber);

  const truePowerRef = useRef(999);
  const gameOverRef = useRef(false);
  const victoryRef = useRef(false);

  useEffect(() => {
    truePowerRef.current = 999;
    dispatch({ type: "SET_POWER", truePower: 999 });
  }, [dispatch]);

  // ==========================================
  // POWER SYSTEM LOOP (Delta Time update at 30-60 FPS)
  // ==========================================
  useEffect(() => {
    let lastTime = performance.now();

    const powerInterval = setInterval(() => {
      if (gameOverRef.current || victoryRef.current || truePowerRef.current <= 0) {
        return;
      }

      const now = performance.now();
      const deltaTime = (now - lastTime) / 1000; // seconds
      lastTime = now;

      // drainPerSec = baseDrainPerSec * usageBars
      // In tenths of a percent: drain = drainPerSec * 10
      const drainPerSec = baseDrainRate * (usageBars || 1);
      const drainedTruePower = drainPerSec * 10 * deltaTime;

      truePowerRef.current = Math.max(0, truePowerRef.current - drainedTruePower);
      dispatch({ type: "SET_POWER", truePower: truePowerRef.current });

      if (truePowerRef.current <= 0) {
        dispatch({ type: "FORCE_DOORS_OPEN" });
        dispatch({ type: "FORCE_CAMERA_CLOSE" });
        dispatch({ type: "CHANGE_CAMERA_BUTTON" });
      }
    }, 100);

    return () => clearInterval(powerInterval);
  }, [baseDrainRate, usageBars, dispatch]);

  // Extra periodic drain
  useEffect(() => {
    if (!extraDrainInterval) return;

    const extraInterval = setInterval(() => {
      if (gameOverRef.current || victoryRef.current || truePowerRef.current <= 0) {
        return;
      }
      // Drains an extra 0.1% (1 truePower)
      truePowerRef.current = Math.max(0, truePowerRef.current - 1);
      dispatch({ type: "SET_POWER", truePower: truePowerRef.current });
    }, extraDrainInterval);

    return () => clearInterval(extraInterval);
  }, [extraDrainInterval, dispatch]);

  // ==========================================
  // IN-GAME HOUR TIMING (12 AM: 90s, 1-5 AM: 89s each)
  // ==========================================
  useEffect(() => {
    if (gameOverRef.current || victoryRef.current) return;

    // 12 AM is 90 seconds, all subsequent hours are 89 seconds
    const hourDuration = hour === 0 ? 90000 : 89000;

    const timer = setTimeout(() => {
      if (gameOverRef.current || victoryRef.current) return;

      if (hour === 5) {
        // Reached 6 AM -> WIN!
        endGame(true);
      } else {
        dispatch({ type: "CHANGE_HOUR" });
      }
    }, hourDuration);

    return () => clearTimeout(timer);
  }, [hour, dispatch]);

  // Foxy door bash steal handler
  const handleFoxyDoorBash = (stealPercent) => {
    // Steals stealPercent * 10 truePower
    const stealAmount = stealPercent * 10;
    truePowerRef.current = Math.max(0, truePowerRef.current - stealAmount);
    dispatch({ type: "SET_POWER", truePower: truePowerRef.current });
  };

  const endGame = (hasWon) => {
    if (hasWon) {
      victoryRef.current = true;
      setVictory(true);
      sounds.stopOfficeAmbience();

      // Save victory in localStorage
      const victories = JSON.parse(localStorage.getItem("victories") || "{}");
      if (isCustom) {
        const is20Mode =
          stages.Freddy === 20 &&
          stages.Bonnie === 20 &&
          stages.Chica === 20 &&
          stages.Foxy === 20;
        if (is20Mode) victories["4/20"] = true;
        victories["CUSTOM"] = true;
      } else {
        victories[nightNumber] = true;
        // Unlock next night if beaten
        const currentSaved = parseInt(localStorage.getItem("savedNight") || "1", 10);
        if (nightNumber >= currentSaved && nightNumber < 6) {
          localStorage.setItem("savedNight", (nightNumber + 1).toString());
        }
      }
      localStorage.setItem("victories", JSON.stringify(victories));
    } else {
      gameOverRef.current = true;
      setGameOver(true);
      sounds.stopOfficeAmbience();
      sounds.playDead();

      dispatch({ type: "SET_GAME_OVER" });

      setTimeout(() => {
        onGameEnd(false);
      }, 6500);
    }
  };

  if (victory) {
    return (
      <VictoryScreen
        nightNumber={nightNumber}
        isCustom={isCustom}
        onContinue={() => onGameEnd(true)}
      />
    );
  }

  return (
    <>
      {gameOver ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          <img
            alt="Static Game Over"
            src={StaticImage}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              opacity: 0.85,
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 61,
              color: "#ff0000",
              fontSize: "64px",
              fontWeight: "900",
              letterSpacing: "8px",
              textShadow: "0 0 20px #ff0000, 2px 2px 4px #000",
              animation: "glitch 0.3s infinite",
            }}
          >
            GAME OVER
          </div>
        </div>
      ) : null}

      <Game
        stages={stages}
        gameOver={gameOver || victory}
        endGame={endGame}
        onFoxyDoorBash={handleFoxyDoorBash}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    hour: state.configReducer.hour,
    truePower: state.configReducer.truePower,
    usageBars: state.configReducer.usageBars,
    blackout: state.configReducer.blackout,
    jumpscare: state.configReducer.jumpscare,
  };
};

export default connect(mapStateToProps)(Controller);
