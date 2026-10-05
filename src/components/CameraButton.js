import React, { useRef } from "react";
import CameraButtonImg from "../media/Textures/CameraButton.png";

function CameraButton({ handleCameraButton }) {
  const isCooldownRef = useRef(false);

  const triggerToggle = () => {
    if (isCooldownRef.current) return;
    isCooldownRef.current = true;
    handleCameraButton();
    setTimeout(() => {
      isCooldownRef.current = false;
    }, 600);
  };

  return (
    <div
      onClick={triggerToggle}
      onMouseEnter={triggerToggle}
      onTouchStart={triggerToggle}
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 35,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: "4px",
      }}
    >
      <img
        alt="Camera monitor toggle bar"
        draggable="false"
        src={CameraButtonImg}
        style={{
          width: "480px",
          maxWidth: "65vw",
          height: "auto",
          opacity: 0.65,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          filter: "drop-shadow(0 -2px 8px rgba(0,0,0,0.8))",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.95";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.65";
          e.currentTarget.style.transform = "scale(1)";
        }}
      />
    </div>
  );
}

export default CameraButton;
