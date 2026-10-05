const originalState = {
  camera: "Stage",
  isCameraOpen: false,
  areAnimatronicsMoving: false,
  foxyHallwayRunning: false,
};

export default function camera(state = originalState, action) {
  switch (action.type) {
    case "CHANGE_CAMERA":
      return { ...state, camera: action.content };
    case "SET_IS_OPEN":
      return {
        ...state,
        isCameraOpen: !state.isCameraOpen,
      };
    case "FORCE_CAMERA_CLOSE":
      return { ...state, isCameraOpen: false };
    case "CHANGE_ANIMATRONICS_MOVING":
      return { ...state, areAnimatronicsMoving: action.content };
    case "SET_FOXY_HALLWAY":
      return { ...state, foxyHallwayRunning: action.content };
    case "CLEAR_DATA":
      return { ...originalState };
    default:
      return state;
  }
}
