
import './App.css'
import FileUploader from "./fileUploader";
import { useEffect, useRef, useState} from "react";
import { Renderer } from "./renderer.js";
import Controls from "./controls.jsx"
import LutPicker from './lutPicker.jsx';

function App() {
  
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const canvasStageRef = useRef(null);

  

  // const [lutLoaded, setLutLoaded]     = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [canvasStyle, setCanvasStyle] = useState({});

  const handleImageDrop = async (file) => {
    if (!rendererRef.current) {
      console.error('Renderer not ready');
      return;
    }

    const result = await rendererRef.current.loadImage(file);

    console.log('image dimensions:', result); // check what's coming back

    if (!result) {
      console.error('loadImage returned nothing');
      return;
    }

    const { width, height } = result;

    const stage = canvasStageRef.current;
    const maxW  = stage.clientWidth  * 0.7;
    const maxH  = stage.clientHeight * 0.7;

    const scale = Math.min(maxW / width, maxH / height, 1);

    setCanvasStyle({
      width:  Math.round(width  * scale) + 'px',
      height: Math.round(height * scale) + 'px',
    });

    setImageLoaded(true);
  };

  useEffect(() =>{

    rendererRef.current = new Renderer(canvasRef.current);

    return () =>{
      rendererRef.current.destroy();
    };

  }, []);



  return (
    <div style = {{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <h1 style = {{
        color: '#000000',
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'left',
        paddingTop: '5px',
        fontFamily: 'Alte Haas Grotesk',
        letterSpacing: '-2px'

      }}>Film Emulation</h1>

      <div>
      <FileUploader/>

      <LutPicker
          renderer={rendererRef}
          //onLutLoaded={() => setLutLoaded(true)}
      />

       
      {imageLoaded && (
          <>
            <Controls renderer={rendererRef} />
          </>
        )}
          
      </div>
      
      <div id = "canvas-stage" ref = {canvasStageRef}>
        <FileUploader onFileAccepted={handleImageDrop} />
        <canvas id = "gl-canvas" ref = {canvasRef} style={canvasStyle}/>
      </div>


    </div>
    



  )
}

export default App
