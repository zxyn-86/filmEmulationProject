import {useState} from "react";

function FileUploader(){
    const [files, setFiles] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const imageFiles = droppedFiles.filter(file => file.type.startsWith("image/"));
        setFiles(imageFiles);
    };

    const handleDrag = (e) => {
        e.preventDefault();
    };

    const [isDragging, setIsDragging] = useState(false);
    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);

    return (
        
        <div
            onDrop = {handleDrop}
            onDrag = {handleDrag}
            onDragEnter = {handleDragEnter}
            onDragLeave = {handleDragLeave}
            style = {{
                position: "absolute",  // takes it out of normal flow
                top: "100px",           // distance from top
                right: "20px", 
                display: "flex",
                alignItems: "center",      // centers vertically
                justifyContent: "center",  // centers horizontally
                flexDirection: "column", 
                width: "400px",
                height: "75px",
                border: "2px dashed #f0f3a2",
                padding: "20px",

                
                borderRadius: "10px",
                fontFamily: "roboto mono",
                backgroundColor: isDragging ? "#3e2723" : "#ffffff" ,
            }}>

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