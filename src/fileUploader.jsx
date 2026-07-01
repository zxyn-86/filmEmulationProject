import {useState} from "react";

function FileUploader(){
    const [files, setFiles] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    //this event handler upon a file drop we store the file in droppedFiles then filter it and use setfiles to add it to an array 
    const handleDrop = (e) => {
        console.log("drop fired");
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const imageFiles = droppedFiles.filter(file => file.type.startsWith("image/"));
        
        if (imageFiles.length === 0) {
            console.log("❌ Upload failed - no valid image files");
            alert("Only image files are allowed!");
            setIsDragging(false);
            return;
        }


        setFiles(imageFiles);

        setIsDragging(false);

        console.log("image accepted");
    };

    //this just prevents the default web behaviour when you drag something
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpload = (e) => {
        console.log("d fired");
        e.preventDefault();
        const uploadedFiles = Array.from(e.target.files);
        const imageFiles = uploadedFiles.filter(file => file.type.startsWith("image/"));
        setFiles(imageFiles);


    };
    


    const [isDragging, setIsDragging] = useState(false);
    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);

    return (
        
        <div
            onDrop = {handleDrop}
            onDragOver = {handleDragOver}
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
                height: "100px",
                border: "2px dashed #f0f3a2",
                padding: "20px",

                
                borderRadius: "10px",
                fontFamily: "roboto mono",
                backgroundColor: isDragging ? "#3e2723" : "#ffffff" ,
            }}>

           <p
           style = {{
            color: "#3e2723"
           }}
           >Drag image files here</p>
           <ul>
            {files.map((file, index) => (
                <li key = {index}>{file.name}</li>
            ))}
            </ul> 
            <input 
            type="file" 
            name="img-upload" 
            id="img-upload" 
            style = {{display: "none"}}
            onChange={handleUpload}/>

            <label
            htmlFor="img-upload"
            onMouseEnter = {() => setIsHovered(true)}
            onMouseLeave = {() => setIsHovered(false)}
            style = {{
                color: isDragging ? "#3e2723" : "#ffffff",
                backgroundColor: isHovered ? "#f0f3a2": "#3e2723",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",      // centers vertically
                justifyContent: "center",  // centers horizontally
                flexDirection: "column",
                fontFamily: "roboto mono",

            }}
            > browse </label>
        </div>
    );
}

export default FileUploader;