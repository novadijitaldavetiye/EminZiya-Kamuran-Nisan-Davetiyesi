import "./Hero.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;

export default function Hero({ onOpenInvitation }) {
  const goToStory = () => {
    onOpenInvitation?.();
    document.getElementById("story")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="hero"
      className="premium-hero"
      style={{ backgroundImage: `url(${bg("hero.webp")})` }}
    >
      <div className="hero-bg-motion" />
      <div className="hero-overlay" />
      <div className="hero-moon-glow" />

      <div className="hero-content">
        <span className="hero-mark">✦</span>

        <h1 className="hero-names" aria-label="Emin Ziya ve Kâmuran">
          <span className="hero-name hero-name--emin" aria-hidden="true">
            <i className="hero-initial">E</i>
            <span className="hero-name-rest">min</span>
            <span className="hero-name-space"> </span>
            <span className="hero-capital">Z</span>
            <span className="hero-name-rest">iya</span>
          </span>
          <strong className="hero-ampersand" aria-hidden="true">&amp;</strong>
          <span className="hero-name hero-name--kamuran" aria-hidden="true">
            <i className="hero-initial">K</i>
            <span className="hero-name-rest">âmuran</span>
          </span>
        </h1>

        <div className="hero-name-divider" aria-hidden="true" />
        <div className="hero-details">
          <p className="hero-date">18 Ağustos 2026</p>

          <p className="hero-text">
            Birlikte kurduğumuz hayalin ilk sayfasını birlikte açıyoruz.
          </p>
        </div>

        <div className="hero-invitation-callout">
          <div className="hero-callout-ornament" aria-hidden="true">
            <span />
            <i>♡</i>
            <span />
          </div>
          <p>
            <span aria-hidden="true">❧</span>
            Nişanımıza Davetlisiniz
            <span aria-hidden="true">❧</span>
          </p>
        </div>

        <button className="hero-button" onClick={goToStory}>
          Davetiyeyi Aç
        </button>
      </div>

    </section>
  );
}
