import "./Gallery.css";

export default function Gallery() {
  const galleryBackground = `url(${import.meta.env.BASE_URL}images/backgrounds/gallery1.jpg)`;
  const goToPhotos = () => {
    document.getElementById("gallery-photos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const goToEvent = () => {
    document.getElementById("event")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* GALERİ GİRİŞİ */}
      <section
        id="gallery"
        className="gallery-section"
        style={{ "--gallery-background": galleryBackground }}
      >
        <div className="gallery-overlay" />

        <div className="gallery-content">
          <p className="gallery-eyebrow">Anılarımız</p>

          <h2>Galeri</h2>

          <p className="gallery-text">
            Birlikte biriktirdiğimiz en özel
            anlardan küçük bir seçki.
          </p>

          <div className="gallery-next" onClick={goToPhotos}>
            <div className="gallery-line" />
            <p>Fotoğraflara Geç</p>
          </div>
        </div>
      </section>

      {/* FOTOĞRAFLAR */}
      <section
        id="gallery-photos"
        className="gallery-photos"
        style={{ "--gallery-background": galleryBackground }}
      >
        <div className="gallery-photos-content">

          <div className="gallery-grid">

            <div className="gallery-photo">
              <img
                src={`${import.meta.env.BASE_URL}images/gallery/photo1.jpeg`}
                alt=""
              />
            </div>

            <div className="gallery-photo">
              <img
                src={`${import.meta.env.BASE_URL}images/gallery/photo2.jpeg`}
                alt=""
              />
            </div>

            <div className="gallery-photo">
              <img
                src={`${import.meta.env.BASE_URL}images/gallery/photo3.jpeg`}
                alt=""
              />
            </div>

            {/* SON FOTOĞRAFIN HEMEN ALTINDA */}
            <div className="gallery-next gallery-event-next" onClick={goToEvent}>
              <div className="gallery-line" />
              <p>NİŞAN BİLGİLERİNİ GÖR</p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
