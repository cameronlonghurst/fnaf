const originalState = {
  Freddy: {
    camera: "Stage",
    door: false,
    jumpscare: false,
  },
  Bonnie: {
    camera: "Stage",
    door: false,
    jumpscare: false,
  },
  Chica: {
    camera: "Stage",
    door: false,
    jumpscare: false,
  },
  Foxy: {
    camera: "",
    stage: 0,
    door: false,
    jumpscare: false,
    isRunning: false,
  },
  GoldenFreddy: {
    active: false,
    jumpscare: false,
  },
};

export default function animatronics(state = originalState, action) {
  switch (action.type) {
    case "CHANGE_ANIMATRONIC": {
      return {
        ...state,
        [action.animatronic]: {
          ...state[action.animatronic],
          ...action.animatronicState,
        },
      };
    }
    case "SET_GOLDEN_FREDDY": {
      return {
        ...state,
        GoldenFreddy: {
          ...state.GoldenFreddy,
          ...action.content,
        },
      };
    }
    case "CLEAR_DATA":
      return { ...originalState };
    default:
      return state;
  }
}
