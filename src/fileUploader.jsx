import {useState} from "react";

function FileUploader(){
    const [files, setFiles] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    };

    const handleDrag = (e) => {
        e.preventDefault();
    };

    return (
        <div
            onDrop = {handleDrop}
            onDrag = {handleDrag}
            style = {{
                border: "2px dashed #f0f3a2",
                padding: "20px",
                textAlign: "center",
                borderRadius: "5px",
                fontFamily: "roboto mono"

            }}
        >
           <p>Drag image files here</p>
           <ul>
            {files.map((file, index) => (
                <li key = {index}>{file.name}</li>
            ))}
            </ul> 
        </div>
    );
}

export default FileUploader;