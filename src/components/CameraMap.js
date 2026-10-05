import React from "react";
import Media from "./Media";

const CAMERAS = [
  { id: "Stage", label: "CAM 1A", left: "27.25%", top: "5%", width: "13.25%", height: "9.25%" },
  { id: "Dinning Area", label: "CAM 1B", left: "24%", top: "20.5%", width: "12.25%", height: "8.25%" },
  { id: "Pirate Cove", label: "CAM 1C", left: "12%", top: "39.5%", width: "12.75%", height: "9%" },
  { id: "West Hall", label: "CAM 2A", left: "26.5%", top: "70.5%", width: "12.5%", height: "9.25%" },
  { id: "W. Hall Corner", label: "CAM 2B", left: "26%", top: "81.75%", width: "14%", height: "8.25%" },
  { id: "Supply Closet", label: "CAM 3", left: "8.25%", top: "62.5%", width: "12%", height: "8.25%" },
  { id: "East Hall", label: "CAM 4A", left: "49%", top: "70%", width: "14.5%", height: "9.5%" },
  { id: "E. Hall Corner", label: "CAM 4B", left: "49.25%", top: "81.25%", width: "14.25%", height: "10%" },
  { id: "Backstage", label: "CAM 5", left: "0%", top: "27%", width: "13.5%", height: "9%" },
  { id: "Kitchen", label: "CAM 6", left: "79.5%", top: "57.75%", width: "14.25%", height: "9.25%" },
  { id: "Restrooms", label: "CAM 7", left: "79.75%", top: "24.25%", width: "12.75%", height: "8.25%" },
];

function CameraMap({ handleCameraChange }) {
  return (
    <div
      className="map"
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        zIndex: 15,
        width: "360px",
        maxWidth: "40vw",
        userSelect: "none",
      }}
    >
      <img
        alt="Camera Map Layout"
        draggable="false"
        src={Media.Images.Map}
        style={{
          width: "100%",
          display: "block",
          pointerEvents: "none",
          filter: "drop-shadow(0 0 10px rgba(0,0,0,0.9))",
        }}
      />
      {CAMERAS.map((cam) => (
        <button
          key={cam.id}
          type="button"
          onClick={handleCameraChange}
          title={cam.id}
          style={{
            position: "absolute",
            left: cam.left,
            top: cam.top,
            width: cam.width,
            height: cam.height,
            zIndex: 16,
            background: "transparent",
            border: "none",
            outline: "none",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}

export default CameraMap;
