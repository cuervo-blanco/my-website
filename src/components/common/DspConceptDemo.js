import { useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { dspDemos, defaultDemoValues } from "../../data/dspDemos";
import { dspBrief } from "../../data/dspBrief";
import "../../assets/styles/dsp-concepts.css";

const plot = { left: 58, right: 540, top: 24, bottom: 192 };

function tickLabel(value) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1000) return `${Number((value / 1000).toPrecision(3))}k`;
  return String(Number(value.toPrecision(3)));
}

function levelTicks(min, max) {
  const approximateStep = (max - min) / 4;
  const unit = 10 ** Math.floor(Math.log10(approximateStep));
  const step = [1, 2, 5, 10].find((factor) => factor * unit >= approximateStep) * unit;
  const start = Math.ceil(min / step) * step;
  return Array.from({ length: Math.floor((max - start) / step) + 1 }, (_, index) => Number((start + index * step).toPrecision(12)));
}

function DemoChart({ chart, id, reduceMotion }) {
  const [xMin, xMax] = chart.xDomain;
  const [yMin, yMax] = chart.yDomain;
  const xPosition = (value) => {
    const progress = chart.xScale === "log"
      ? Math.log(value / xMin) / Math.log(xMax / xMin)
      : (value - xMin) / (xMax - xMin);
    return plot.left + progress * (plot.right - plot.left);
  };
  const yPosition = (value) => plot.bottom - (value - yMin) / (yMax - yMin) * (plot.bottom - plot.top);
  const xTicks = chart.xTicks || [xMin, chart.xScale === "log" ? Math.sqrt(xMin * xMax) : (xMin + xMax) / 2, xMax];
  const yTicks = chart.yTicks || levelTicks(yMin, yMax);
  const transition = { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" };
  const path = (points) => points.map(([x, y], index) => `${index ? "L" : "M"}${xPosition(x).toFixed(2)},${yPosition(y).toFixed(2)}`).join(" ");
  const series = [...(chart.lines || []), ...(chart.markers || [])];
  const legend = series.filter((line, index) => series.findIndex((other) => other.label === line.label && other.style === line.style) === index);

  return (
    <div className="dsp-concept-chart">
      <p className="dsp-concept-chart-title">{chart.title}</p>
      <div className="dsp-demo-legend" aria-hidden="true">
        {legend.map((line) => <span key={`${line.label}-${line.style}`} className={`dsp-demo-${line.style}-key`}>{line.label}</span>)}
      </div>
      <svg viewBox="0 0 560 242" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{chart.title}</title>
        <desc id={`${id}-description`}>{chart.description} Horizontal axis: {chart.xLabel}. Vertical axis: {chart.yLabel}.</desc>
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x={plot.left} y={plot.top - 3} width={plot.right - plot.left} height={plot.bottom - plot.top + 6} />
          </clipPath>
        </defs>
        {yTicks.map((value) => (
          <g key={value}>
            <path className="dsp-demo-grid" d={`M${plot.left} ${yPosition(value)}H${plot.right}`} />
            <text className="dsp-demo-axis-label" textAnchor="end" x={plot.left - 10} y={yPosition(value) + 4}>{tickLabel(value)}</text>
          </g>
        ))}
        {xTicks.map((value) => (
          <g key={value}>
            <path className="dsp-demo-grid" d={`M${xPosition(value)} ${plot.top}V${plot.bottom}`} />
            <text className="dsp-demo-axis-label" textAnchor="middle" x={xPosition(value)} y={plot.bottom + 17}>{tickLabel(value)}</text>
          </g>
        ))}
        <path className="dsp-demo-axis" d={`M${plot.left} ${plot.top}V${plot.bottom}H${plot.right}`} />
        {yMin < 0 && yMax > 0 ? <path className="dsp-demo-axis" d={`M${plot.left} ${yPosition(0)}H${plot.right}`} /> : null}
        <text className="dsp-demo-axis-label" x={plot.left} y="12">{chart.yLabel}</text>
        <text className="dsp-demo-axis-label" textAnchor="middle" x={(plot.left + plot.right) / 2} y="232">{chart.xLabel}</text>
        <g clipPath={`url(#${id}-clip)`}>
          {(chart.lines || []).map((line, index) => (
            <motion.path
              key={`${line.label}-${index}`}
              className={`dsp-concept-line dsp-concept-${line.style}`}
              strokeDasharray={line.dashed ? "4 4" : undefined}
              initial={false}
              animate={{ d: path(line.points) }}
              transition={transition}
            />
          ))}
          {(chart.markers || []).map((series, seriesIndex) => (
            <g key={`${series.label}-${seriesIndex}`} className={`dsp-concept-markers dsp-concept-${series.style}`}>
              {series.points.map(([x, y], index) => (
                <g key={index}>
                  {series.stems ? <motion.path initial={false} animate={{ d: `M${xPosition(x)},${yPosition(0)}L${xPosition(x)},${yPosition(y)}` }} transition={transition} /> : null}
                  <motion.circle r="3" initial={false} animate={{ cx: xPosition(x), cy: yPosition(y) }} transition={transition} />
                </g>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function DspConceptDemo({ topicId, headingLevel = 5, compact = false, title, description }) {
  const definition = dspDemos[topicId];
  const [values, setValues] = useState(() => defaultDemoValues(definition));
  const id = useId();
  const reduceMotion = useReducedMotion();
  const model = useMemo(() => definition.compute(values), [definition, values]);
  const Heading = `h${headingLevel}`;
  const brief = dspBrief[topicId];
  const readout = compact && brief?.readout ? brief.readout(values, model) : model.readout.replace(/\.$/, "");
  const note = compact && brief?.note ? brief.note : model.note;

  return (
    <figure className={`dsp-gain-demo dsp-concept-demo${compact ? " dsp-demo-compact" : ""}`} data-dsp-concept={topicId} aria-labelledby={`${id}-title`}>
      <figcaption>
        <Heading id={`${id}-title`}>{title || definition.title}</Heading>
        <p>{description || (compact ? brief?.sentence : undefined) || definition.description}</p>
      </figcaption>
      <div className="dsp-concept-charts">
        {model.charts.map((chart, index) => <DemoChart key={index} chart={chart} id={`${id}-chart-${index}`} reduceMotion={reduceMotion} />)}
      </div>
      <div className="dsp-concept-controls">
        {definition.controls.map((control) => {
          const controlId = `${id}-${control.key}`;
          const value = values[control.key];
          const formatted = control.format ? control.format(value) : String(value);
          return (
            <div className="dsp-demo-control" key={control.key}>
              <label htmlFor={controlId}>{control.label}</label>
              {!control.options ? <output htmlFor={controlId}>{formatted}</output> : null}
              {control.options ? (
                <select id={controlId} value={value} onChange={(event) => {
                  const option = control.options.find((item) => String(item.value) === event.target.value);
                  setValues((previous) => ({ ...previous, [control.key]: option.value }));
                }}>
                  {control.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : (
                <input id={controlId} type="range" min={control.min} max={control.max} step={control.step} value={value} aria-valuetext={formatted} onChange={(event) => setValues((previous) => ({ ...previous, [control.key]: Number(event.target.value) }))} />
              )}
            </div>
          );
        })}
      </div>
      <p className="dsp-concept-readout"><output>{readout}</output></p>
      {model.equation ? <p className="dsp-demo-equation">{model.equation}</p> : null}
      <div className="dsp-concept-footer">
        {note ? compact ? (
          <details className="dsp-model-notes">
            <summary>Model notes</summary>
            <p className="dsp-concept-note">{note}</p>
          </details>
        ) : <p className="dsp-concept-note">{note}</p> : <span />}
        <button type="button" onClick={() => setValues(defaultDemoValues(definition))}>Reset</button>
      </div>
    </figure>
  );
}

export default DspConceptDemo;
