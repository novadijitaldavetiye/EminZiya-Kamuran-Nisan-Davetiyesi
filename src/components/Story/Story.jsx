import "./Story.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;

const StoryDivider = () => (
  <div className="story-ornament" aria-hidden="true">
    <span />
    <i>✦</i>
    <span />
  </div>
);

export default function Story() {
  const goToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="story"
      className="story-scene"
      style={{ backgroundImage: `url(${bg("story-light.png")} )` }}
    >
      <div className="story-bg-motion" />
      <div className="story-overlay" />

      <div className="story-content">
        <header className="story-heading">
          <p className="story-eyebrow">Nişanımız</p>
          <h2>Bir Ömre<br />İlk Adım</h2>
          <StoryDivider />
          <p className="story-intro">
            Bugün, sevgimizi ailelerimizin ve sevdiklerimizin huzurunda bir sözle
            taçlandırıyoruz. Bu anlamlı başlangıcın mutluluğunu sizlerle paylaşmaktan
            büyük heyecan duyuyoruz.
          </p>
        </header>

        <div className="story-timeline">
          <article className="story-card">
            <p className="story-card-kicker">İlk Adım</p>
            <h3>Aynı Hayale</h3>
            <StoryDivider />
            <p>
              Hayat yolculuğunda birlikte yürümeye karar verdiğimiz bu özel an,
              en güzel hikâyemizin başlangıcı oldu.
            </p>
          </article>

          <article className="story-card">
            <p className="story-card-kicker">Bir Söz</p>
            <h3>Sevgiyle</h3>
            <StoryDivider />
            <p>
              Kalplerimizi birleştiren sevgimizi, ailelerimizin huzurunda verdiğimiz
              anlamlı bir sözle taçlandırıyoruz.
            </p>
          </article>

          <article className="story-card">
            <p className="story-card-kicker">Yeni Bir Sayfa</p>
            <h3>Birlikte</h3>
            <StoryDivider />
            <p>
              Mutluluğumuzu sizlerle paylaşmak, bu günü unutulmaz kılacak
              en değerli hatıramız olacak.
            </p>
          </article>
        </div>

        <button type="button" className="story-gallery-button" onClick={goToGallery}>
          <span className="story-gallery-line" aria-hidden="true" />
          <span>Anılarımıza Geç</span>
        </button>
      </div>
    </section>
  );
}
