const originalState = {
  leftDoor: false,
  rightDoor: false,
  leftLight: false,
  rightLight: false,
};

export default function office(state = originalState, action) {
  switch (action.type) {
    case "CHANGE_OFFICE_CONFIG": {
      const obj = action.obj;
      // Cannot toggle light if door is closed or vice versa logic
      if (obj === "leftLight" && state.leftDoor) return state;
      if (obj === "rightLight" && state.rightDoor) return state;

      if (obj === "leftDoor" && !state.leftDoor && state.leftLight) {
        return { ...state, leftLight: false, leftDoor: true };
      }
      if (obj === "rightDoor" && !state.rightDoor && state.rightLight) {
        return { ...state, rightLight: false, rightDoor: true };
      }

      return {
        ...state,
        [obj]: !state[obj],
      };
    }

    case "FORCE_DOORS_OPEN": {
      return {
        leftDoor: false,
        rightDoor: false,
        leftLight: false,
        rightLight: false,
      };
    }

    case "CLEAR_DATA":
      return { ...originalState };

    default:
      return state;
  }
}
