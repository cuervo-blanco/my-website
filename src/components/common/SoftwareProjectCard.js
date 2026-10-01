import { Link } from "react-router-dom";

function SoftwareProjectCard({
  title,
  description,
  status,
  technologies = [],
  href,
  ctaLabel,
}) {
  const isInternalLink = href?.startsWith("/");

  return (
    <article className="software-project-card">
      <div className="software-project-card-header">
        <h3>{title}</h3>
        {status && <p className="software-project-status">{status}</p>}
      </div>
      {description && <p className="software-project-description">{description}</p>}

      {technologies.length > 0 && (
        <ul className="software-project-technologies" aria-label={`${title} technologies`}>
          {technologies.map((technology) => (
            <li key={`${title}-${technology}`}>{technology}</li>
          ))}
        </ul>
      )}

      {href && ctaLabel && (
        isInternalLink ? (
          <Link className="software-project-link" to={href}>
            {ctaLabel}
          </Link>
        ) : (
          <a
            className="software-project-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctaLabel}
          </a>
        )
      )}
    </article>
  );
}

export default SoftwareProjectCard;
