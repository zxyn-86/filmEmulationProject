
import './App.css'
import FileUploader from "./fileUploader";

function App() {
  

  return (
    <div style = {{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <h1 style = {{
        color: '#000000',
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'left',
        paddingTop: '10px',
        fontFamily: 'Alte Haas Grotesk',
        letterSpacing: '-2px'

      }}>Film Emulation</h1>

      <FileUploader/>
    </div>
  )
}

export default App
