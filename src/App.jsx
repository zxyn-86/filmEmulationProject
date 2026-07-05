
import './App.css'
import FileUploader from "./fileUploader";
import { useEffect, useRef} from "react";
import { Renderer } from "./renderer.js";
import Controls from "./controls.jsx"
import LutPicker from './lutPicker.jsx';

function App() {
  
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);

  // const [lutLoaded, setLutLoaded]     = useState(false);

  

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

       
      <Controls renderer={rendererRef} />
          
      </div>
      
      <div id = "canvas-stage">
        <canvas id = "gl-canvas" ref = {canvasRef}/>
      </div>


    </div>
    



  )
}

export default App
