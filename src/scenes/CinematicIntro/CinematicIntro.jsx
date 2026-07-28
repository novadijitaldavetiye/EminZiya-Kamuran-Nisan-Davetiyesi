import { useEffect, useRef } from "react";
import "./CinematicIntro.css";

export default function CinematicIntro({ onFinish }) {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});

    const timer = setTimeout(() => {
      onFinish();
    }, 19000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <section className="cinema-intro">
      <audio ref={audioRef} src="/music/intro.mp3" preload="auto" />

      <div className="cinema-bg" />
      <div className="cinema-dark" />
      <div className="cinema-stars stars-one" />
      <div className="cinema-stars stars-two" />
      <div className="cinema-moon-glow" />
      <div className="cinema-light-ray" />
      <div className="cinema-fog fog-one" />
      <div className="cinema-fog fog-two" />

      <div className="cinema-text text-one">Bir Hikâye...</div>
      <div className="cinema-text text-two">İki Kalp...</div>
      <div className="cinema-text text-three">Tek Bir Gökyüzü...</div>

      <div className="cinema-names">
        <span>Ahmet</span>
        <strong>&</strong>
        <span>Elif</span>
      </div>

      <div className="cinema-fade-out" />
    </section>
  );
}