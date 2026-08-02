import { useLayoutEffect, useState } from "react";

import "./Hero.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;

export default function Hero({ onOpenInvitation }) {
  const [invitationOpened, setInvitationOpened] = useState(false);

  useLayoutEffect(() => {
    if (invitationOpened) return undefined;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousOverscroll;
    };
  }, [invitationOpened]);

  const goToStory = () => {
    setInvitationOpened(true);
    onOpenInvitation?.();

    requestAnimationFrame(() => {
      document.getElementById("story")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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

        <h1 className="hero-names" aria-label="Kamuran ve Emin Ziya">
          <span className="hero-name hero-name--kamuran" aria-hidden="true">
            <i className="hero-initial">K</i>
            <span className="hero-name-rest">âmuran</span>
          </span>
          <strong className="hero-ampersand" aria-hidden="true">&amp;</strong>
          <span className="hero-name hero-name--emin" aria-hidden="true">
            <i className="hero-initial">E</i>
            <span className="hero-name-rest">min</span>
            <span className="hero-name-space"> </span>
            <span className="hero-capital">Z</span>
            <span className="hero-name-rest">iya</span>
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
            Nişanımıza Davetlisiniz
          </p>
        </div>

        <div className="hero-open-action">
          <button className="hero-button" onClick={goToStory}>
            <span>Davetiyeyi Aç</span>
          </button>
        </div>
      </div>

    </section>
  );
}
