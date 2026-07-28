import { useEffect, useMemo, useState } from "react";
import "./Countdown.css";

const bg = (file) =>
  `${import.meta.env.BASE_URL}images/backgrounds/${file}`;

const WEDDING_DATE = new Date("2026-08-18T19:00:00+03:00");

function calculateRemainingTime() {
  const difference = WEDDING_DATE.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

export default function Countdown() {
  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const calendarUrl = useMemo(() => {
    const start = "20260818T160000Z";
    const end = "20260818T200000Z";

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Emin Ziya & Kâmuran Nişanı",
      dates: `${start}/${end}`,
      details:
        "Emin Ziya ve Kâmuran'ın nişan törenine davetlisiniz.",
      location: "Doğramacı Gala Düğün Salonu",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, []);

  const goToRsvp = () => {
    document.getElementById("rsvp")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="countdown"
      className="countdown-section"
      style={{
        backgroundImage: `url(${bg("countdown.webp")})`,
      }}
    >
      <div className="countdown-overlay" />

      <div className="countdown-content">
        <p className="countdown-eyebrow">Geri Sayım</p>

        <div className="countdown-ornament">
          <span />
          <i />
          <span />
        </div>

        <h2>
          Mutluluğa
          <span>Geri Sayım</span>
        </h2>

        <div className="countdown-divider">
          <span />
          <i />
          <span />
        </div>

        <div className="countdown-grid">
          <div className="countdown-unit">
            <strong>{formatNumber(remainingTime.days)}</strong>
            <span>Gün</span>
          </div>

          <div className="countdown-unit">
            <strong>{formatNumber(remainingTime.hours)}</strong>
            <span>Saat</span>
          </div>

          <div className="countdown-unit">
            <strong>{formatNumber(remainingTime.minutes)}</strong>
            <span>Dakika</span>
          </div>

          <div className="countdown-unit">
            <strong>{formatNumber(remainingTime.seconds)}</strong>
            <span>Saniye</span>
          </div>
        </div>

        <a
          className="calendar-button"
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="calendar-icon" aria-hidden="true">
            ▣
          </span>

          <span>Takvime Ekle</span>
        </a>

        <button
          type="button"
          className="countdown-next"
          onClick={goToRsvp}
        >
          <span className="countdown-next-line" />
          <span>Birlikte Kutlayalım</span>
        </button>
      </div>
    </section>
  );
}
