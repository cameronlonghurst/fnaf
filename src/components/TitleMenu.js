import React, { useState, useEffect } from "react";
import sounds from "./SoundEffects";
import FreddyImg from "../media/Textures/Freddy.webp";
import FNAFImg from "../media/FNAF.webp";

function TitleMenu({
  onStartNewGame,
  onContinueGame,
  onStartNight,
  onOpenCustomNight,
  savedNight = 1,
  beatenNights = {},
}) {
  const [glitch, setGlitch] = useState(0);
  const [selectedOption, setSelectedOption] = useState("NEW");

  const hasNight6 = Boolean(beatenNights[5] || beatenNights[6] || savedNight >= 6);
  const hasCustomNight = Boolean(beatenNights[6] || savedNight >= 7);

  // Stars earned
  const starCount =
    (beatenNights[5] ? 1 : 0) +
    (beatenNights[6] ? 1 : 0) +
    (beatenNights["4/20"] ? 1 : 0);

  useEffect(() => {
    sounds.playTitleAmbience();

    // Random twitching of Freddy's head/face in true FNAF 1 fashion
    const twitchInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.28) {
        setGlitch(Math.floor(Math.random() * 3) + 1);
        setTimeout(() => setGlitch(0), 100 + Math.random() * 150);
      }
    }, 700);

    return () => {
      clearInterval(twitchInterval);
      sounds.stopTitleAmbience();
    };
  }, []);

  const handleSelect = (action) => {
    sounds.playCameraSwitch();
    action();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        userSelect: "none",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* Freddy Fazbear twitching on the left side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60%",
          height: "100%",
          backgroundImage: `url(${glitch > 1 ? FNAFImg : FreddyImg})`,
          backgroundSize: "cover",
          backgroundPosition:
            glitch === 1 ? "46% 50%" : glitch === 2 ? "54% 48%" : "50% 50%",
          filter:
            glitch > 0
              ? "brightness(1.6) contrast(1.5)"
              : "brightness(0.85) contrast(1.1)",
          transform: glitch > 0 ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.04s ease",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      {/* CRT Scanline & noise effects */}
      <div className="crt-lines" />
      <div className="noise-overlay" />

      {/* Main Title & Options Area (Right Side) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginLeft: "auto",
          width: "50%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "50px 60px 40px 0",
          boxSizing: "border-box",
        }}
      >
        {/* Title */}
        <div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "48px",
              fontWeight: "900",
              letterSpacing: "4px",
              lineHeight: 1.15,
              margin: 0,
              textShadow: "3px 3px 6px #000",
            }}
          >
            Five<br />
            Nights<br />
            at<br />
            Freddy's
          </h1>

          {/* Stars */}
          {starCount > 0 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              {[1, 2, 3].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "28px",
                    color: star <= starCount ? "#ffd700" : "transparent",
                    textShadow: star <= starCount ? "0 0 10px #ffd700" : "none",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* New Game */}
          <button
            onClick={() => handleSelect(onStartNewGame)}
            onMouseEnter={() => setSelectedOption("NEW")}
            style={{
              background: "none",
              border: "none",
              color: selectedOption === "NEW" ? "#ffffff" : "#888888",
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "left",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textShadow: selectedOption === "NEW" ? "0 0 8px #ffffff" : "none",
              outline: "none",
            }}
          >
            <span
              style={{
                visibility: selectedOption === "NEW" ? "visible" : "hidden",
                color: "#ffffff",
              }}
            >
              &gt;&gt;
            </span>
            New Game
          </button>

          {/* Continue (Night X) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              onClick={() => handleSelect(onContinueGame)}
              onMouseEnter={() => setSelectedOption("CONTINUE")}
              style={{
                background: "none",
                border: "none",
                color: selectedOption === "CONTINUE" ? "#ffffff" : "#888888",
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "left",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textShadow:
                  selectedOption === "CONTINUE" ? "0 0 8px #ffffff" : "none",
                outline: "none",
              }}
            >
              <span
                style={{
                  visibility: selectedOption === "CONTINUE" ? "visible" : "hidden",
                  color: "#ffffff",
                }}
              >
                &gt;&gt;
              </span>
              Continue
            </button>
            <div
              style={{
                marginLeft: "38px",
                marginTop: "4px",
                fontSize: "16px",
                color: "#777777",
              }}
            >
              Night {savedNight}
            </div>
          </div>

          {/* 6th Night */}
          {hasNight6 && (
            <button
              onClick={() => handleSelect(() => onStartNight(6))}
              onMouseEnter={() => setSelectedOption("NIGHT6")}
              style={{
                background: "none",
                border: "none",
                color: selectedOption === "NIGHT6" ? "#ffffff" : "#888888",
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "left",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textShadow:
                  selectedOption === "NIGHT6" ? "0 0 8px #ffffff" : "none",
                outline: "none",
              }}
            >
              <span
                style={{
                  visibility: selectedOption === "NIGHT6" ? "visible" : "hidden",
                  color: "#ffffff",
                }}
              >
                &gt;&gt;
              </span>
              6th Night
            </button>
          )}

          {/* Custom Night */}
          {hasCustomNight && (
            <button
              onClick={() => handleSelect(onOpenCustomNight)}
              onMouseEnter={() => setSelectedOption("CUSTOM")}
              style={{
                background: "none",
                border: "none",
                color: selectedOption === "CUSTOM" ? "#ffffff" : "#888888",
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "left",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textShadow:
                  selectedOption === "CUSTOM" ? "0 0 8px #ffffff" : "none",
                outline: "none",
              }}
            >
              <span
                style={{
                  visibility: selectedOption === "CUSTOM" ? "visible" : "hidden",
                  color: "#ffffff",
                }}
              >
                &gt;&gt;
              </span>
              Custom Night
            </button>
          )}
        </div>

        {/* Keyboard Shortcuts Notice (Only on Home Screen as requested) */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "12px 16px",
            fontSize: "12px",
            lineHeight: "1.7",
            color: "#aaaaaa",
            borderRadius: "2px",
            maxWidth: "460px",
          }}
        >
          <div
            style={{
              color: "#22c55e",
              fontWeight: "bold",
              letterSpacing: "1px",
              marginBottom: "4px",
            }}
          >
            [ KEYBOARD SHORTCUTS &amp; CONTROLS ]
          </div>
          <div>
            <strong style={{ color: "#fff" }}>[A]</strong> or <strong style={{ color: "#fff" }}>[Q]</strong> : Left Door &nbsp;|&nbsp; <strong style={{ color: "#fff" }}>[S]</strong> or <strong style={{ color: "#fff" }}>[W]</strong> : Left Light
          </div>
          <div>
            <strong style={{ color: "#fff" }}>[D]</strong> or <strong style={{ color: "#fff" }}>[E]</strong> : Right Door &nbsp;|&nbsp; <strong style={{ color: "#fff" }}>[F]</strong> or <strong style={{ color: "#fff" }}>[R]</strong> : Right Light
          </div>
          <div>
            <strong style={{ color: "#fff" }}>[SPACE]</strong> : Toggle Camera Monitor &nbsp;|&nbsp; <strong style={{ color: "#fff" }}>[MOUSE]</strong> : Pan Office / Click Buttons &amp; Doors Directly
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#555555",
            maxWidth: "460px",
          }}
        >
          <span>v1.13</span>
          <span>&copy; 2014 Scott Cawthon</span>
        </div>
      </div>
    </div>
  );
}

export default TitleMenu;
