import { useState } from "react";
import { filmCredits, getFilmImdbUrl, imdbProfileUrl } from "../../data/film";
import { getFilmArtwork } from "../../data/filmArtwork";
import { legacyScreenCredits } from "../../data/screenCredits";
import "../../assets/styles/film.css";

const normalizeSearch = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const normalizeTitle = (title) => normalizeSearch(title).replace(/\s+\d{4}$/, "");
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const matches = (credit) => {
    const sourceRoles = legacyScreenCredits.filter((item) => normalizeTitle(item.title) === normalizeTitle(credit.title)).flatMap((item) => item.roles);
    const searchable = normalizeSearch([credit.title, ...credit.roles, ...sourceRoles, ...(credit.additionalRoles || []), credit.year, credit.type, credit.stage].filter(Boolean).join(" "));
    const roleText = [...credit.roles, ...sourceRoles].join(" ").toLowerCase();
    const inCategory = category === "all" || (category === "production" ? /production|recordist|boom|sound mixer|sound record/.test(roleText) : /design|foley|compos|editing|editor|mixing|re-record/.test(roleText));
    return inCategory && normalizeSearch(query.trim()).split(/\s+/).every((term) => searchable.includes(term));
  };
  const featured = filmCredits.filter((credit) => credit.featured && matches(credit));
  const otherWork = [...filmCredits.filter((credit) => !credit.featured), ...additionalScreenWork].filter(matches);
  const hasFilter = query.trim() !== "" || category !== "all";

  return (
    <section id="credits" className="film-work" aria-labelledby="film-credits-heading">
      <div className="film-work__shell surface-panel">
        <header className="film-work__header">
          <div><p className="studio-kicker">01 / Film credits</p><h2 id="film-credits-heading">Film</h2><p className="studio-section-intro">Production sound and post-production credits.</p></div>
          <FilmLink href={imdbProfileUrl}>IMDb credits</FilmLink>
        </header>
        <div className="studio-work-filter">
          <div className="studio-filter-tabs" aria-label="Filter film credits">
            {[["all", "All work"], ["production", "Production sound"], ["post", "Post & sound design"]].map(([value, label]) => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}
          </div>
          <label className="studio-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search film credits" placeholder="Find a film, role, or year…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        {hasFilter ? <p className="studio-result-count" role="status">{featured.length + otherWork.length} matching {featured.length + otherWork.length === 1 ? "project" : "projects"} <button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Clear filters</button></p> : null}
        <div className="film-work__featured" aria-label="Featured films">
          {featured.map((credit) => <FilmCard key={credit.id} credit={credit} featured />)}
        </div>
        <div className={`film-work__collection${!featured.length ? " film-work__collection--only" : ""}`} aria-label="More screen work">
          {otherWork.map((credit) => <FilmCard key={credit.id || credit.title} credit={credit} />)}
        </div>
        {featured.length + otherWork.length === 0 ? <p className="studio-empty">No projects found. Try a title, a year, or a role such as Foley.</p> : null}
      </div>
    </section>
  );
}

export default FilmCredits;
