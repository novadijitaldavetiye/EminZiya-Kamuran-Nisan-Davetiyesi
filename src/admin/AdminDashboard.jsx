import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const sessionKey = "rsvp_admin_session";
const guestPhotoBucket = "guest-photos";

const guestPhotoUrl = (path) =>
  `${supabaseUrl}/storage/v1/object/public/${guestPhotoBucket}/${encodeURIComponent(path).replaceAll("%2F", "/")}`;

const apiHeaders = (accessToken) => ({
  apikey: supabaseKey,
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
});

export default function AdminDashboard() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(sessionKey)) || null;
    } catch {
      return null;
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responses, setResponses] = useState([]);
  const [guestPhotos, setGuestPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(Boolean(session));
  const [photoMessage, setPhotoMessage] = useState("");
  const [loading, setLoading] = useState(Boolean(session));
  const [message, setMessage] = useState("");

  const loadResponses = async (activeSession = session) => {
    if (!activeSession?.access_token) return;
    setLoading(true);
    setMessage("");

    try {
      const result = await fetch(
        `${supabaseUrl}/rest/v1/rsvp_responses?select=id,full_name,attendance,guest_count,created_at&order=created_at.desc`,
        { headers: apiHeaders(activeSession.access_token) },
      );

      if (result.status === 401) {
        localStorage.removeItem(sessionKey);
        setSession(null);
        throw new Error("Oturum süresi doldu. Lütfen yeniden giriş yapın.");
      }

      if (!result.ok) throw new Error("Yanıtlar alınamadı. Yönetici yetkisini kontrol edin.");
      setResponses(await result.json());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGuestPhotos = async (activeSession = session) => {
    if (!activeSession?.access_token) return;
    setPhotoLoading(true);
    setPhotoMessage("");

    try {
      const result = await fetch(
        `${supabaseUrl}/rest/v1/guest_photos?select=id,guest_name,note,storage_path,status,created_at&order=created_at.desc`,
        { headers: apiHeaders(activeSession.access_token) },
      );
      if (!result.ok) throw new Error("Misafir fotoğrafları alınamadı.");
      setGuestPhotos(await result.json());
    } catch (error) {
      setPhotoMessage(error.message);
    } finally {
      setPhotoLoading(false);
    }
  };

  const updatePhotoStatus = async (photo, status) => {
    setPhotoMessage("");
    try {
      const result = await fetch(`${supabaseUrl}/rest/v1/guest_photos?id=eq.${photo.id}`, {
        method: "PATCH",
        headers: { ...apiHeaders(session.access_token), Prefer: "return=minimal" },
        body: JSON.stringify({ status }),
      });
      if (!result.ok) throw new Error("Fotoğraf durumu güncellenemedi.");
      setGuestPhotos((current) => current.map((item) => item.id === photo.id ? { ...item, status } : item));
    } catch (error) {
      setPhotoMessage(error.message);
    }
  };

  const deleteGuestPhoto = async (photo) => {
    if (!window.confirm(`${photo.guest_name} tarafından yüklenen fotoğraf kalıcı olarak silinsin mi?`)) return;
    setPhotoMessage("");

    try {
      const storageDelete = await fetch(`${supabaseUrl}/storage/v1/object/${guestPhotoBucket}/${photo.storage_path}`, {
        method: "DELETE",
        headers: { apikey: supabaseKey, Authorization: `Bearer ${session.access_token}` },
      });
      if (!storageDelete.ok && storageDelete.status !== 404) throw new Error("Fotoğraf dosyası silinemedi.");

      const recordDelete = await fetch(`${supabaseUrl}/rest/v1/guest_photos?id=eq.${photo.id}`, {
        method: "DELETE",
        headers: { ...apiHeaders(session.access_token), Prefer: "return=minimal" },
      });
      if (!recordDelete.ok) throw new Error("Fotoğraf kaydı silinemedi.");
      setGuestPhotos((current) => current.filter((item) => item.id !== photo.id));
    } catch (error) {
      setPhotoMessage(error.message);
    }
  };
  useEffect(() => {
    if (session) {
      loadResponses(session);
      loadGuestPhotos(session);
    }
  }, []);

  const totals = useMemo(() => {
    const attending = responses.filter((item) => item.attendance);
    return {
      responses: responses.length,
      attendingInvitations: attending.length,
      attendingPeople: attending.reduce((sum, item) => sum + item.guest_count, 0),
      decliningInvitations: responses.length - attending.length,
    };
  }, [responses]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: supabaseKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await result.json();
      if (!result.ok) throw new Error("E-posta veya parola hatalı.");

      localStorage.setItem(sessionKey, JSON.stringify(data));
      setSession(data);
      setPassword("");
      await Promise.all([loadResponses(data), loadGuestPhotos(data)]);
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(sessionKey);
    setSession(null);
    setResponses([]);
    setGuestPhotos([]);
    setPhotoMessage("");
    setMessage("");
  };

  const exportCsv = () => {
    const escapeCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = responses.map((item) => [
      item.full_name,
      item.attendance ? "Katılacak" : "Katılamayacak",
      item.guest_count,
      new Date(item.created_at).toLocaleString("tr-TR"),
    ]);
    const csv = "\uFEFF" + [["Ad Soyad", "Durum", "Kişi Sayısı", "Yanıt Tarihi"], ...rows]
      .map((row) => row.map(escapeCell).join(";"))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "emin-ziya-kamuran-rsvp.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return (
      <main className="admin-shell admin-login-shell">
        <form className="admin-login" onSubmit={handleLogin}>
          <p className="admin-kicker">Emin Ziya & Kamuran</p>
          <h1>RSVP Yönetimi</h1>
          <p className="admin-muted">Katılım sonuçlarını görmek için yönetici hesabınızla giriş yapın.</p>
          <label>
            <span>E-posta</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
          </label>
          <label>
            <span>Parola</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          <button type="submit" disabled={loading}>{loading ? "Giriş yapılıyor..." : "Giriş Yap"}</button>
          {message && <p className="admin-message error" role="alert">{message}</p>}
          <a className="admin-back" href="./">← Davetiyeye dön</a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">Emin Ziya & Kamuran</p>
          <h1>Katılım Sonuçları</h1>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={() => { loadResponses(); loadGuestPhotos(); }} disabled={loading || photoLoading}>Yenile</button>
          <button type="button" onClick={handleLogout}>Çıkış</button>
        </div>
      </header>

      <section className="admin-stats" aria-label="Katılım özeti">
        <article><span>Toplam Yanıt</span><strong>{totals.responses}</strong></article>
        <article><span>Katılacak Kişi</span><strong>{totals.attendingPeople}</strong></article>
        <article><span>Katılan Davetiye</span><strong>{totals.attendingInvitations}</strong></article>
        <article><span>Katılamayan</span><strong>{totals.decliningInvitations}</strong></article>
      </section>

      <section className="admin-list-card">
        <div className="admin-list-heading">
          <h2>Davetli Yanıtları</h2>
          <button type="button" onClick={exportCsv} disabled={!responses.length}>CSV İndir</button>
        </div>
        {message && <p className="admin-message error" role="alert">{message}</p>}
        {loading ? (
          <p className="admin-empty">Yanıtlar yükleniyor...</p>
        ) : responses.length === 0 ? (
          <p className="admin-empty">Henüz katılım yanıtı bulunmuyor.</p>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead><tr><th>Ad Soyad</th><th>Durum</th><th>Kişi</th><th>Tarih</th></tr></thead>
              <tbody>
                {responses.map((item) => (
                  <tr key={item.id}>
                    <td>{item.full_name}</td>
                    <td><span className={`admin-badge ${item.attendance ? "yes" : "no"}`}>{item.attendance ? "Katılacak" : "Katılamayacak"}</span></td>
                    <td>{item.guest_count}</td>
                    <td>{new Date(item.created_at).toLocaleString("tr-TR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-list-card admin-photo-card">
        <div className="admin-list-heading">
          <div>
            <h2>Misafir Fotoğrafları</h2>
            <p className="admin-section-note">Onaylanan fotoğraflar davetiye galerisinde yayınlanır.</p>
          </div>
          <span className="admin-photo-count">{guestPhotos.filter((photo) => photo.status === "pending").length} bekliyor</span>
        </div>
        {photoMessage && <p className="admin-message error" role="alert">{photoMessage}</p>}
        {photoLoading ? (
          <p className="admin-empty">Fotoğraflar yükleniyor...</p>
        ) : guestPhotos.length === 0 ? (
          <p className="admin-empty">Henüz misafir fotoğrafı yüklenmedi.</p>
        ) : (
          <div className="admin-photo-grid">
            {guestPhotos.map((photo) => (
              <article className="admin-photo-item" key={photo.id}>
                <img src={guestPhotoUrl(photo.storage_path)} alt={`${photo.guest_name} tarafından yüklenen fotoğraf`} loading="lazy" />
                <div className="admin-photo-info">
                  <div className="admin-photo-meta">
                    <strong>{photo.guest_name}</strong>
                    <span className={`admin-badge ${photo.status === "approved" ? "yes" : photo.status === "rejected" ? "no" : "pending"}`}>
                      {photo.status === "approved" ? "Yayında" : photo.status === "rejected" ? "Reddedildi" : "Onay Bekliyor"}
                    </span>
                  </div>
                  {photo.note && <p>{photo.note}</p>}
                  <time>{new Date(photo.created_at).toLocaleString("tr-TR")}</time>
                  <div className="admin-photo-actions">
                    {photo.status === "approved" ? (
                      <button type="button" onClick={() => updatePhotoStatus(photo, "pending")}>Yayından Kaldır</button>
                    ) : (
                      <button type="button" className="approve" onClick={() => updatePhotoStatus(photo, "approved")}>Onayla ve Yayınla</button>
                    )}
                    {photo.status === "pending" && (
                      <button type="button" className="reject" onClick={() => updatePhotoStatus(photo, "rejected")}>Reddet</button>
                    )}
                    {photo.status === "rejected" && (
                      <button type="button" onClick={() => updatePhotoStatus(photo, "pending")}>Tekrar İncele</button>
                    )}
                    <a href={guestPhotoUrl(photo.storage_path)} download target="_blank" rel="noreferrer">İndir</a>
                    <button type="button" className="delete" onClick={() => deleteGuestPhoto(photo)}>Sil</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}