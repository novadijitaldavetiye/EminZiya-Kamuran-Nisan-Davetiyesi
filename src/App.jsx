import { useState } from "react";

import SceneEngine from "./engine/SceneEngine";
import OpeningExperience from "./experience/opening/OpeningExperience";
import AudioButton from "./components/AudioButton/AudioButton";
import { invitationSections } from "./data/invitationData";

export default function App() {
  const [started, setStarted] = useState(false);
  const [openingDone, setOpeningDone] = useState(false);
  const [invitationOpened, setInvitationOpened] = useState(false);

  const openingScene = {
    ...invitationSections.find((scene) => scene.id === "intro"),
    onButtonClick: () => setStarted(true),
  };

  const mainScenes = invitationSections.filter((scene) => scene.id !== "intro");

  if (!started) {
    return (
      <main className="luxury-invitation">
        <SceneEngine scenes={[openingScene]} />
      </main>
    );
  }

  return (
    <main className="luxury-invitation">
      {!openingDone && (
        <OpeningExperience
          onComplete={() => {
            window.scrollTo({ top: 0, behavior: "instant" });
            setOpeningDone(true);
          }}
        />
      )}

      {openingDone && (
        <SceneEngine
          scenes={mainScenes}
          onOpenInvitation={() => setInvitationOpened(true)}
        />
      )}

      {invitationOpened && <AudioButton />}
    </main>
  );
}
