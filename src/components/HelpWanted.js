import React, { useEffect } from "react";
import sounds from "./SoundEffects";

function HelpWanted({ onComplete }) {
  useEffect(() => {
    sounds.playCameraSwitch();
  }, []);

  const handleClick = () => {
    sounds.playCameraSwitch();
    onComplete();
  };

  return (
    <div
      onClick={handleClick}
      className="newspaper-container"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0d0d0d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* CRT scanline effect */}
      <div className="crt-lines" />

      {/* Newspaper sheet */}
      <div
        style={{
          width: "90%",
          maxWidth: "760px",
          backgroundColor: "#d8c9a8",
          color: "#1c1917",
          padding: "24px 32px",
          boxShadow: "0 0 50px rgba(0,0,0,0.9)",
          border: "2px solid #574b35",
          fontFamily: "'Times New Roman', Times, serif",
          position: "relative",
          animation: "newspaperFadeIn 1.2s ease-out forwards",
        }}
      >
        {/* Newspaper Top Header */}
        <div
          style={{
            borderBottom: "3px double #332d22",
            paddingBottom: "8px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#574b35",
              marginBottom: "4px",
            }}
          >
            The Local Gazette &bull; Classified Advertisements &bull; Fall Edition
          </div>
          <div
            style={{
              fontSize: "44px",
              fontWeight: "900",
              letterSpacing: "3px",
              textTransform: "uppercase",
              lineHeight: 1.1,
              fontFamily: "'Impact', 'Times New Roman', serif",
            }}
          >
            HELP WANTED
          </div>
        </div>

        {/* Ad Box */}
        <div
          style={{
            border: "3px solid #221c13",
            padding: "20px 24px",
            backgroundColor: "#dfd2b5",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "8px",
              color: "#6b1414",
              letterSpacing: "1px",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            Freddy Fazbear's Pizza
          </div>

          <div
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
              textAlign: "justify",
              marginBottom: "14px",
              fontWeight: "500",
            }}
          >
            <p style={{ margin: "6px 0" }}>
              Family pizzeria looking for security guard to work the nightshift.
            </p>
            <p style={{ margin: "6px 0", fontWeight: "bold" }}>
              Hours: 12:00 am to 6:00 am.
            </p>
            <p style={{ margin: "6px 0" }}>
              Responsibilities include monitoring security cameras, ensuring safety of
              restaurant equipment and animatronic characters.
            </p>
            <p
              style={{
                margin: "10px 0 6px 0",
                fontSize: "12px",
                fontStyle: "italic",
                color: "#4a4233",
              }}
            >
              *Management is not responsible for injury, damage, or dismemberment.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px dashed #6b5e46",
              paddingTop: "12px",
              marginTop: "8px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "900", color: "#1a5e1a" }}>
              $120 a week.
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                letterSpacing: "1px",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              To apply call: 1-888-FAZ-FAZBEAR
            </div>
          </div>
        </div>

        {/* Bottom click instruction */}
        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
            fontSize: "13px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#695b42",
            animation: "pulseText 1.5s infinite alternate",
          }}
        >
          [ CLICK ANYWHERE TO START SHIFT ]
        </div>
      </div>
    </div>
  );
}

export default HelpWanted;
