import { useEffect, useRef, useState } from "react";
import "./Thanks.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;
const snowflakes = Array.from({ length: 22 });

export default function Thanks() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setRevealed(true),
      { threshold: 0.45 },
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
      <div className="thanks-aurora" aria-hidden="true" />
      <div className="thanks-reflection" aria-hidden="true" />

      <div className="thanks-snow" aria-hidden="true">
        {snowflakes.map((_, index) => (
          <i key={index} style={{ "--snow": index }} />
        ))}
      </div>

      <div className="thanks-content">
        <div className="thanks-title-group">
          <div className="thanks-monogram" aria-hidden="true">
            <span>Z</span><i>&amp;</i><span>K</span>
          </div>

          <p className="thanks-eyebrow">Sonsuz Sevgiyle</p>
          <h2 className="thanks-heading">Teşekkürler</h2>
        </div>

        <div className="thanks-heart-divider" aria-hidden="true">
          <span /><i>✦</i><span />
        </div>

        <p className="thanks-text">
          Kalplerimizi bir ömürlük sevgiyle birleştirdiğimiz bu özel yolculukta
          <br />
          yanımızda olmanız, bizim için en değerli hediyedir.
          <br />
          Güzel dilekleriniz ve sevginiz için gönülden teşekkür ederiz.
        </p>

        <div className="thanks-signature-row">
          <span aria-hidden="true" />
          <p className="thanks-signature">Emin Ziya &amp; Kamuran</p>
          <span aria-hidden="true" />
        </div>

        <button type="button" className="thanks-back-button" onClick={goToStart}>
          <span aria-hidden="true">↑</span>
          Başa Dön
        </button>
      </div>
    </section>
  );
}
