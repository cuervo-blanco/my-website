import React from "react";

function Button({ buttonText, buttonLink }) {
  const handleClick = (e) => {
    e.preventDefault();
    const section = document.getElementById(buttonLink.substring(1)); // Assuming buttonLink is like '#contact'
    console.log(section);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="button-cta">
      <a href={buttonLink} onClick={handleClick}>
        <p>{buttonText}</p>
        <div id="greater-than">
          <p>&gt;</p>
        </div>
      </a>
    </div>
  );
}

export default Button;
