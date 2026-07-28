import "./SectionTitle.css";

export default function SectionTitle({ eyebrow, title, text }) {
  const titleParts = title?.split(" & ");

  return (
    <div className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && (
        <h2>
          {titleParts.length === 2 ? (
            <>
              <span className="title-name">{titleParts[0]}</span>
              <span className="title-ampersand">&amp;</span>
              <span className="title-name">{titleParts[1]}</span>
            </>
          ) : (
            title
          )}
        </h2>
      )}
      {text && <p className="section-text">{text}</p>}
    </div>
  );
}
