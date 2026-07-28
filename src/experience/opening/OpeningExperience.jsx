import { useEffect, useRef } from "react";
import "./OpeningExperience.css";

const INTRO_DURATION = 7500;
const particles = Array.from({ length: 12 });
const infinityParticles = Array.from({ length: 26 });

export default function OpeningExperience({ onComplete }) {
  const audioRef = useRef(null);
  const ringsCanvasRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio?.play().catch(() => {});

    const image = new Image();
    image.src = `${import.meta.env.BASE_URL}images/engagement-rings-chroma.png`;
    image.onload = () => {
      const canvas = ringsCanvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const greenLead = green - Math.max(red, blue);

        if (green > 90 && greenLead > 24) {
          const transparency = Math.min(1, (greenLead - 24) / 90);
          pixels[index + 3] = Math.round(255 * (1 - transparency));
          pixels[index + 1] = Math.min(green, Math.max(red, blue) * 1.08);
        }
      }

      context.putImageData(frame, 0, 0);
    };

    const timer = window.setTimeout(onComplete, INTRO_DURATION);
    return () => {
      window.clearTimeout(timer);
      image.onload = null;
      audio?.pause();
    };
  }, [onComplete]);

  return (
    <section className="engagement-intro" aria-label="Nişan davetiyesi açılışı">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/engagement-intro-7-5s.wav`}
        preload="auto"
      />

      <div
        className="engagement-bg"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/backgrounds/hero.webp)`,
        }}
      />
      <div className="engagement-atmosphere" />

      <div className="engagement-particles" aria-hidden="true">
        {particles.map((_, index) => (
          <i
            key={index}
            style={{
              "--particle-x": `${10 + ((index * 23) % 80)}%`,
              "--particle-y": `${12 + ((index * 37) % 76)}%`,
              "--particle-delay": `${0.3 + index * 0.19}s`,
              "--particle-size": `${2 + (index % 3)}px`,
            }}
          />
        ))}
      </div>

      <div className="infinity-stage" aria-hidden="true">
        <svg className="infinity-trace" viewBox="0 0 200 120">
          <path d="M20 60 C40 20 72 20 100 60 C128 100 160 100 180 60 C160 20 128 20 100 60 C72 100 40 100 20 60" />
        </svg>

        <div className="infinity-dust">
          {infinityParticles.map((_, index) => (
            <i
              key={index}
              style={{
                "--infinity-delay": `${-index * 0.115}s`,
                "--infinity-size": `${2 + (index % 4) * 0.7}px`,
              }}
            />
          ))}
        </div>

        <span className="infinity-core" />
      </div>

      <div className="ring-scene" aria-hidden="true">
        <div className="ring-halo" />
        <div className="engagement-rings">
          <canvas
            ref={ringsCanvasRef}
            className="engagement-rings-image"
            width="768"
            height="512"
            aria-label="Birbirine geçmiş iki altın yüzük"
          />
          <i className="ring-spark" />
        </div>
      </div>

      <div className="engagement-message">
        <span>Bir Söz, İki Kalp</span>
        <strong>Nişanımıza Davetlisiniz</strong>
      </div>

      <div className="engagement-exit" />
    </section>
  );
}
