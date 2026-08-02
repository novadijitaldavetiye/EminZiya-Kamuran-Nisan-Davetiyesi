import "./Story.css";
import GuestPhotos from "../../sections/Gallery/GuestPhotos";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;
const photo = (file) => `${import.meta.env.BASE_URL}images/gallery/${file}`;

const StoryDivider = () => (
  <div className="story-ornament" aria-hidden="true">
    <span />
    <i>♥</i>
    <span />
  </div>
);

const storyCards = [
  {
    icon: "❀",
    kicker: "İlk Adım",
    title: "Aynı Hayale",
    text: "En güzel hikâyemizin başlangıcı.",
    image: "photo1.jpeg",
    imageAlt: "Kamuran ve Emin Ziya'nın birlikte bir anısı",
  },
  {
    icon: "◎",
    kicker: "Bir Söz",
    title: "Sevgiyle",
    text: "Sevgimizi anlamlı bir sözle taçlandırıyoruz.",
    image: "photo2.jpeg",
    imageAlt: "Kamuran ve Emin Ziya'nın özel bir anısı",
    reverse: true,
  },
  {
    icon: "♡",
    kicker: "Yeni Bir Sayfa",
    title: "Birlikte",
    text: "Bu mutluluğu sizlerle paylaşıyoruz.",
    image: "photo3.jpeg",
    imageAlt: "Kamuran ve Emin Ziya'nın beraber bir anısı",
  },
];

export default function Story() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <section
        id="story"
        className="story-scene"
        style={{ backgroundImage: `url(${bg("story-light.png")})` }}
      >
        <div className="story-bg-motion" />
        <div className="story-overlay" />

        <div className="story-content">
          <header className="story-heading">
            <h2>Hikâyemiz</h2>
            <StoryDivider />
          </header>

          <div className="story-timeline">
            {storyCards.map((card) => (
              <article
                className={`story-card${card.reverse ? " story-card--reverse" : ""}`}
                key={card.title}
              >
                <figure className="story-card-photo">
                  <img src={photo(card.image)} alt={card.imageAlt} loading="lazy" />
                </figure>

                <div className="story-card-copy">
                  <span className="story-card-icon" aria-hidden="true">{card.icon}</span>
                  <p className="story-card-kicker">{card.kicker}</p>
                  <h3>{card.title}</h3>
                  <StoryDivider />
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>

          <button type="button" className="story-next" onClick={() => scrollTo("guest-photo-upload")}>
            <span className="story-next-line" aria-hidden="true" />
            <span>Anını Paylaş</span>
          </button>
        </div>
      </section>

      <section
        id="guest-photo-upload"
        className="story-guest-section"
        style={{ backgroundImage: `url(${bg("story-light.png")})` }}
      >
        <div className="story-guest-overlay" />
        <div className="story-guest-content">
          <GuestPhotos />

          <button type="button" className="story-guest-next" onClick={() => scrollTo("event")}>
            <span className="story-guest-line" aria-hidden="true" />
            <span>Nişan Bilgilerini Gör</span>
          </button>
        </div>
      </section>
    </>
  );
}