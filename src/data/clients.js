import { siCocacola, siGoldmansachs, siPantheon, siReddit } from "simple-icons";
import amasMusicalTheatreLogo from "../assets/img/client-logos/amas-musical-theatre.png";
import cpaTheatricalsLogo from "../assets/img/client-logos/cpa-theatricals.png";
import dwightSchoolLogo from "../assets/img/client-logos/dwight-school.svg";
import mccabeEventsLogo from "../assets/img/client-logos/mccabe-events.png";
import mizuhoLogo from "../assets/img/client-logos/mizuho.svg";
import newFederalTheatreLogo from "../assets/img/client-logos/new-federal-theatre.png";
import schoolAtColumbiaLogo from "../assets/img/client-logos/school-at-columbia.png";
import sdnBroadcastLogo from "../assets/img/client-logos/sdn-broadcast.png";
import subwayLogo from "../assets/img/client-logos/subway.svg";
import youngPeoplesChorusLogo from "../assets/img/client-logos/young-peoples-chorus.png";
import encoreLogo from "../assets/img/client-logos/encore.png";
import creativeTechnologyLogo from "../assets/img/client-logos/creative-technology.png";
import blackstoneLogo from "../assets/img/client-logos/blackstone.png";
import oracleLogo from "../assets/img/client-logos/oracle.png";
import dataikuLogo from "../assets/img/client-logos/dataiku.png";

// Add a company to either list below. Only its name is required:
// { name: "New Company" }
// Add an optional imported image or public image path to show its logo:
// { name: "New Company", logo: "/images/new-company.svg" }
export const companyGroups = [
  {
    id: "production-partners",
    title: "Production partners",
    companies: [
      { name: "SDN Broadcast", logo: sdnBroadcastLogo, logoTone: "light" },
      { name: "McCabe Event Services", logo: mccabeEventsLogo },
      { name: "Encore", logo: encoreLogo },
      { name: "Creative Technology", logo: creativeTechnologyLogo },
      { name: "New Federal Theatre", logo: newFederalTheatreLogo, logoTone: "light" },
      { name: "CPA Theatricals", logo: cpaTheatricalsLogo },
      { name: "Amas Musical Theatre", logo: amasMusicalTheatreLogo },
    ],
  },
  {
    id: "clients-institutions",
    title: "Clients & institutions",
    companies: [
      { name: "Blackstone", logo: blackstoneLogo },
      { name: "Dataiku", logo: dataikuLogo },
      { name: "Oracle", logo: oracleLogo },
      { name: "Reddit", icon: siReddit },
      { name: "Subway", logo: subwayLogo },
      { name: "Coca-Cola", icon: siCocacola },
      { name: "Pantheon", icon: siPantheon },
      { name: "Mizuho", logo: mizuhoLogo, logoBackdrop: "light" },
      { name: "Goldman Sachs", icon: siGoldmansachs },
      { name: "Dwight School", logo: dwightSchoolLogo, logoBackdrop: "light" },
      { name: "The School at Columbia University", logo: schoolAtColumbiaLogo, logoBackdrop: "light" },
      { name: "Young People's Chorus", logo: youngPeoplesChorusLogo, logoBackdrop: "light" },
    ],
  },
];
