import React, { useState, useEffect } from "react";
import sounds from "./SoundEffects";
import VictoryGIF from "../media/Textures/Victory.gif";

function VictoryScreen({ nightNumber, isCustom, onContinue }) {
  const [showPaycheck, setShowPaycheck] = useState(false);

  useEffect(() => {
    sounds.playClock();
    // After 6 AM animation, show paycheck if Night 5, 6, or Custom
    const timer = setTimeout(() => {
      setShowPaycheck(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [nightNumber, isCustom]);

  const handleFinish = () => {
    sounds.playCameraSwitch();
    onContinue();
  };

  return (
    <div
      onClick={handleFinish}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        userSelect: "none",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {!showPaycheck ? (
        <div style={{ textAlign: "center" }}>
          <img
            alt="6 AM"
            src={VictoryGIF}
            style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain" }}
          />
        </div>
      ) : (
        <div
          style={{
            animation: "fadeIn 1s ease-in forwards",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {/* Paycheck or Termination slip */}
          {isCustom ? (
            <div
              style={{
                width: "90%",
                maxWidth: "600px",
                backgroundColor: "#fffdf0",
                color: "#1a1a1a",
                padding: "30px",
                border: "4px solid #a83232",
                boxShadow: "0 0 30px rgba(0,0,0,0.8)",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  color: "#a83232",
                  margin: "0 0 16px 0",
                  letterSpacing: "3px",
                  fontSize: "28px",
                }}
              >
                NOTICE OF TERMINATION
              </h2>
              <div style={{ fontSize: "15px", lineHeight: "1.8", textAlign: "left" }}>
                <p>
                  <strong>Employee:</strong> Mike Schmidt
                </p>
                <p>
                  <strong>Effective Date:</strong> Immediately
                </p>
                <p>
                  <strong>Reason for Termination:</strong> Tampering with the animatronics. General lack of professionalism. Unpleasant odor.
                </p>
              </div>
              <div
                style={{
                  marginTop: "24px",
                  padding: "10px",
                  backgroundColor: "#fee",
                  border: "2px dashed #a83232",
                  color: "#900",
                  fontSize: "24px",
                  fontWeight: "bold",
                  letterSpacing: "4px",
                }}
              >
                YOU'RE FIRED.
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "90%",
                maxWidth: "620px",
                backgroundColor: "#ebf4fa",
                color: "#1c2b36",
                padding: "26px 32px",
                border: "3px solid #3c5d79",
                boxShadow: "0 0 35px rgba(0,0,0,0.8)",
                position: "relative",
              }}
            >
              {/* Check Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #3c5d79",
                  paddingBottom: "10px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#8b2500" }}>
                    Fazbear Entertainment
                  </div>
                  <div style={{ fontSize: "11px", color: "#555" }}>
                    Freddy Fazbear's Pizza &bull; Payroll Dept
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    DATE: {nightNumber === 6 ? "11-13-XX" : "11-12-XX"}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "bold" }}>CHECK #00452</div>
                </div>
              </div>

              {/* Payee */}
              <div style={{ margin: "14px 0", fontSize: "16px" }}>
                <span>PAY TO THE ORDER OF: </span>
                <span
                  style={{
                    borderBottom: "1px solid #333",
                    padding: "0 20px",
                    fontWeight: "bold",
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "20px",
                  }}
                >
                  Mike Schmidt
                </span>
              </div>

              {/* Amount */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "18px 0",
                  padding: "10px 14px",
                  backgroundColor: "#dbe8f2",
                  border: "1px solid #acc5d8",
                }}
              >
                <div style={{ fontSize: "14px", fontStyle: "italic" }}>
                  {nightNumber === 6
                    ? "One Hundred Twenty and 50/100 Dollars"
                    : "One Hundred Twenty and 00/100 Dollars"}
                </div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#144e14" }}>
                  {nightNumber === 6 ? "$120.50" : "$120.00"}
                </div>
              </div>

              {nightNumber === 6 && (
                <div style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
                  *Includes $0.50 overtime bonus.
                </div>
              )}

              {/* Signature */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Brush Script MT', cursive, serif",
                      fontSize: "24px",
                      color: "#1a365d",
                    }}
                  >
                    Fazbear Entertainment
                  </div>
                  <div style={{ borderTop: "1px solid #444", fontSize: "11px", color: "#555" }}>
                    AUTHORIZED SIGNATURE
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "24px",
              color: "#aaa",
              fontSize: "14px",
              letterSpacing: "2px",
            }}
          >
            [ CLICK TO RETURN TO MENU ]
          </div>
        </div>
      )}
    </div>
  );
}

export default VictoryScreen;
