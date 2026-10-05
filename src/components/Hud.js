import React from "react";
import { connect } from "react-redux";

function Hud({ hour, energy, night, usageBars = 1 }) {
  const displayHour = hour === 0 ? "12 AM" : `${hour} AM`;
  const displayNight = night ? `Night ${night}` : "Night 1";

  // Clamp usage bars from 1 to 5
  const bars = Math.max(1, Math.min(5, usageBars));

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10,
        fontFamily: "'Courier New', Courier, monospace",
        color: "#ffffff",
        userSelect: "none",
      }}
    >
      {/* Top-Right: Time & Night */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          textAlign: "right",
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
        }}
      >
        <div
          style={{
            fontSize: "36px",
            fontWeight: "900",
            letterSpacing: "2px",
            lineHeight: 1.1,
          }}
        >
          {displayHour}
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#bbb",
            letterSpacing: "1px",
            marginTop: "4px",
          }}
        >
          {displayNight}
        </div>
      </div>

      {/* Bottom-Left: Power & Usage */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "30px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          Power left: {Math.max(0, energy)}%
        </div>

        {/* Usage Bar indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <span>Usage:</span>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((idx) => {
              const isActive = idx <= bars;
              let barColor = "#22c55e"; // Green for 1-2
              if (idx === 3) barColor = "#eab308"; // Yellow for 3
              if (idx >= 4) barColor = "#ef4444"; // Red for 4-5

              return (
                <div
                  key={idx}
                  style={{
                    width: "12px",
                    height: "18px",
                    backgroundColor: isActive ? barColor : "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(0,0,0,0.6)",
                    boxShadow: isActive ? `0 0 6px ${barColor}` : "none",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    hour: state.configReducer.hour,
    energy: state.configReducer.energy,
    usageBars: state.configReducer.usageBars || 1,
  };
};

export default connect(mapStateToProps)(Hud);
