import { liveCredits } from "../../data/liveCredits";
import "../../assets/styles/live-work.css";

const roleNames = { A1: "Lead audio engineer", A2: "Assistant audio engineer", TD: "Technical director", SD: "Sound designer" };
function Role({ children }) {
  return children.split(/\b(A1|A2|TD|SD)\b/g).map((part, index) => roleNames[part]
    ? <abbr key={index} title={roleNames[part]} aria-label={`${roleNames[part]} (${part})`}>{part}</abbr>
    : part);
}

function LiveCredits() {
  const withImages = liveCredits.filter((credit) => credit.image);
  const galleryOrder = ["Blooming in Dry Season", "Broken Snow", "Chita Rivera Awards 2026", "Amas 2026 Benefit: Bubbling Brown Sugar", "The Wash", "Cracked Open"];
  const galleryRank = (title) => galleryOrder.includes(title) ? galleryOrder.indexOf(title) : galleryOrder.length;
  const gallery = [...withImages].sort((a, b) => galleryRank(a.title) - galleryRank(b.title));
  const otherCredits = liveCredits.filter((credit) => !credit.image);

  return (
    <section id="live-credits" className="work-live work-page__shell" aria-labelledby="live-credits-heading">
      <h2 id="live-credits-heading">Live &amp; Theatre</h2>
      <div className="work-live__gallery">
        {gallery.map((credit) => (
          <article key={credit.title} className="work-live__image-credit">
            <a className={`work-live__image work-live__image--${credit.image.kind}`} href={credit.image.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${credit.title} — image source`}>
              <img src={credit.image.src} alt={credit.image.alt} width={credit.image.width} height={credit.image.height} loading="lazy" decoding="async" style={credit.image.position ? { objectPosition: credit.image.position } : undefined} />
            </a>
            <h3>{credit.title}</h3>
            <p><Role>{credit.roles.join(" · ")}</Role>{credit.venue ? ` · ${credit.venue}` : ""}</p>
          </article>
        ))}
      </div>
      <details className="work-live__sources">
        <summary>Image credits</summary>
        <ul>{gallery.map((credit) => <li key={credit.title}><a href={credit.image.sourceUrl} target="_blank" rel="noopener noreferrer">{credit.title} · {credit.image.credit}</a></li>)}</ul>
      </details>
      <ul className="work-live__credits">
        {otherCredits.map((credit) => (
          <li key={credit.title}>
            <h3>{credit.title}</h3>
            <p><Role>{credit.roles.join(" · ")}</Role>{credit.venue ? ` · ${credit.venue}` : ""}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LiveCredits;
