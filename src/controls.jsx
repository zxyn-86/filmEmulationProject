// src/ui/Controls.jsx
import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// SLIDER CONFIG
// Add or remove sliders here without touching any other code.
// min/max/step/default are all defined in one place.
// ─────────────────────────────────────────────────────────────────────────────
const SLIDERS = [
  {
    key:     'exposure',
    label:   'Exposure',
    min:     -3,
    max:     3,
    step:    0.01,
    default: 0,
    unit:    'EV',
  },
  {
    key:     'contrast',
    label:   'Contrast',
    min:     -0.5,
    max:     0.5,
    step:    0.01,
    default: 0,
    unit:    '',
  },
  {
    key:     'saturation',
    label:   'Saturation',
    min:     -1,
    max:     1,
    step:    0.01,
    default: 0,
    unit:    '',
  },
  {
    key:     'lutStrength',
    label:   'LUT Strength',
    min:     0,
    max:     1,
    step:    0.01,
    default: 1,
    unit:    '',
  },
];

const DEFAULTS = Object.fromEntries(SLIDERS.map((s) => [s.key, s.default]));

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLS COMPONENT
// Props:
//   renderer — React ref holding the Renderer class instance (from App.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export default function Controls({ renderer }) {
  const [values, setValues] = useState(DEFAULTS);

  // update a single slider value in state and push it to the renderer
  const handleChange = (key, rawValue) => {
    const val = parseFloat(rawValue);
    setValues((prev) => ({ ...prev, [key]: val }));
    renderer.current?.setAdjustments({ [key]: val });
  };

  // zero all sliders back to defaults and tell the renderer
  const handleReset = () => {
    setValues(DEFAULTS);
    renderer.current?.setAdjustments(DEFAULTS);
  };

  return (
    <div className="controls-panel">
      <div className="controls-header">
        <h3>Adjustments</h3>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="sliders"
        style = {{
            position: "absolute",  // takes it out of normal flow
            top: "420px",           // distance from top
            right: "145px", 
            display: "flex",
            alignItems: "center",      // centers vertically
            justifyContent: "center",  // centers horizontally
            flexDirection: "column",
            fontFamily: "roboto mono"
        }}
      >
        {SLIDERS.map(({ key, label, min, max, step, unit }) => (
          <div key={key} className="slider-row">

            <div className="slider-label-row">
              <label htmlFor={key}>{label}</label>
              <span className="slider-value">
                {values[key] >= 0 ? '+' : ''}
                {values[key].toFixed(2)}
                {unit && ` ${unit}`}
              </span>
            </div>

            <input
              id={key}
              type="range"
              min={min}
              max={max}
              step={step}
              value={values[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />

          </div>
        ))}
      </div>
    </div>
  );
}