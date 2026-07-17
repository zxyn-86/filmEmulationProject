
import './App.css'
import FileUploader from "./fileUploader";
import { useCallback, useEffect, useRef, useState} from "react";
import { Renderer } from "./renderer.js";
import Controls from "./controls.jsx"
import LutPicker from './lutPicker.jsx';
import ExportButton from './exportButton.jsx';

function App() {
  
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const canvasStageRef = useRef(null);

  

    const [lutLoaded, setLutLoaded]     = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState(null);
    const [canvasStyle, setCanvasStyle] = useState({});

    const syncCanvasSize = useCallback((dimensions = imageDimensions) => {
      const stage = canvasStageRef.current;

      if (!stage || !dimensions) {
        return;
      }

      const maxW = stage.clientWidth * 0.92;
      const maxH = stage.clientHeight * 0.92;
      const scale = Math.min(maxW / dimensions.width, maxH / dimensions.height, 1);

      const displayWidth = Math.round(dimensions.width * scale);
      const displayHeight = Math.round(dimensions.height * scale);

      setCanvasStyle({
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
      });

      rendererRef.current?.resize(displayWidth, displayHeight);
      rendererRef.current?.render();
    }, [imageDimensions]);

    const handleImageDrop = async (file) => {
      if (!rendererRef.current) {
        console.error('Renderer not ready');
        return;
      }

    const result = await rendererRef.current.loadImage(file);

    if (!result) {
      console.error('loadImage returned nothing');
      return;
    }

    setImageDimensions(result);
    syncCanvasSize(result);

    setImageLoaded(true);
  };

  



  useEffect(() =>{

    rendererRef.current = new Renderer(canvasRef.current);

    return () =>{
      rendererRef.current.destroy();
    };

  }, []);

  useEffect(() => {
    const handleResize = () => syncCanvasSize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [syncCanvasSize]);

  useEffect(() => {
    if (imageDimensions) {
      syncCanvasSize(imageDimensions);
    }
  }, [imageDimensions, syncCanvasSize]);



  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Film Emulation</h1>
      </header>

      <div className="app-layout">
        <section id="canvas-stage" className="photo-panel" ref={canvasStageRef}>
          <div className="photo-toolbar">
            
          </div>

          <div className="photo-frame">
            <canvas id="gl-canvas" ref={canvasRef} style={canvasStyle} />
          </div>
        </section>

        <aside className="sidebar-panel">
          <FileUploader onFileAccepted={handleImageDrop} />
          <LutPicker renderer={rendererRef}  onLutLoaded={() => setLutLoaded(true)}/>
          {imageLoaded && lutLoaded && <Controls renderer={rendererRef} />}
          {imageLoaded && lutLoaded && <ExportButton renderer={rendererRef} />}
        </aside>
      </div>
    </div>
    



  )
}

export default App
