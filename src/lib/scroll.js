export function scrollToTop(behavior = "auto") {
  if (
    typeof navigator !== "undefined" &&
    /jsdom/i.test(navigator.userAgent || "")
  ) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior });
}

export function scrollToElementById(elementId, options = {}, attempt = 0) {
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({
      behavior: options.behavior || "smooth",
      block: options.block || "start",
    });
    return;
  }

  if (attempt < 12) {
    window.setTimeout(() => {
      scrollToElementById(elementId, options, attempt + 1);
    }, 100);
  }
}
