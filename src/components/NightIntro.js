import React, { useEffect } from "react";
import sounds from "./SoundEffects";

function NightIntro({ nightNumber, isCustom, onIntroEnd }) {
  useEffect(() => {
    sounds.playCameraSwitch();
    const timer = setTimeout(() => {
      onIntroEnd();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onIntroEnd]);

  const getNightLabel = () => {
    if (isCustom) return "Custom Night";
    switch (nightNumber) {
      case 1:
        return "1st Night";
      case 2:
        return "2nd Night";
      case 3:
        return "3rd Night";
      case 4:
        return "4th Night";
      case 5:
        return "5th Night";
      case 6:
        return "6th Night";
      default:
        return `Night ${nightNumber}`;
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "'Courier New', Courier, monospace",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          letterSpacing: "4px",
          marginBottom: "16px",
        }}
      >
        12:00 AM
      </div>
      <div
        style={{
          fontSize: "30px",
          letterSpacing: "3px",
          color: "#aaa",
        }}
      >
        {getNightLabel()}
      </div>
    </div>
  );
}

export default NightIntro;
