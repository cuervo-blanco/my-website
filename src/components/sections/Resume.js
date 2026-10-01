import { siteMetadata } from "../../config/site";

function ResumeButton() {
  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <a
        href={siteMetadata.resumePath}
        target="_blank"
        rel="noopener noreferrer"
        className="resume-button"
      >
        Resume
      </a>
    </div>
  );
}

export default ResumeButton;
