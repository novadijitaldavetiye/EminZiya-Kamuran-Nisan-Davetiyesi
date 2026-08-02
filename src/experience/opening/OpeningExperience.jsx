import { useEffect, useRef } from "react";
import "./OpeningExperience.css";

const INTRO_DURATION = 10000;

export default function OpeningExperience({ onComplete }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio?.play().catch(() => {});

    const timer = window.setTimeout(onComplete, INTRO_DURATION);
    return () => {
      window.clearTimeout(timer);
      audio?.pause();
    };
  }, [onComplete]);

  const asset = (name) => `${import.meta.env.BASE_URL}images/opening/${name}`;

  return (
    <section className="premium-intro" aria-label="Nişan davetiyesi açılışı">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/luxury-wedding-ring-intro-18s.wav`}
        preload="auto"
      />

      <img
        className="premium-intro__background"
        src={asset("cinematic-background-v2.png")}
        alt=""
        aria-hidden="true"
      />
      <div className="premium-intro__grade" aria-hidden="true" />
      <img
        className="premium-intro__mist"
        src={asset("mist-gold-particles-transparent-v3.png")}
        alt=""
        aria-hidden="true"
      />

      <p className="premium-intro__prologue">Bir Söz</p>

      <div className="premium-intro__ring-stage" aria-hidden="true">
        <div className="premium-intro__orbit premium-intro__orbit--outer" />
        <div className="premium-intro__orbit premium-intro__orbit--inner" />
        <img
          className="premium-intro__flare"
          src={asset("gold-light-flare-transparent-v3.png")}
          alt=""
        />
        <img
          className="premium-intro__ring premium-intro__ring--one"
          src={asset("ring-1-premium-v2.png")}
          alt=""
        />
        <img
          className="premium-intro__ring premium-intro__ring--two"
          src={asset("ring-2-premium-v2.png")}
          alt=""
        />
        <span className="premium-intro__spark premium-intro__spark--one" />
        <span className="premium-intro__spark premium-intro__spark--two" />
      </div>

      <div className="premium-intro__copy">
        <div className="premium-intro__monogram">
          <span>K</span><i>&</i><span>Z</span>
        </div>
        <div className="premium-intro__rule" />
        <p>İki Kalp, Tek Bir Söz</p>
        <strong>Nişanımıza Davetlisiniz</strong>
      </div>

      <div className="premium-intro__curtain" aria-hidden="true" />
      <div className="premium-intro__exit" aria-hidden="true" />
    </section>
  );
}