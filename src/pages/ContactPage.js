import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import Contact from "../components/sections/Contact";
import { pageMetadata } from "../config/site";

export default function ContactPage() {
  return <><PageSeo {...pageMetadata.contact} /><main className="contact-page"><Contact compact standalone /></main><Footer /></>;
}
