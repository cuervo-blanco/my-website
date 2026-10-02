import { Link } from "react-router-dom";

function Destination({ to, color, children }) {
  return <Link to={to} style={{ color: `var(--constellation-${color})` }}>{children}</Link>;
}

export default function WorkDestinations() {
  return (
    <nav className="work-hero__services" aria-label="Explore my work">
      <p>
        New York <Destination to="/#credits" color="mint">sound mixer</Destination>
        {" & "}<Destination to="/#credits" color="lilac">sound designer</Destination>
        {" for "}<Destination to="/#credits" color="gold">film</Destination>
        {" and "}<Destination to="/#live-credits" color="pink">theater</Destination>.
      </p>
      <p>
        <Destination to="/dev" color="green">Software developer</Destination>
        {", "}<Destination to="/dev#dsp-dictionary" color="gold">audio programmer</Destination>
        {" & "}<Destination to="/art" color="orange">animator</Destination>.
      </p>
      <Destination to="/contact" color="mint">Get in touch ↗</Destination>
    </nav>
  );
}
