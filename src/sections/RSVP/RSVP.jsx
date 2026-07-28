import { useState } from "react";
import "./RSVP.css";

export default function RSVP() {
  const [attendance, setAttendance] = useState("yes");
  const [fullName, setFullName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const whatsappNumber = "905443655732";

  const goToThanks = () => {
    document.getElementById("thanks")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const response =
      attendance === "yes"
        ? `Katılacağız (${guestCount} kişi) 🎉`
        : "Katılamayacağız";
    const message = `Merhaba, Ahmet & Elif'in düğün davetiyesi için katılım yanıtımız:\n\nAd Soyad: ${fullName.trim()}\nYanıt: ${response}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="rsvp"
      className="rsvp-section"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/backgrounds/rsvp.webp)`,
      }}
    >
      <div className="rsvp-overlay" />

      <div className="rsvp-content">
        <p className="rsvp-eyebrow">RSVP</p>

        <h2>
          Bizimle
          <span>Misiniz?</span>
        </h2>

        <div className="rsvp-divider" />

        <p className="rsvp-text">
          Katılım bilgilerinizi paylaşarak bu özel gecede yerinizi ayırtın.
        </p>

        <form className="rsvp-card" onSubmit={handleSubmit}>
          <div className="rsvp-fields">
            <label className="rsvp-field">
              <span>Ad Soyad</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Adınız ve soyadınız"
                autoComplete="name"
                required
              />
            </label>

            <label className={`rsvp-field ${attendance === "no" ? "disabled" : ""}`}>
              <span>Kaç Kişi Katılacaksınız?</span>
              <select
                value={guestCount}
                onChange={(event) => setGuestCount(event.target.value)}
                disabled={attendance === "no"}
                aria-label="Katılacak kişi sayısı"
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>
                    {count} kişi
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rsvp-card-separator" />
          <p className="rsvp-card-title">Katılım Durumu</p>

          <button
            type="button"
            className={`rsvp-option ${attendance === "yes" ? "active" : ""}`}
            onClick={() => setAttendance("yes")}
          >
            <div className="rsvp-icon" aria-hidden="true">✓</div>
            <div className="rsvp-info">
              <strong>Katılacağız</strong>
              <span>Bu özel gecede yanınızdayız.</span>
            </div>
          </button>

          <button
            type="button"
            className={`rsvp-option ${attendance === "no" ? "active" : ""}`}
            onClick={() => setAttendance("no")}
          >
            <div className="rsvp-icon" aria-hidden="true">×</div>
            <div className="rsvp-info">
              <strong>Katılamayacağız</strong>
              <span>Kalbimiz sizinle olacak.</span>
            </div>
          </button>

          <button type="submit" className="rsvp-send">
            Yanıtımı Gönder
          </button>
        </form>

        <div
          className="rsvp-next"
          onClick={goToThanks}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") goToThanks();
          }}
        >
          <div className="rsvp-line" />
          <p>Teşekkürler</p>
        </div>
      </div>
    </section>
  );
}
