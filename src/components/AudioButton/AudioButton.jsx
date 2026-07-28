import { useEffect, useRef, useState } from "react";
import "./AudioButton.css";

export default function AudioButton() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/wedding.mp3`}
        loop
        preload="metadata"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <button
        type="button"
        className={`audio-button ${isPlaying ? "is-playing" : ""}`}
        onClick={toggleAudio}
        aria-label={isPlaying ? "Müziği durdur" : "Müziği oynat"}
        aria-pressed={isPlaying}
      >
        <span className="audio-wave" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </span>
      </button>
    </>
  );
}
