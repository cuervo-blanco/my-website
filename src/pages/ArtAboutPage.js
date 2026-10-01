import { Navigate } from "react-router-dom";
import { getSiteRoute } from "../config/siteSections";

function ArtAboutPage() {
  return <Navigate to={getSiteRoute("art")} replace />;
}

export default ArtAboutPage;
