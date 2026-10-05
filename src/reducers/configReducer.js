const originalState = {
  hour: 0,
  isPlaying: true,
  energy: 99,
  truePower: 999,
  usageBars: 1,
  night: 1,
  time: 7000,
  blackout: false,
  jumpscare: false,
  gameOver: false,
  cameraButtonDisappear: false,
  foxyBlockCount: 1,
  jammedDoors: { left: false, right: false },
};

export default function config(state = originalState, action) {
  switch (action.type) {
    case "SET_NIGHT":
      return { ...state, night: action.content };

    case "CHANGE_HOUR":
      if (state.jumpscare || state.gameOver) return state;
      return { ...state, hour: state.hour + 1 };

    case "SET_POWER": {
      const truePower = Math.max(0, action.truePower);
      const energy = Math.floor(truePower / 10);
      return {
        ...state,
        truePower,
        energy,
        blackout: truePower <= 0,
      };
    }

    case "SET_USAGE_BARS":
      return { ...state, usageBars: action.bars };

    case "FOXY_BLOCK": {
      return {
        ...state,
        foxyBlockCount: state.foxyBlockCount + 1,
      };
    }

    case "JAM_DOOR":
      return {
        ...state,
        jammedDoors: {
          ...state.jammedDoors,
          [action.side]: true,
        },
      };

    case "CHANGE_ENERGY":
      if (state.hour === 6) return state;
      return { ...state, energy: Math.max(0, state.energy - 1) };

    case "CHANGE_TIME":
      return { ...state, time: action.content };

    case "CHANGE_BLACKOUT":
      return { ...state, blackout: true };

    case "CHANGE_IS_PLAYING":
      return { ...state, isPlaying: action.content };

    case "CHANGE_JUMPSCARE":
      return { ...state, jumpscare: action.animatronic };

    case "CHANGE_CAMERA_BUTTON":
      return { ...state, cameraButtonDisappear: true };

    case "SET_GAME_OVER":
      return { ...state, gameOver: true };

    case "CLEAR_DATA":
      return { ...originalState };

    default:
      return state;
  }
}
