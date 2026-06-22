import Title from "../common/section-title";
import { serviceCategories, servicesIntro } from "../../data/services";

function Services() {
  return (
    <section id="services" aria-labelledby="services-heading">
      <div id="services-header"></div>
      <Title title="Work" as="h2" />
      <p id="services-heading">{servicesIntro}</p>
      <div id="services-container">
        {serviceCategories.map((category) => (
          <article key={category.title} className="services-block">
            <h3>{category.title}</h3>
            <hr />
            <ul className="services-list">
              {category.items.map((item) => (
                <li key={`${category.title}-${item.title}`}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <>
                      <span className="project-title">{item.title}</span>
                      {item.detail && (
                        <span className="director-label">{" "}— {item.detail}</span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Services;
