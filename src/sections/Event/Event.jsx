import "./Event.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;
const venueName = "Doğramacı Gala Düğün Salonu";
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueName)}&travelmode=driving&dir_action=navigate`;

export default function Event() {
  const goToCountdown = () => {
    document.getElementById("countdown")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="event"
      className="event-section"
      style={{ backgroundImage: `url(${bg("event.webp")})` }}
    >
      <div className="event-overlay" />

      <div className="event-card">
        <p className="event-eyebrow">NİŞAN BİLGİLERİ</p>

        <div className="event-date">
          <span className="event-day">18</span>
          <span className="event-month">Ağustos</span>
          <span className="event-year">2026</span>
        </div>

        <div className="event-divider" />

        <div className="event-info">
          <span>Saat</span>
          <strong>19:00</strong>
        </div>

        <div className="event-info">
          <span>Mekan</span>
          <strong>{venueName}</strong>
        </div>

        <a
          className="event-map-button"
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${venueName} için yol tarifi al`}
        >
          Yol Tarifi Al
        </a>

      </div>

      <div className="event-next" onClick={goToCountdown}>
        <div className="event-line" />
        <p>Geri Sayımı Gör</p>
      </div>
    </section>
  );
}
