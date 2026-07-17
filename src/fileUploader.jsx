import {useState} from "react";  //this is the use state hook that allows us to add a state variable to a component and update it 

function FileUploader({onFileAccepted}){
    //here we are setting up those state variables and what sets them 
    const [files, setFiles] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    //this event handler upon a file drop we store the file in droppedFiles then filter it and use setfiles to add it to an array 
    const handleDrop = (e) => {
        console.log("drop fired");
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const imageFiles = droppedFiles.filter(file => file.type.startsWith("image/"));
        
        if (imageFiles.length === 0) {
            console.log(" Upload failed no valid image files");
            alert("Only image files are allowed!");
            setIsDragging(false);
            return;
        }

        setFiles(imageFiles);
        setIsDragging(false);
        onFileAccepted?.(imageFiles[0]); 
        console.log("image accepted");
    };

    //this just prevents the default web behaviour when you drag something
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    //this is an event handler so we can also add files via a browse button 
    const handleUpload = (e) => {
        console.log("d fired");
        e.preventDefault();
        const uploadedFiles = Array.from(e.target.files);
        console.log("uploadedFiles array:", uploadedFiles);

        const imageFiles = uploadedFiles.filter(file => file.type.startsWith("image/"));
         
        setFiles(imageFiles);
        console.log("calling onFileAccepted with:", imageFiles[0]);
        onFileAccepted?.(imageFiles[0]); 

    };
    

    //handles behaviour so we can change colour of drop zone when dragging files onto it for visual feedback
    const [isDragging, setIsDragging] = useState(false);
    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);

    return (
        
        <div

            //assigns variables to the eventhandlers to say when this happens call event handler
            onDrop = {handleDrop}
            onDragOver = {handleDragOver}
            onDragEnter = {handleDragEnter}
            onDragLeave = {handleDragLeave}
            className="uploader-card"
            style={{ backgroundColor: isDragging ? "#3e2723" : "#ffffff" }}>

           <p
           style = {{
            color: "#3e2723"
           }}
           >Drag image files here</p>
        
           <ul>
            {files.map((file, index) => (
                <li key = {index}>{file.name}</li>  // turns an array of file objects into a bulleted/numbered list of their filenames.
            ))}
            </ul> 


            <input 
                type="file" 
                name="img-upload" 
                id="img-upload" 
                style = {{display: "none"}}
                onChange={handleUpload}
            />

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