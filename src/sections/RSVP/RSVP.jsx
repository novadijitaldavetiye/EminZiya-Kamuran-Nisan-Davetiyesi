import { useState } from "react";
import "./RSVP.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function RSVP() {
  const [attendance, setAttendance] = useState("yes");
  const [fullName, setFullName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const goToThanks = () => {
    document.getElementById("thanks")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = fullName.trim();
    if (!trimmedName || submitState === "loading") return;

    if (!supabaseUrl || !supabaseKey) {
      setSubmitState("error");
      setSubmitMessage("Bağlantı ayarları eksik. Lütfen daha sonra tekrar deneyin.");
      return;
    }

    setSubmitState("loading");
    setSubmitMessage("");

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rsvp_responses`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          full_name: trimmedName,
          attendance: attendance === "yes",
          guest_count: attendance === "yes" ? Number(guestCount) : 0,
        }),
      });

      if (!response.ok) throw new Error("RSVP kaydı oluşturulamadı.");

      setSubmitState("success");
      setSubmitMessage("Yanıtınız başarıyla kaydedildi. Teşekkür ederiz!");
      setFullName("");
      setAttendance("yes");
      setGuestCount("2");
    } catch {
      setSubmitState("error");
      setSubmitMessage("Yanıt gönderilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
    }
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
                maxLength={100}
                disabled={submitState === "loading"}
                required
              />
            </label>

            <label className={`rsvp-field ${attendance === "no" ? "disabled" : ""}`}>
              <span>Kaç Kişi Katılacaksınız?</span>
              <select
                value={guestCount}
                onChange={(event) => setGuestCount(event.target.value)}
                disabled={attendance === "no" || submitState === "loading"}
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
            disabled={submitState === "loading"}
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
            disabled={submitState === "loading"}
          >
            <div className="rsvp-icon" aria-hidden="true">×</div>
            <div className="rsvp-info">
              <strong>Katılamayacağız</strong>
              <span>Kalbimiz sizinle olacak.</span>
            </div>
          </button>

          <button type="submit" className="rsvp-send" disabled={submitState === "loading"}>
            {submitState === "loading" ? "Gönderiliyor..." : "Yanıtımı Gönder"}
          </button>

          {submitMessage && (
            <p className={`rsvp-status ${submitState}`} role="status" aria-live="polite">
              {submitMessage}
            </p>
          )}
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