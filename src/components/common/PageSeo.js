import { useEffect } from "react";
import { siteMetadata } from "../../config/site";

function upsertMeta({ attr, value, content }) {
  const existingNode = document.head.querySelector(`meta[${attr}="${value}"]`);

  if (!content) {
    if (existingNode) {
      existingNode.remove();
    }
    return;
  }

  let node = existingNode;

  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, value);
    document.head.appendChild(node);
  }

  node.setAttribute("content", content);
}

function upsertLink({ rel, href }) {
  if (!href) {
    return;
  }

  let node = document.head.querySelector(`link[rel="${rel}"]`);

  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", rel);
    document.head.appendChild(node);
  }

  node.setAttribute("href", href);
}

function upsertStructuredData(structuredData) {
  const existingNode = document.head.querySelector(
    'script[data-seo="structured-data"]'
  );

  if (!structuredData) {
    if (existingNode) {
      existingNode.remove();
    }
    return;
  }

  const node = existingNode || document.createElement("script");
  node.setAttribute("type", "application/ld+json");
  node.setAttribute("data-seo", "structured-data");
  node.textContent = JSON.stringify(structuredData);

  if (!existingNode) {
    document.head.appendChild(node);
  }
}

function toAbsoluteUrl(value) {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return new URL(value, siteMetadata.url).toString();
}

function formatKeywords(keywords) {
  if (!keywords) {
    return "";
  }

  return Array.isArray(keywords) ? keywords.join(", ") : keywords;
}

function PageSeo({
  title,
  description,
  path = "/",
  image = siteMetadata.defaultSocialImage,
  type = "website",
  robots = "index,follow",
  keywords,
  structuredData,
}) {
  useEffect(() => {
    const absoluteUrl = toAbsoluteUrl(path);
    const absoluteImageUrl = toAbsoluteUrl(image);
    const keywordContent = formatKeywords(keywords);

    document.title = title || siteMetadata.title;

    upsertMeta({
      attr: "name",
      value: "description",
      content: description || siteMetadata.description,
    });
    upsertMeta({
      attr: "name",
      value: "keywords",
      content: keywordContent,
    });
    upsertMeta({
      attr: "name",
      value: "author",
      content: siteMetadata.legalName,
    });
    upsertMeta({
      attr: "name",
      value: "robots",
      content: robots,
    });
    upsertMeta({
      attr: "name",
      value: "theme-color",
      content: siteMetadata.themeColor,
    });

    upsertMeta({
      attr: "property",
      value: "og:type",
      content: type,
    });
    upsertMeta({
      attr: "property",
      value: "og:title",
      content: title || siteMetadata.title,
    });
    upsertMeta({
      attr: "property",
      value: "og:description",
      content: description || siteMetadata.description,
    });
    upsertMeta({
      attr: "property",
      value: "og:url",
      content: absoluteUrl,
    });
    upsertMeta({
      attr: "property",
      value: "og:image",
      content: absoluteImageUrl,
    });
    upsertMeta({
      attr: "property",
      value: "og:image:alt",
      content: siteMetadata.socialImageAlt,
    });
    upsertMeta({
      attr: "property",
      value: "og:site_name",
      content: siteMetadata.siteName,
    });
    upsertMeta({
      attr: "property",
      value: "og:locale",
      content: "en_US",
    });

    upsertMeta({
      attr: "name",
      value: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta({
      attr: "name",
      value: "twitter:title",
      content: title || siteMetadata.title,
    });
    upsertMeta({
      attr: "name",
      value: "twitter:description",
      content: description || siteMetadata.description,
    });
    upsertMeta({
      attr: "name",
      value: "twitter:image",
      content: absoluteImageUrl,
    });
    upsertMeta({
      attr: "name",
      value: "twitter:image:alt",
      content: siteMetadata.socialImageAlt,
    });

    upsertLink({
      rel: "canonical",
      href: absoluteUrl,
    });

    upsertStructuredData(structuredData);
  }, [description, image, keywords, path, robots, structuredData, title, type]);

  return null;
}

export default PageSeo;
