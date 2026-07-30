import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const sessionKey = "rsvp_admin_session";

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

  useEffect(() => {
    if (session) loadResponses(session);
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
      await loadResponses(data);
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(sessionKey);
    setSession(null);
    setResponses([]);
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
          <button type="button" onClick={() => loadResponses()} disabled={loading}>Yenile</button>
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
    </main>
  );
}