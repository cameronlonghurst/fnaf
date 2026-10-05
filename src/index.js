import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store/store";

import TitleMenu from "./components/TitleMenu";
import HelpWanted from "./components/HelpWanted";
import NightIntro from "./components/NightIntro";
import CustomNight from "./CustomNight";
import Controller from "./Controller";
import * as serviceWorker from "./serviceWorker";

import "./css/Game.css";

// Starting AI levels mapping per exact FNAF 1 spec
const getNightConfig = (night) => {
  switch (night) {
    case 1:
      return { Freddy: 0, Bonnie: 0, Chica: 0, Foxy: 0, night: 1, mode: "NIGHT_1" };
    case 2:
      return { Freddy: 0, Bonnie: 3, Chica: 1, Foxy: 1, night: 2, mode: "NIGHT_2" };
    case 3:
      return { Freddy: 1, Bonnie: 5, Chica: 2, Foxy: 2, night: 3, mode: "NIGHT_3" };
    case 4:
      // Night 4 Freddy has 50% chance of AI=1, 50% AI=2 at start
      return {
        Freddy: Math.random() < 0.5 ? 1 : 2,
        Bonnie: 7,
        Chica: 4,
        Foxy: 6,
        night: 4,
        mode: "NIGHT_4",
      };
    case 5:
      return { Freddy: 3, Bonnie: 9, Chica: 7, Foxy: 5, night: 5, mode: "NIGHT_5" };
    case 6:
      return { Freddy: 4, Bonnie: 10, Chica: 12, Foxy: 6, night: 6, mode: "NIGHT_6" };
    default:
      return { Freddy: 0, Bonnie: 0, Chica: 0, Foxy: 0, night: 1, mode: "NIGHT_1" };
  }
};

const App = () => {
  // Screen state: "TITLE" | "HELP_WANTED" | "NIGHT_INTRO" | "GAME" | "CUSTOM_NIGHT"
  const [screen, setScreen] = useState("TITLE");
  const [savedNight, setSavedNight] = useState(1);
  const [beatenNights, setBeatenNights] = useState({});

  // Active game configuration
  const [stages, setStages] = useState(getNightConfig(1));

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem("savedNight") || "1", 10);
      setSavedNight(isNaN(saved) ? 1 : Math.max(1, Math.min(6, saved)));

      const victories = JSON.parse(localStorage.getItem("victories") || "{}");
      setBeatenNights(victories);
    } catch (e) {}
  }, [screen]);

  // Handler for New Game: starts from Night 1, shows HELP WANTED newspaper!
  const handleStartNewGame = () => {
    setStages(getNightConfig(1));
    setScreen("HELP_WANTED");
  };

  // Handler for Continue Game: continues on the highest unlocked night
  const handleContinueGame = () => {
    const nightToPlay = Math.min(5, savedNight);
    setStages(getNightConfig(nightToPlay));
    setScreen("NIGHT_INTRO");
  };

  // Handler for selecting specific night (1-6)
  const handleStartNight = (nightNum) => {
    setStages(getNightConfig(nightNum));
    if (nightNum === 1) {
      setScreen("HELP_WANTED");
    } else {
      setScreen("NIGHT_INTRO");
    }
  };

  // Handler for opening Custom Night
  const handleOpenCustomNight = () => {
    setStages({
      Freddy: 10,
      Bonnie: 10,
      Chica: 10,
      Foxy: 10,
      night: "CUSTOM",
      mode: "CUSTOM",
    });
    setScreen("CUSTOM_NIGHT");
  };

  // When Help Wanted newspaper is clicked -> transition to 12:00 AM Night Intro
  const handleHelpWantedComplete = () => {
    setScreen("NIGHT_INTRO");
  };

  // When Night Intro finishes -> start shift in Office
  const handleIntroEnd = () => {
    setScreen("GAME");
  };

  // When game ends (victory or game over) -> return to Title Menu
  const handleGameEnd = (won) => {
    setScreen("TITLE");
  };

  return (
    <>
      {screen === "TITLE" && (
        <TitleMenu
          onStartNewGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          onStartNight={handleStartNight}
          onOpenCustomNight={handleOpenCustomNight}
          savedNight={savedNight}
          beatenNights={beatenNights}
        />
      )}

      {screen === "HELP_WANTED" && (
        <HelpWanted onComplete={handleHelpWantedComplete} />
      )}

      {screen === "NIGHT_INTRO" && (
        <NightIntro
          nightNumber={stages.night}
          isCustom={stages.mode === "CUSTOM"}
          onIntroEnd={handleIntroEnd}
        />
      )}

      {screen === "CUSTOM_NIGHT" && (
        <div className="custom-night">
          <CustomNight
            state={{ ranges: stages, setStages }}
            onStartGame={() => setScreen("NIGHT_INTRO")}
            onBackToMenu={() => setScreen("TITLE")}
          />
        </div>
      )}

      {screen === "GAME" && (
        <Controller stages={stages} onGameEnd={handleGameEnd} />
      )}
    </>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
