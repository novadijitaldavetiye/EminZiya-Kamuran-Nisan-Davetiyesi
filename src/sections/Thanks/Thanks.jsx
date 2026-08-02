import { useEffect, useRef, useState } from "react";
import "./Thanks.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;
const image = (file) => `${import.meta.env.BASE_URL}images/${file}`;
const particles = Array.from({ length: 18 });

export default function Thanks() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setRevealed(true),
      { threshold: 0.38 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goToStart = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section
      ref={sectionRef}
      id="thanks"
      className={`thanks-section ${revealed ? "is-revealed" : ""}`}
      style={{ backgroundImage: `url(${bg("thanks.webp")})` }}
    >
      <div className="thanks-overlay" />
      <div className="thanks-glow" aria-hidden="true" />

      <div className="thanks-particles" aria-hidden="true">
        {particles.map((_, index) => (
          <i key={index} style={{ "--particle": index }} />
        ))}
      </div>

      <div className="thanks-card">
        <div className="thanks-card-shine" aria-hidden="true" />

        <img
          className="thanks-monogram-image"
          src={image("monogram-ke.png")}
          alt="Kamuran ve Emin Ziya monogramı"
        />

        <p className="thanks-eyebrow">Sonsuz Sevgiyle</p>
        <h2 className="thanks-heading">Teşekkürler</h2>

        <div className="thanks-divider" aria-hidden="true">
          <span />
          <i>♥</i>
          <span />
        </div>

        <p className="thanks-text">
          Kalplerimizi bir ömürlük sevgiyle birleştirdiğimiz bu özel yolculukta
          yanımızda olmanız bizim için en değerli hediyedir.
          <span>Sevginiz ve güzel dilekleriniz için gönülden teşekkür ederiz.</span>
        </p>

        <div className="thanks-signature-row">
          <span aria-hidden="true" />
          <p className="thanks-signature">Kamuran &amp; Emin Ziya</p>
          <span aria-hidden="true" />
        </div>

        <p className="thanks-closing">Bu güzel günü birlikte hatırlamak dileğiyle</p>

        <button type="button" className="thanks-back-button" onClick={goToStart}>
          <span aria-hidden="true">↑</span>
          Başa Dön
        </button>
      </div>
    </section>
  );
}