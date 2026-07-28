import { useEffect, useRef } from "react";
import "./SceneEngine.css";

import InvitationSection from "../components/InvitationSection/InvitationSection";
import Hero from "../components/Hero/Hero";
import Story from "../components/Story/Story";
import Gallery from "../sections/Gallery/Gallery";
import Event from "../sections/Event/Event";
import Countdown from "../sections/Countdown/Countdown";
import RSVP from "../sections/RSVP/RSVP";
import Thanks from "../sections/Thanks/Thanks";

export default function SceneEngine({ scenes, onOpenInvitation }) {
  const engineRef = useRef(null);

  useEffect(() => {
    const frames = engineRef.current?.querySelectorAll(".scene-frame");
    if (!frames?.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    frames.forEach((frame, index) => {
      if (index === 0) frame.classList.add("is-visible");
      observer.observe(frame);
    });

    return () => observer.disconnect();
  }, [scenes]);

  return (
    <div className="scene-engine" ref={engineRef}>
      {scenes.map((scene, index) => {
        if (scene.id === "hero") {
          return (
            <div className="scene-frame" key={scene.id}>
              <Hero onOpenInvitation={onOpenInvitation} />
            </div>
          );
        }

        if (scene.id === "story") {
          return (
            <div className="scene-frame" key={scene.id}>
              <Story />
            </div>
          );
        }

        if (scene.id === "gallery") {
          return (
            <div className="scene-frame" key={scene.id}>
              <Gallery />
            </div>
          );
        }

        if (scene.id === "event") {
          return (
            <div className="scene-frame" key={scene.id}>
              <Event />
            </div>
          );
        }

        if (scene.id === "countdown") {
          return (
            <div className="scene-frame" key={scene.id}>
              <Countdown />
            </div>
          );
        }

        if (scene.id === "rsvp") {
          return (
            <div className="scene-frame" key={scene.id}>
              <RSVP />
            </div>
          );
        }

        if (scene.id === "thanks") {
          return (
            <div className="scene-frame" key={scene.id}>
              <Thanks />
            </div>
          );
        }

        return (
          <div
            className="scene-frame"
            key={scene.id}
            style={{ "--scene-index": index }}
          >
            <InvitationSection section={scene} />
          </div>
        );
      })}
    </div>
  );
}
