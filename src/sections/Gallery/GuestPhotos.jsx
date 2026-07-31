import { useEffect, useMemo, useRef, useState } from "react";
import "./GuestPhotos.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const bucketName = "guest-photos";
const maxFiles = 5;
const maxFileSize = 8 * 1024 * 1024;
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

const publicPhotoUrl = (path) =>
  `${supabaseUrl}/storage/v1/object/public/${bucketName}/${encodeURIComponent(path).replaceAll("%2F", "/")}`;

const safeExtension = (file) => {
  const byType = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  return byType[file.type] || "jpg";
};

export default function GuestPhotos() {
  const inputRef = useRef(null);
  const [approvedPhotos, setApprovedPhotos] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) return;

    fetch(
      `${supabaseUrl}/rest/v1/guest_photos?select=id,guest_name,note,storage_path,created_at&status=eq.approved&order=created_at.desc&limit=30`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
    )
      .then((response) => (response.ok ? response.json() : []))
      .then(setApprovedPhotos)
      .catch(() => setApprovedPhotos([]));
  }, []);

  const chooseFiles = (event) => {
    const selected = Array.from(event.target.files || []).slice(0, maxFiles);
    const invalid = selected.find((file) => !acceptedTypes.includes(file.type) || file.size > maxFileSize);

    if (invalid) {
      setFiles([]);
      setStatus("error");
      setMessage("Lütfen JPG, PNG veya WEBP biçiminde ve 8 MB'dan küçük fotoğraflar seçin.");
      return;
    }

    setFiles(selected);
    setStatus("idle");
    setMessage("");
  };

  const uploadPhoto = async (file, index) => {
    const photoId = crypto.randomUUID();
    const path = `${new Date().toISOString().slice(0, 10)}/${photoId}-${index}.${safeExtension(file)}`;
    const upload = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${path}`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: file,
    });

    if (!upload.ok) throw new Error("Fotoğraf yüklenemedi.");

    const record = await fetch(`${supabaseUrl}/rest/v1/guest_photos`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        guest_name: guestName.trim(),
        note: note.trim() || null,
        storage_path: path,
        status: "pending",
      }),
    });

    if (!record.ok) throw new Error("Fotoğraf kaydı oluşturulamadı.");
  };

  const submitPhotos = async (event) => {
    event.preventDefault();
    if (!guestName.trim() || files.length === 0 || status === "loading") return;

    if (!supabaseUrl || !supabaseKey) {
      setStatus("error");
      setMessage("Fotoğraf servisi şu anda kullanılamıyor.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      for (let index = 0; index < files.length; index += 1) {
        await uploadPhoto(files[index], index);
      }
      setStatus("success");
      setMessage("Fotoğraflarınız bize ulaştı. Onaylandıktan sonra galeride görünecek.");
      setGuestName("");
      setNote("");
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Yükleme tamamlanamadı. Lütfen tekrar deneyin.");
    }
  };

  return (
    <section className="guest-photos" aria-labelledby="guest-photos-title">
      <div className="guest-photos-heading">
        <p>Bu Geceye Senin Gözünden</p>
        <h3 id="guest-photos-title">Anını Paylaş</h3>
        <span aria-hidden="true" />
        <p className="guest-photos-lead">
          Çektiğiniz en güzel kareleri bizimle paylaşın; bu özel gecenin anıları birlikte çoğalsın.
        </p>
      </div>

      {approvedPhotos.length > 0 && (
        <div className="guest-approved-gallery" aria-label="Misafirlerimizin paylaştığı fotoğraflar">
          {approvedPhotos.map((photo) => (
            <figure key={photo.id}>
              <img src={publicPhotoUrl(photo.storage_path)} alt={`${photo.guest_name} tarafından paylaşılan anı`} loading="lazy" />
              <figcaption>
                <strong>{photo.guest_name}</strong>
                {photo.note && <span>{photo.note}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <form className="guest-upload-card" onSubmit={submitPhotos}>
        <label>
          <span>Adınız</span>
          <input
            type="text"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            maxLength="70"
            placeholder="Adınız ve soyadınız"
            disabled={status === "loading"}
            required
          />
        </label>

        <label>
          <span>Kısa Not <small>(isteğe bağlı)</small></span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength="180"
            placeholder="Bu güzel ana küçük bir not bırakın..."
            disabled={status === "loading"}
          />
        </label>

        <label className="guest-file-picker">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={chooseFiles}
            disabled={status === "loading"}
          />
          <span className="guest-file-icon" aria-hidden="true">＋</span>
          <strong>{files.length ? `${files.length} fotoğraf seçildi` : "Fotoğrafları Seç"}</strong>
          <small>En fazla 5 fotoğraf · Her biri en fazla 8 MB</small>
        </label>

        {previews.length > 0 && (
          <div className="guest-photo-previews">
            {previews.map((preview) => (
              <img key={`${preview.file.name}-${preview.file.lastModified}`} src={preview.url} alt="Yüklenecek fotoğraf önizlemesi" />
            ))}
          </div>
        )}

        <label className="guest-consent">
          <input type="checkbox" required disabled={status === "loading"} />
          <span>Bu fotoğrafları çiftle paylaşmaya ve onaylanırsa davetiye galerisinde gösterilmesine izin veriyorum.</span>
        </label>

        <button type="submit" disabled={!guestName.trim() || files.length === 0 || status === "loading"}>
          {status === "loading" ? "Fotoğraflar Gönderiliyor..." : "Anılarımızı Paylaş"}
        </button>

        {message && <p className={`guest-upload-message ${status}`} role="status">{message}</p>}
      </form>
    </section>
  );
}