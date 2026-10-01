import { filmCredits, getFilmImdbUrl, imdbProfileUrl } from "../../data/film";
import { getFilmArtwork } from "../../data/filmArtwork";
import { legacyScreenCredits } from "../../data/screenCredits";
import "../../assets/styles/film.css";

const normalizeTitle = (title) => title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+\d{4}$/, "").toLowerCase();
const additionalScreenWork = legacyScreenCredits.filter((item) => item.image && !filmCredits.some((credit) => normalizeTitle(credit.title) === normalizeTitle(item.title)));

function FilmLink({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

function CreditRoles({ credit, featured }) {
  const leadingRoles = credit.roles.slice(0, featured ? 2 : 1);
  const sourceRoles = legacyScreenCredits.filter((item) => normalizeTitle(item.title) === normalizeTitle(credit.title)).flatMap((item) => item.roles);
  const moreRoles = [...new Set([...credit.roles.slice(leadingRoles.length), ...(credit.additionalRoles || []), ...sourceRoles])].filter((role) => !leadingRoles.includes(role));
  return (
    <>
      <p className="film-work__roles">{leadingRoles.join(" · ")}</p>
      {moreRoles.length ? (
        <details className="film-work__more">
          <summary>Credits</summary>
          <p>{moreRoles.join(" · ")}</p>
        </details>
      ) : null}
    </>
  );
}

function FilmCard({ credit, featured = false }) {
  const image = getFilmArtwork(credit);
  const href = credit.id ? getFilmImdbUrl(credit) : undefined;
  const artwork = <img src={image.src} alt={image.alt} loading="lazy" width="380" height="562" />;
  const title = credit.title.replace(/\s+\d{4}$/, "");

  return (
    <article className={`film-work__card${featured ? " film-work__card--featured" : ""}`} data-film-title={title}>
      {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="film-work__artwork">{artwork}</a> : <div className="film-work__artwork">{artwork}</div>}
      <h3>{href ? <FilmLink href={href}>{title}</FilmLink> : title}</h3>
      {credit.forthcoming ? <p className="film-work__stage">{credit.stage}</p> : credit.year ? <p className="film-work__meta">{credit.year}</p> : null}
      <CreditRoles credit={credit} featured={featured} />
      {credit.mediaLinks?.length ? (
        <div className="film-work__links">
          {credit.mediaLinks.map((media) => <FilmLink key={media.href} href={media.href}>{media.label}</FilmLink>)}
        </div>
      ) : null}
    </article>
  );
}

function FilmCredits() {
  const featured = filmCredits.filter((credit) => credit.featured);
  const otherWork = [...filmCredits.filter((credit) => !credit.featured), ...additionalScreenWork];

  return (
    <section id="credits" className="film-work" aria-labelledby="film-credits-heading">
      <div className="film-work__shell">
        <header className="film-work__header">
          <h2 id="film-credits-heading">Film</h2>
          <FilmLink href={imdbProfileUrl}>IMDb credits</FilmLink>
        </header>
        <div className="film-work__featured" aria-label="Featured films">
          {featured.map((credit) => <FilmCard key={credit.id} credit={credit} featured />)}
        </div>
        <div className="film-work__collection" aria-label="More screen work">
          {otherWork.map((credit) => <FilmCard key={credit.id || credit.title} credit={credit} />)}
        </div>
      </div>
    </section>
  );
}

export default FilmCredits;
