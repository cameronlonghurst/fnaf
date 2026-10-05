import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import sounds from "./SoundEffects";

function Animatronic({
  stages,
  hour,
  blackout,
  gameOver,
  isCameraOpen,
  currentCamera,
  leftDoor,
  rightDoor,
  foxyBlockCount,
  dispatch,
  handleJumpscare,
  onFoxyDoorBash,
}) {
  // Current AI levels
  const aiRef = useRef({
    Freddy: stages.Freddy || 0,
    Bonnie: stages.Bonnie || 0,
    Chica: stages.Chica || 0,
    Foxy: stages.Foxy || 0,
  });

  // Current node positions
  const posRef = useRef({
    Bonnie: "Stage",
    Chica: "Stage",
    Freddy: "Stage",
    FoxyStage: 0, // 0, 1, 2, 3
  });

  // In-office infiltration state (sneaked in while camera up)
  const infiltratedRef = useRef({
    Bonnie: false,
    Chica: false,
    Freddy: false,
  });

  // Foxy sprint countdown
  const foxySprintTimerRef = useRef(null);
  const foxyLowerDelayRef = useRef(0);

  // Sync doors / camera state to refs for interval callbacks
  const stateRef = useRef({
    isCameraOpen,
    currentCamera,
    leftDoor,
    rightDoor,
    blackout,
    gameOver,
    foxyBlockCount,
  });

  useEffect(() => {
    stateRef.current = {
      isCameraOpen,
      currentCamera,
      leftDoor,
      rightDoor,
      blackout,
      gameOver,
      foxyBlockCount,
    };
  }, [isCameraOpen, currentCamera, leftDoor, rightDoor, blackout, gameOver, foxyBlockCount]);

  // Track when monitor lowers to add Foxy stall delay
  useEffect(() => {
    if (!isCameraOpen) {
      // Monitor just lowered -> stall Foxy for 1.0 to 10 seconds
      const randomDelay = Math.random() * 5 + 1.0;
      foxyLowerDelayRef.current = Date.now() + randomDelay * 1000;

      // If Bonnie or Chica infiltrated while monitor was up, instant jumpscare on lowering monitor!
      if (infiltratedRef.current.Bonnie && !stateRef.current.gameOver && !stateRef.current.blackout) {
        handleJumpscare("Bonnie");
      } else if (infiltratedRef.current.Chica && !stateRef.current.gameOver && !stateRef.current.blackout) {
        handleJumpscare("Chica");
      }
    }
  }, [isCameraOpen, handleJumpscare]);

  // Hourly AI scaling per spec:
  // Bonnie: +1 at 2 AM, +1 at 3 AM, +1 at 4 AM
  // Chica: +1 at 3 AM, +1 at 4 AM
  // Foxy: +1 at 3 AM, +1 at 4 AM
  // Freddy: no hourly increase
  useEffect(() => {
    let bonnieBonus = 0;
    let chicaBonus = 0;
    let foxyBonus = 0;

    if (hour >= 2) bonnieBonus += 1;
    if (hour >= 3) {
      bonnieBonus += 1;
      chicaBonus += 1;
      foxyBonus += 1;
    }
    if (hour >= 4) {
      bonnieBonus += 1;
      chicaBonus += 1;
      foxyBonus += 1;
    }

    aiRef.current = {
      Freddy: stages.Freddy || 0,
      Bonnie: Math.min(20, (stages.Bonnie || 0) + bonnieBonus),
      Chica: Math.min(20, (stages.Chica || 0) + chicaBonus),
      Foxy: Math.min(20, (stages.Foxy || 0) + foxyBonus),
    };
  }, [hour, stages]);

  // Kitchen sounds loop: when Chica or Freddy is in Kitchen
  useEffect(() => {
    const kitchenInterval = setInterval(() => {
      if (stateRef.current.blackout || stateRef.current.gameOver) return;
      const chicaInKitchen = posRef.current.Chica === "Kitchen";
      const freddyInKitchen = posRef.current.Freddy === "Kitchen";

      if (chicaInKitchen || freddyInKitchen) {
        sounds.playKitchenClatter();
      }
    }, 4500);

    return () => clearInterval(kitchenInterval);
  }, []);

  // Golden Freddy chance check when viewing CAM 2B
  useEffect(() => {
    if (isCameraOpen && currentCamera === "W. Hall Corner" && !stateRef.current.blackout) {
      // 1.5% chance to trigger Golden Freddy
      if (Math.random() < 0.015) {
        dispatch({
          type: "SET_GOLDEN_FREDDY",
          content: { active: true, jumpscare: false },
        });
      }
    }
  }, [isCameraOpen, currentCamera, dispatch]);

  // Visual static burst dispatch helper
  const triggerMovementStatic = () => {
    dispatch({ type: "CHANGE_ANIMATRONICS_MOVING", content: true });
    sounds.playCameraGarble();
    setTimeout(() => {
      dispatch({ type: "CHANGE_ANIMATRONICS_MOVING", content: false });
    }, 1200);
  };

  // ==========================================
  // BONNIE & CHICA CHECK (Every 300 frames ≈ 5.0s)
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      const { blackout, gameOver, leftDoor, rightDoor, isCameraOpen } = stateRef.current;
      if (blackout || gameOver) return;

      // --- BONNIE MOVEMENT ---
      const bonnieRoll = Math.floor(Math.random() * 20) + 1;
      if (bonnieRoll <= aiRef.current.Bonnie) {
        const currentPos = posRef.current.Bonnie;
        let nextPos = currentPos;

        if (currentPos === "Stage") {
          nextPos = "Dinning Area";
        } else if (currentPos === "Dinning Area") {
          // Can visit Backstage, Supply Closet, or West Hall
          const choices = ["Backstage", "Supply Closet", "West Hall"];
          nextPos = choices[Math.floor(Math.random() * choices.length)];
        } else if (currentPos === "Backstage" || currentPos === "Supply Closet") {
          nextPos = "West Hall";
        } else if (currentPos === "West Hall") {
          nextPos = "W. Hall Corner";
        } else if (currentPos === "W. Hall Corner") {
          nextPos = "Door"; // At Office Left Door blind spot
        } else if (currentPos === "Door") {
          // If left door is closed -> Bonnie is blocked and retreats!
          if (leftDoor) {
            nextPos = Math.random() < 0.5 ? "Dinning Area" : "West Hall";
          } else {
            // Door is open!
            if (isCameraOpen) {
              // Sneaks inside office!
              infiltratedRef.current.Bonnie = true;
              dispatch({ type: "JAM_DOOR", side: "left" });
            } else {
              // Direct jumpscare!
              handleJumpscare("Bonnie");
              return;
            }
          }
        }

        if (nextPos !== currentPos) {
          posRef.current.Bonnie = nextPos;
          triggerMovementStatic();
          dispatch({
            type: "CHANGE_ANIMATRONIC",
            animatronic: "Bonnie",
            animatronicState: {
              camera: nextPos === "Door" ? null : nextPos,
              door: nextPos === "Door",
              jumpscare: false,
            },
          });
        }
      }

      // --- CHICA MOVEMENT ---
      const chicaRoll = Math.floor(Math.random() * 20) + 1;
      if (chicaRoll <= aiRef.current.Chica) {
        const currentPos = posRef.current.Chica;
        let nextPos = currentPos;

        if (currentPos === "Stage") {
          nextPos = "Dinning Area";
        } else if (currentPos === "Dinning Area") {
          // Can move to Restrooms or Kitchen
          nextPos = Math.random() < 0.5 ? "Restrooms" : "Kitchen";
        } else if (currentPos === "Restrooms" || currentPos === "Kitchen") {
          nextPos = "East Hall";
        } else if (currentPos === "East Hall") {
          nextPos = "E. Hall Corner";
        } else if (currentPos === "E. Hall Corner") {
          nextPos = "Door"; // At Office Right Door blind spot
        } else if (currentPos === "Door") {
          // If right door is closed -> Chica is blocked and retreats!
          if (rightDoor) {
            nextPos = Math.random() < 0.5 ? "Dinning Area" : "Restrooms";
          } else {
            // Door is open!
            if (isCameraOpen) {
              // Sneaks inside office!
              infiltratedRef.current.Chica = true;
              dispatch({ type: "JAM_DOOR", side: "right" });
            } else {
              // Direct jumpscare!
              handleJumpscare("Chica");
              return;
            }
          }
        }

        if (nextPos !== currentPos) {
          posRef.current.Chica = nextPos;
          triggerMovementStatic();
          dispatch({
            type: "CHANGE_ANIMATRONIC",
            animatronic: "Chica",
            animatronicState: {
              camera: nextPos === "Door" ? null : nextPos,
              door: nextPos === "Door",
              jumpscare: false,
            },
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, handleJumpscare]);

  // ==========================================
  // FREDDY CHECK (Every 180 frames ≈ 3.0s)
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      const { blackout, gameOver, isCameraOpen, currentCamera, rightDoor } = stateRef.current;
      if (blackout || gameOver) return;

      const currentPos = posRef.current.Freddy;

      // Camera Stalling Rule: Freddy WILL NOT MOVE while camera is watching his current node!
      if (isCameraOpen && currentCamera === currentPos) {
        return; // Stalled by player camera!
      }

      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= aiRef.current.Freddy) {
        let nextPos = currentPos;

        if (currentPos === "Stage") {
          nextPos = "Dinning Area";
        } else if (currentPos === "Dinning Area") {
          nextPos = "Restrooms";
        } else if (currentPos === "Restrooms") {
          nextPos = "Kitchen";
        } else if (currentPos === "Kitchen") {
          nextPos = "East Hall";
        } else if (currentPos === "East Hall") {
          nextPos = "E. Hall Corner";
        } else if (currentPos === "E. Hall Corner") {
          // Preparing to enter office!
          if (rightDoor) {
            // Blocked by right door!
            // Freddy stays at corner or retreats
            return;
          } else {
            // Right door is open! Freddy enters!
            if (!isCameraOpen) {
              handleJumpscare("Freddy");
              return;
            } else {
              infiltratedRef.current.Freddy = true;
            }
          }
        }

        if (nextPos !== currentPos) {
          posRef.current.Freddy = nextPos;
          sounds.playFreddyLaugh();
          triggerMovementStatic();

          dispatch({
            type: "CHANGE_ANIMATRONIC",
            animatronic: "Freddy",
            animatronicState: {
              camera: nextPos,
              door: nextPos === "E. Hall Corner",
              jumpscare: false,
            },
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [dispatch, handleJumpscare]);

  // ==========================================
  // FOXY CHECK (Every 90 frames ≈ 1.5s)
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      const { blackout, gameOver, isCameraOpen } = stateRef.current;
      if (blackout || gameOver) return;

      // Foxy is frozen while monitor is UP!
      if (isCameraOpen) return;

      // Foxy also delayed after monitor lowers
      if (Date.now() < foxyLowerDelayRef.current) return;

      // If already in sprint mode, handled by sprint timer
      if (posRef.current.FoxyStage >= 3) return;

      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= aiRef.current.Foxy) {
        const nextStage = posRef.current.FoxyStage + 1;
        posRef.current.FoxyStage = nextStage;

        let cameraState = "";
        if (nextStage === 1) cameraState = "_1";
        else if (nextStage === 2) cameraState = "_2";
        else if (nextStage >= 3) cameraState = "_3";

        dispatch({
          type: "CHANGE_ANIMATRONIC",
          animatronic: "Foxy",
          animatronicState: {
            camera: cameraState,
            stage: nextStage,
            isRunning: nextStage >= 3,
            door: false,
            jumpscare: false,
          },
        });

        // If Foxy reached Stage 3 -> SPRINT DOWN WEST HALL!
        if (nextStage >= 3) {
          dispatch({ type: "SET_FOXY_HALLWAY", content: true });

          // Start 2.8s sprint countdown
          if (foxySprintTimerRef.current) clearTimeout(foxySprintTimerRef.current);

          foxySprintTimerRef.current = setTimeout(() => {
            dispatch({ type: "SET_FOXY_HALLWAY", content: false });
            const { leftDoor: doorClosed, gameOver: isOver, blackout: isDark } = stateRef.current;
            if (isOver || isDark) return;

            if (doorClosed) {
              // SUCCESSFUL BLOCK!
              // Play door bash sound
              sounds.playFoxyBang();

              // Calculate power steal: 1 + 5 * (blockCount - 1)
              const count = stateRef.current.foxyBlockCount || 1;
              const stealPercent = 1 + 5 * (count - 1);
              onFoxyDoorBash(stealPercent);

              dispatch({ type: "FOXY_BLOCK" });

              // Reset Foxy to Stage 0 or 1
              const resetStage = Math.random() < 0.5 ? 0 : 1;
              posRef.current.FoxyStage = resetStage;
              dispatch({
                type: "CHANGE_ANIMATRONIC",
                animatronic: "Foxy",
                animatronicState: {
                  camera: resetStage === 0 ? "" : "_1",
                  stage: resetStage,
                  isRunning: false,
                  door: false,
                  jumpscare: false,
                },
              });
            } else {
              // DOOR IS OPEN -> FOXY JUMPSCARE!
              handleJumpscare("Foxy");
            }
          }, 2800);
        }
      }
    }, 1500);

    return () => {
      clearInterval(interval);
      if (foxySprintTimerRef.current) clearTimeout(foxySprintTimerRef.current);
    };
  }, [dispatch, handleJumpscare, onFoxyDoorBash]);

  return null;
}

const mapStateToProps = (state) => {
  return {
    hour: state.configReducer.hour,
    blackout: state.configReducer.blackout,
    gameOver: state.configReducer.gameOver,
    isCameraOpen: state.cameraReducer.isCameraOpen,
    currentCamera: state.cameraReducer.camera,
    leftDoor: state.officeReducer.leftDoor,
    rightDoor: state.officeReducer.rightDoor,
    foxyBlockCount: state.configReducer.foxyBlockCount,
  };
};

export default connect(mapStateToProps)(Animatronic);
