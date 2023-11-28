import React from "react";

function Title(props) {
  return (
    <div
      style={{ backgroundColor: props.color, border: props.border }}
      className="section-title"
    >
      <h1 style={{ color: props.fontColor }}>{props.title}</h1>
    </div>
  );
}

export default Title;

// WHAT_DO_I_DO_?.wav
