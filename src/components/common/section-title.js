function Title(props) {
  const HeadingTag = props.as || "h2";

  return (
    <div
      style={{ backgroundColor: props.color, border: props.border }}
      className="section-title"
    >
      <HeadingTag style={{ color: props.fontColor }}>{props.title}</HeadingTag>
    </div>
  );
}

export default Title;

// WHAT_DO_I_DO_?.wav
