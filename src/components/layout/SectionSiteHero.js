import Button from "../common/Button";

function SectionSiteHero({
  eyebrow,
  title,
  subtitle,
  intro,
  actions = [],
}) {
  return (
    <section className="section-site-hero">
      <div className="section-site-shell">
        {eyebrow ? <p className="section-site-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="section-site-subtitle">{subtitle}</p> : null}
        {intro ? <p className="section-site-intro">{intro}</p> : null}
        {actions.length ? (
          <div className="section-site-actions">
            {actions.map((action) => (
              <Button
                key={action.label}
                buttonText={action.label}
                buttonLink={action.to}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default SectionSiteHero;
