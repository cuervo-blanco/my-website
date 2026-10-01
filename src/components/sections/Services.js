import Title from "../common/section-title";
import { serviceCategories, servicesIntro } from "../../data/services";

function Services({
  title = "Work",
  intro = servicesIntro,
  categories = serviceCategories,
}) {
  return (
    <section id="services" aria-labelledby="services-heading">
      <div id="services-header"></div>
      <Title title={title} as="h2" />
      <p id="services-heading">{intro}</p>
      <div id="services-container">
        {categories.map((category) => (
          <article key={category.title} className="services-block">
            <h3>{category.title}</h3>
            {category.description && (
              <p className="services-copy">{category.description}</p>
            )}
            <hr />
            <ul className="services-list">
              {category.items.map((item) => (
                <li key={`${category.title}-${item.title}`}>
                  {item.href ? (
                    <>
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {item.title}
                      </a>
                      {item.detail && (
                        <span className="item-detail">{" "}— {item.detail}</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="project-title">{item.title}</span>
                      {item.detail && (
                        <span className="item-detail">{" "}— {item.detail}</span>
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
