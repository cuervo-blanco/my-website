import { companyGroups } from "../../data/clients";
import "../../assets/styles/companies.css";

function CompanyMark({ company }) {
  if (company.logo) {
    return <img src={company.logo} className={company.logoTone === "light" ? "company-light-logo" : undefined} data-logo-backdrop={company.logoBackdrop} alt={company.name} loading="lazy" decoding="async" />;
  }

  if (company.icon) {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={company.name} focusable="false">
        <path d={company.icon.path} fill={`#${company.icon.hex}`} />
      </svg>
    );
  }

  return null;
}

function RecentClients({ showHeading = true, compact = false }) {
  const groups = compact
    ? [{ id: "work-companies", companies: companyGroups.flatMap((group) => group.companies) }]
    : companyGroups;
  return (
    <section
      id="recent-clients"
      className="company-directory"
      aria-labelledby={showHeading ? "recent-clients-heading" : undefined}
      aria-label={showHeading ? undefined : "Companies"}
    >
      <div className="company-directory-shell surface-panel">
        {showHeading ? <header className="studio-directory-header"><p className="studio-kicker">02 / In good company</p><h2 id="recent-clients-heading">Companies I’ve Worked With &amp; Still Work With</h2><p className="studio-section-intro">A few of the teams on the other side of the headphones.</p></header> : null}
        {groups.map((group) => (
          <div className="company-group" key={group.id}>
            {group.title ? <h3 id={group.id}>{group.title}</h3> : null}
            <ul className="company-list" aria-labelledby={group.title ? group.id : undefined} aria-label={group.title ? undefined : "Companies"}>
              {group.companies.map((company) => {
                const hasLogo = Boolean(company.logo || company.icon);

                return (
                  <li className="company-item" key={company.name}>
                    {hasLogo ? (
                      <div className="company-mark">
                        <CompanyMark company={company} />
                      </div>
                    ) : null}
                    {!hasLogo ? <span className="company-wordmark">{company.name}</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentClients;
