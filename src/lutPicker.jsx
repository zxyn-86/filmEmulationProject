
import { useState } from 'react';


// LUT CATALOGUE

const LUTS = [
  { label: 'Select a film look...', file: null },
  { label: '── Kodak ──',           file: null,                  disabled: true },
  { label: 'Kodak BW 400',          file: 'kodak_bw_400_cn.cube' },
  { label: '── Fujifilm ──',        file: null,                  disabled: true },
  { label: 'Fuji superia 200',      file: 'fuji_superia_200.cube'},
  { label: 'Fuji velvia 50',        file:  'fuji_velvia_50.cube' },
  { label: '── Ilford ──',          file: null,                  disabled: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// LUT PICKER COMPONENT
// Props:
//   renderer — React ref holding the Renderer class instance (from App.jsx)
//   onLutLoaded — optional callback so App.jsx knows a LUT is active
// ─────────────────────────────────────────────────────────────────────────────
export default function LutPicker({ renderer, onLutLoaded }) {
  const [selected, setSelected]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleChange = async (e) => {
    const file = e.target.value;

    // user picked the placeholder or a group header
    if (!file) return;

    setSelected(file);
    setLoading(true);
    setError(null);

    try {
      // .cube files sit in /public/luts/ and are served as static assets by Vite
      const res = await fetch(`/luts/${file}`);

      if (!res.ok) {
        throw new Error(`Could not load ${file} (${res.status})`);
      }

      const cubeText = await res.text();
      renderer.current?.loadLut(cubeText);
      onLutLoaded?.(); // tell App.jsx a LUT is now active

    } catch (err) {
      console.error('LUT load error:', err);
      setError(`Failed to load LUT — check the file is in /public/luts/`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lut-picker"
     style ={{
        position: "absolute",  // takes it out of normal flow
        top: "290px",           // distance from top
        right: "160px", 
        display: "flex",
        alignItems: "center",      // centers vertically
        justifyContent: "center",  // centers horizontally
        flexDirection: "column",
        fontFamily: "roboto mono"
     }}
    
    >
      <h3>Film Look</h3>

      <div className="select-wrapper">
        <select
          value={selected}
          onChange={handleChange}
          disabled={loading}
          className={loading ? 'loading' : ''}
        >
          {LUTS.map(({ label, file, disabled }) => (
            <option
              key={label}
              value={file ?? ''}
              disabled={disabled || file === null}
            >
              {label}
            </option>
          ))}
        </select>

        {/* loading spinner shown inside the wrapper next to the select */}
        {loading && <span className="spinner" aria-label="Loading LUT" />}
      </div>

      {/* only shown if the fetch fails */}
      {error && <p className="lut-error">{error}</p>}
    </div>
  );
}