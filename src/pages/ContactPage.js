import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import Contact from "../components/sections/Contact";
import { pageMetadata } from "../config/site";
import { contactStructuredData } from "../config/prerender";

export default function ContactPage() {
  return <><PageSeo {...pageMetadata.contact} structuredData={contactStructuredData} /><main className="contact-page"><Contact compact standalone /></main><Footer /></>;
}
