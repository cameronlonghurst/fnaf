import React, { useState } from "react";
import styles from "./css/CustomNight.module.css";
import sounds from "./components/SoundEffects";

import FreddyImg from "./media/Textures/CustomNight/freddy.png";
import BonnieImg from "./media/Textures/CustomNight/bonnie.png";
import ChicaImg from "./media/Textures/CustomNight/chica.png";
import FoxyImg from "./media/Textures/CustomNight/foxy.png";
import GoldenFreddyImg from "./media/Textures/golden_freddy.webp";

const images = {
  Freddy: FreddyImg,
  Bonnie: BonnieImg,
  Chica: ChicaImg,
  Foxy: FoxyImg,
};

const AnimatronicCard = ({ character, range, onChange }) => {
  return (
    <div className={styles.animatronic}>
      <img
        src={images[character]}
        title={character}
        alt={character}
        style={{ width: "120px", height: "120px", objectFit: "contain" }}
      />
      <div style={{ color: "#fff", fontWeight: "bold", fontSize: "18px", margin: "4px 0" }}>
        {character}
      </div>
      <div className={styles.range_buttons}>
        <button
          onClick={() => onChange(character, -1)}
          disabled={range <= 0}
          style={{ cursor: range <= 0 ? "not-allowed" : "pointer" }}
        >
          &lt;
        </button>
        <span style={{ fontSize: "24px", minWidth: "36px", textAlign: "center" }}>
          {range}
        </span>
        <button
          onClick={() => onChange(character, +1)}
          disabled={range >= 20}
          style={{ cursor: range >= 20 ? "not-allowed" : "pointer" }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

const CustomNight = ({ state, onStartGame, onBackToMenu }) => {
  const [goldenFreddyKill, setGoldenFreddyKill] = useState(false);

  const changeRange = (character, delta) => {
    sounds.playCameraSwitch();
    state.setStages((prev) => {
      const current = prev[character] || 0;
      const nextVal = Math.max(0, Math.min(20, current + delta));
      return {
        ...prev,
        mode: "CUSTOM",
        [character]: nextVal,
      };
    });
  };

  const applyPreset = (f, b, c, fx, name) => {
    sounds.playCameraSwitch();
    state.setStages({
      Freddy: f,
      Bonnie: b,
      Chica: c,
      Foxy: fx,
      mode: "CUSTOM",
      night: "CUSTOM",
      presetName: name,
    });
  };

  const handleReady = () => {
    sounds.playCameraSwitch();
    // 1/9/8/7 Golden Freddy Easter Egg check
    if (
      state.ranges.Freddy === 1 &&
      state.ranges.Bonnie === 9 &&
      state.ranges.Chica === 8 &&
      state.ranges.Foxy === 7
    ) {
      sounds.playGoldenFreddy();
      setGoldenFreddyKill(true);
      setTimeout(() => {
        setGoldenFreddyKill(false);
        onBackToMenu();
      }, 4000);
      return;
    }

    onStartGame();
  };

  if (goldenFreddyKill) {
    return (
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
          alt="Golden Freddy"
          src={GoldenFreddyImg}
          style={{
            maxWidth: "95vw",
            maxHeight: "95vh",
            objectFit: "contain",
            animation: "glitch 0.1s infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.custom_night_container}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={onBackToMenu}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid #666",
            color: "#fff",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          &lt;&lt; BACK TO MENU
        </button>

        <h1
          style={{
            fontSize: "36px",
            letterSpacing: "3px",
            color: "#fff",
            margin: 0,
            textShadow: "0 0 10px rgba(255,255,255,0.4)",
          }}
        >
          CUSTOM NIGHT (7th Night)
        </h1>
        <div style={{ width: "120px" }} />
      </div>

      {/* 4 Animatronics AI setting */}
      <div className={styles.animatronics_container} style={{ margin: "24px auto" }}>
        <AnimatronicCard
          character="Freddy"
          range={state.ranges.Freddy}
          onChange={changeRange}
        />
        <AnimatronicCard
          character="Bonnie"
          range={state.ranges.Bonnie}
          onChange={changeRange}
        />
        <AnimatronicCard
          character="Chica"
          range={state.ranges.Chica}
          onChange={changeRange}
        />
        <AnimatronicCard
          character="Foxy"
          range={state.ranges.Foxy}
          onChange={changeRange}
        />
      </div>

      {/* READY Button */}
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <button
          onClick={handleReady}
          className={styles.ready_button}
          style={{
            fontSize: "32px",
            padding: "12px 48px",
            letterSpacing: "4px",
            background: "#166534",
            color: "#fff",
            border: "2px solid #22c55e",
            borderRadius: "4px",
            cursor: "pointer",
            textShadow: "0 0 8px #22c55e",
          }}
        >
          READY &gt;&gt;
        </button>
      </div>

      {/* Presets */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          margin: "12px 0",
        }}
      >
        <button
          onClick={() => applyPreset(20, 20, 20, 20, "4/20")}
          style={{
            background: "#7f1d1d",
            color: "#fee2e2",
            border: "1px solid #ef4444",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          4/20 MODE (MAX)
        </button>
        <button
          onClick={() => applyPreset(10, 10, 10, 10, "NORMAL")}
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            border: "1px solid #888",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ALL 10 (NORMAL)
        </button>
        <button
          onClick={() => applyPreset(5, 5, 5, 5, "EASY")}
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            border: "1px solid #888",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ALL 5 (EASY)
        </button>
        <button
          onClick={() => applyPreset(0, 0, 0, 0, "ZERO")}
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            border: "1px solid #888",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ALL 0 (EXPLORE)
        </button>
      </div>

      <footer className={styles.footer} style={{ marginTop: "24px" }}>
        <p style={{ color: "#777", fontSize: "12px" }}>
          Tip: Set AI levels 0–20. Higher AI values increase movement opportunity frequency.
        </p>
      </footer>
    </div>
  );
};

export default CustomNight;
